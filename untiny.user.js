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

// Behaviours: what happens when the url has been expanded (for now we always
// begin by inserting an icon after the link we are expanding).  Each behaviour
// implementation should take the original link and the new URL.

function behaviourUpdateIcon(link, newurl) {
  // We know that the icon+link to update is the immediate sibling of the link.
  var icon_link = link.nextSibling;
  var icon = icon_link.firstChild;
  icon.setAttribute('title', newurl);
  icon_link.href = newurl;
}

function convertLinks(services) {
  var untinyIconURL = chrome.extension.getURL('icons/untiny-16x16.png');

  var links = document.evaluate(
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
      (function(link) {
         chrome.extension.sendRequest({'action':'untinyURL',
                                       'old_url': link.href},
           function(newurl) {
             behaviourUpdateIcon(link, newurl);
           });
       })(link);
    }
  }
}


// Kick everything off; delegate to the background html to first check if
// the current page is ignored, and if not get the list of supported
// services; convertLinks is the callback which expands all supported urls:
chrome.extension.sendRequest({'action':'checkIfFiltered',
                              'url'   : window.location.href},
  function(isFiltered) {
    if (!isFiltered)
      chrome.extension.sendRequest({'action':'getSupportedServices'},
                                   convertLinks);
  }
);
