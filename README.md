# Show authorname on hover

Hover over an author to see their name

# Other functionality

Shows the author color on hover
Supports fast switching between hovers (Doesn't depend on native browser support)

# Why did I rewrite this?
I don't really like plugins that depdend on manipulating the ACE inner DOM, rewriting this plugin and using events meant I could still have hover functionality without the risk of running into nasty ACE issues down the line.  It also meant that as new authors joined and updated their name I could update hte hovers in real time.  Previous attempts at writing this plugin have required a browser refresh to know who authors are, that wasn't good enough for me.

# TODO

* use JQTip
* Your ideas here..
* Test in IE
* Settings for font size/background color switch
* Your sponsorship here..
