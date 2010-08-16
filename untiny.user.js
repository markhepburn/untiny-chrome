// Untiny Chrome content script
// version 1.0, based on version 1.1 of the corresponding greasemonkey script
// 2009-07-22, Mark Hepburn
// version 1.0
// 2008-10-09
// Copyright (c) 2008, UnTiny (by Saleh Al-Zaid. http://www.alzaid.ws)
// Website: http://untiny.me/
//
// License:
// Released under the Creative Commons Attribution-No v3.0 license
// http://creativecommons.org/licenses/by-nd/3.0/
//
// Description:
// Untiny GreaseMonkey Script is a greasemonkey
// script of UnTiny Servive (http://untiny.me)
// to extract the original urls from tiny one
// like tinyurl.com, tiny.pl  and many others.
//
// The original script would change the tiny urls links directly to
// the original links.  This version simply displays an icon with the
// original link, so you can preview it and decide which/whether to
// click, without altering the author's text too much.  Additionally,
// if you are using firefox 3.5 or greater, it will use the native
// support for JSON parsing instead of calling eval() (avoiding a
// security risk).

function convertLinks(services) {
  var untinyIconURL = chrome.extension.getURL('untiny.png');

  links = document.evaluate(
    '//a[@href]',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

  for (var i = 0; i < links.snapshotLength; i++) {
    var link = links.snapshotItem(i);
    var domainRE = /(http:\/\/)?([^\/]+)/; // we are interested in the domain; group 2

    var match = domainRE.exec(link.href);
    var domain = match ? match[2] : null;

    // if we've managed to extract the domain (shouldn't really fail
    // all that often), and the domain is listed in the untiny-d
    // services, create an icon with the original target:
    if (domain && domain in services) {
      var icon_link = document.createElement('a');
      icon_link.setAttribute('href', link);
      icon_link.setAttribute('id', 'untiny_link_id_' + i);
      var icon = document.createElement('img');
      icon.setAttribute('src',untinyIconURL);
      icon.setAttribute('class', 'untinyIcon');

      icon_link.appendChild(icon);
      link.parentNode.insertBefore(icon_link,link.nextSibling);

      // Delegate to the background html to expand the url; the callback
      // just updates the icon+link.  Note need to wrap in another closure,
      // because the call-back otherwise closes over the reference, not the
      // reference value.
      (function(icon_link, icon) {
         chrome.extension.sendRequest({'action':'untinyURL',
                                       'old_url': link.href},
           function(newurl) {
             icon.setAttribute('title', newurl);
             icon_link.href = newurl;
           });
       })(icon_link, icon);
    }
  }
}

// Kick everything off; delegate to the background html to get the list of
// supported services, then convertLinks is the callback which expands all
// supported urls:
chrome.extension.sendRequest({'action':'getSupportedServices'}, convertLinks);
