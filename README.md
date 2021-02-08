![Publish Status](https://github.com/ether/ep_author_hover/workflows/Node.js%20Package/badge.svg) ![Backend Tests Status](https://github.com/ether/ep_author_hover/workflows/Backend%20tests/badge.svg)


# Show Author Name on hover

Hover over an author to see their name

# Other functionality

Shows the author color on hover
Supports fast switching between hovers (Doesn't depend on native browser support)

# Settings
## Disable/enable author hover locally in your browser
This plugin adds a new switch called _Show Author on Hover_ to the settings menu. This allows you to disable/enable the display of author names on hover in your browser.

## Disable author hover by default for all clients
To don't show the author names on hover by default (the user has to activate in manually), add the following to your `setting.json`:
```json
  // disable author hover by default
  "ep_author_hover": {
    "disabledByDefault": true
  }
```

# Why did I rewrite this?
I don't really like plugins that depdend on manipulating the ACE inner DOM, rewriting this plugin and using events meant I could still have hover functionality without the risk of running into nasty ACE issues down the line.  It also meant that as new authors joined and updated their name I could update hte hovers in real time.  Previous attempts at writing this plugin have required a browser refresh to know who authors are, that wasn't good enough for me.

# TODO

* use JQTip
* Your ideas here..
* Test in IE
* Settings for font size/background color switch
* Your sponsorship here..
