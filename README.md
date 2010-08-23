Untiny.ws
=========

[Untiny.ws](http://untiny.ws) is a service that expands a huge number
(233, at time of writing!) of URLs as shortened by bit.ly, is.gd, etc.
It's a very clean, tidy, and performant site --- you should check it
out.

Chrome Extensions
=================

The site also offers an API, and there are a few add-ons that take
advantage of this such as firefox plugins and native apps, listed
[here](http://untiny.ws/extra/).  There is an extension for Chrome,
but it requires you to manually enter the URL to be expanded into a
popup.  There is a greasemonkey script for firefox which transparently
expands and replaces shortened URLs inline, and a port of this with
slightly different behaviour (the original text is left intact, with
an icon with the expanded URL inserted) and dramatically improved
performance can be found
[here](http://github.com/markhepburn/untiny-greasemonkey).

Chrome can run greasemonkey scripts as extensions, with just a few
restrictions.  Unfortunately, one of those restrictions is on making
cross-site AJAX requests, which untiny of course relies on.

This extension then is a port of that modified greasemonkey script to
a Chrome extension, which circumvents that restriction.  It also adds
a few tweaks, such as the option to choose between URL update
behaviours like inserting a link next to the original text, or
replacing the original link with the expanded URL.

TODO
====

 * [DONE] Filter pages the script runs on (for example, skip bit.ly itself).
   The docs imply that this can't be done in the extension manifest,
   which seems a bit odd.
 * [DONE] Add alternative behaviour to replace the original text.
 * [DONE] Add a preferences page, with (at least) options to select the
   replacement behaviour, and specify the list of pages to ignore.
   Hopefully this can be accessed from the extensions page, since I
   don't want to add a browser_action icon (unnecessary clutter).
 * Error handing: only replace the url if it was correctly expanded
   (the greasemonkey script needs this too)
 * Style the options page up
   * Upload!
