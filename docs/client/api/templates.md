{{#template name="api_templates"}}


<h2 id="templates_api"><span>Templates</span></h2>


When you write a template as `<{{! }}template name="foo"> ... <{{!
}}/template>` in an HTML file in your app, Meteor generates a
"template object" named `Template.foo`.

The same template may occur many times on a page, and these
occurrences are called template instances.  Template instances have a
life cycle of being created, put into the document, and later taken
out of the document and destroyed.  Meteor manages these stages for
you, including determining when a template instance has been removed
or replaced and should be cleaned up.  You can associate data with a
template instance, and you can access its DOM nodes when it is in the
document.

{{> autoApiBox "Template#events"}}

Declare event handlers for instances of this template. Multiple calls add
new event handlers in addition to the existing ones.

See [Event Maps](#eventmaps) for a detailed description of the event
map format and how event handling works in Meteor.

{{> autoApiBox "Template#helpers"}}

Each template has a local dictionary of helpers that are made available to it,
and this call specifies helpers to add to the template's dictionary.

Example:

    Template.myTemplate.helpers({
      foo: function () {
        return Session.get("foo");
      }
    });

Now you can invoke this helper with `{{dstache}}foo}}` in the template defined
with `<{{! }}template name="myTemplate">`.

To create a helper that can be used in any template, use
[`Template.registerHelper`](#template_registerhelper).


{{> autoApiBox "Template#rendered"}}

This callback is called once when an instance of Template.*myTemplate* is
rendered into DOM nodes and put into the document for the first time.

In the body of the callback, `this` is a [template
instance](#template_inst) object that is unique to this occurrence of
the template and persists across re-renderings.  Use the `created` and
`destroyed` callbacks to perform initialization or clean-up on the
object.

Because your template has been rendered, you can use functions like
[`this.findAll`](#template_findAll) which look at its DOM nodes.

{{> autoApiBox "Template#created"}}

This callback is called before your template's logic is evaluated for the first
time.  Inside the callback, `this` is the new [template
instance](#template_inst) object.  Properties you set on this object will be
visible from the `rendered` and `destroyed` callbacks and from event handlers.

This callback fires once and is the first callback to fire.  Every
`created` has a corresponding `destroyed`; that is, if you get a
`created` callback with a certain template instance object in `this`,
you will eventually get a `destroyed` callback for the same object.

`created` is a useful way to set up values on template instance that are
read from template helpers using `Template.instance()`.

{{> autoApiBox "Template#destroyed"}}

This callback is called when an occurrence of a template is taken off
the page for any reason and not replaced with a re-rendering.  Inside
the callback, `this` is the [template instance](#template_inst) object
being destroyed.

This callback is most useful for cleaning up or undoing any external effects of
`created` or `rendered`.  It fires once and is the last callback to fire.


<h2 id="template_inst"><span>Template instances</span></h2>

A template instance object represents an occurrence of a template in
the document.  It can be used to access the DOM and it can be
assigned properties that persist as the template is reactively updated.

Template instance objects are found as the value of `this` in the
`created`, `rendered`, and `destroyed` template callbacks, and as an
argument to event handlers.  You can access the current template instance
from helpers using [`Template.instance()`](#template_instance).

In addition to the properties and functions described below, you can assign
additional properties of your choice to the object. Use the
[`created`](#template_created) and [`destroyed`](#template_destroyed) callbacks
to perform initialization or clean-up on the object.

You can only access `findAll`, `find`, `firstNode`, and `lastNode`
from the `rendered` callback and event handlers, not from `created`
and `destroyed`, because they require the template instance to be
in the DOM.

Template instance objects are `instanceof Blaze.TemplateInstance`.

{{> autoApiBox "Blaze.TemplateInstance#findAll"}}

`template.findAll` returns an array of DOM elements matching `selector`.

{{> autoApiBox "Blaze.TemplateInstance#$"}}

`template.$` returns a [jQuery object](http://api.jquery.com/Types/#jQuery) of
those same elements. jQuery objects are similar to arrays, with
additional methods defined by the jQuery library.

The template instance serves as the document root for the selector. Only
elements inside the template and its sub-templates can match parts of
the selector.

{{> autoApiBox "Blaze.TemplateInstance#find"}}

Returns one DOM element matching `selector`, or `null` if there are no
such elements.

The template instance serves as the document root for the selector. Only
elements inside the template and its sub-templates can match parts of
the selector.

{{> autoApiBox "Blaze.TemplateInstance#firstNode"}}

The two nodes `firstNode` and `lastNode` indicate the extent of the
rendered template in the DOM.  The rendered template includes these
nodes, their intervening siblings, and their descendents.  These two
nodes are siblings (they have the same parent), and `lastNode` comes
after `firstNode`, or else they are the same node.

{{> autoApiBox "Blaze.TemplateInstance#lastNode"}}

{{> autoApiBox "Blaze.TemplateInstance#data"}}

This property provides access to the data context at the top level of
the template.  It is updated each time the template is re-rendered.
Access is read-only and non-reactive.

{{> autoApiBox "Blaze.TemplateInstance#autorun"}}

You can use `this.autorun` from a [`created`](#template_created) or
[`rendered`](#template_rendered) callback to reactively update the DOM
or the template instance.  The Computation is automatically stopped
when the template is destroyed.

Alias for `template.view.autorun`.

{{> autoApiBox "Blaze.TemplateInstance#view"}}

{{> autoApiBox "Template.registerHelper"}}

{{> autoApiBox "Template.instance"}}

{{> autoApiBox "Template.currentData"}}

{{> autoApiBox "Template.parentData"}}

For example, `Template.parentData(0)` is equivalent to `Template.currentData()`.  `Template.parentData(2)`
is equivalent to `{{dstache}}../..}}` in a template.

{{> autoApiBox "Template.body"}}

You can define helpers and event maps on `Template.body` just like on
any `Template.myTemplate` object.

Helpers on `Template.body` are only available in the `<body>` tags of
your app.  To register a global helper, use
[Template.registerHelper](#template_registerhelper).
Event maps on `Template.body` don't apply to elements added to the

body via `Blaze.render`, jQuery, or the DOM API, or to the body element
itself.  To handle events on the body, window, or document, use jQuery
or the DOM API.

{{> autoApiBox "Template.dynamic"}}

`Template.dynamic` allows you to include a template by name, where the name
may be calculated by a helper and may change reactively.  The `data`
argument is optional, and if it is omitted, the current data context
is used.

For example, if there is a template named "foo", `{{dstache}}> Template.dynamic
template="foo"}}` is equivalent to `{{dstache}}> foo}}`.

{{> apiBoxTitle name="Event Maps" id="eventmaps"}}

An event map is an object where
the properties specify a set of events to handle, and the values are
the handlers for those events. The property can be in one of several
forms:

<dl>
{{#dtdd "<em>eventtype</em>"}}
Matches a particular type of event, such as 'click'.
{{/dtdd}}

{{#dtdd "<em>eventtype selector</em>"}}
Matches a particular type of event, but only when it appears on
an element that matches a certain CSS selector.
{{/dtdd}}

{{#dtdd "<em>event1, event2</em>"}}
To handle more than one type of event with the same function, use a
comma-separated list.
{{/dtdd}}
</dl>

The handler function receives two arguments: `event`, an object with
information about the event, and `template`, a [template
instance](#template_inst) for the template where the handler is
defined.  The handler also receives some additional context data in
`this`, depending on the context of the current element handling the
event.  In a template, an element's context is the
data context where that element occurs, which is set by
block helpers such as `#with` and `#each`.

Example:

    {
      // Fires when any element is clicked
      'click': function (event) { ... },

      // Fires when any element with the 'accept' class is clicked
      'click .accept': function (event) { ... },

      // Fires when 'accept' is clicked or focused, or a key is pressed
      'click .accept, focus .accept, keypress': function (event) { ... }
    }

Most events bubble up the document tree from their originating
element.  For example, `'click p'` catches a click anywhere in a
paragraph, even if the click originated on a link, span, or some other
element inside the paragraph.  The originating element of the event
is available as the `target` property, while the element that matched
the selector and is currently handling it is called `currentTarget`.

    {
      'click p': function (event) {
        var paragraph = event.currentTarget; // always a P
        var clickedElement = event.target; // could be the P or a child element
      }
    }

If a selector matches multiple elements that an event bubbles to, it
will be called multiple times, for example in the case of `'click
div'` or `'click *'`.  If no selector is given, the handler
will only be called once, on the original target element.

The following properties and methods are available on the event object
passed to handlers:

<dl class="objdesc">
{{#dtdd name="type" type="String"}}
The event's type, such as "click", "blur" or "keypress".
{{/dtdd}}

{{#dtdd name="target" type="DOM Element"}}
The element that originated the event.
{{/dtdd}}

{{#dtdd name="currentTarget" type="DOM Element"}}
The element currently handling the event.  This is the element that
matched the selector in the event map.  For events that bubble, it may
be `target` or an ancestor of `target`, and its value changes as the
event bubbles.
{{/dtdd}}

{{#dtdd name="which" type="Number"}}
For mouse events, the number of the mouse button (1=left, 2=middle, 3=right).
For key events, a character or key code.
{{/dtdd}}

{{#dtdd "stopPropagation()"}}
Prevent the event from propagating (bubbling) up to other elements.
Other event handlers matching the same element are still fired, in
this and other event maps.
{{/dtdd}}

{{#dtdd "stopImmediatePropagation()"}}
Prevent all additional event handlers from being run on this event,
including other handlers in this event map, handlers reached by
bubbling, and handlers in other event maps.
{{/dtdd}}

{{#dtdd "preventDefault()"}}
Prevents the action the browser would normally take in response to this
event, such as following a link or submitting a form.  Further handlers
are still called, but cannot reverse the effect.
{{/dtdd}}

{{#dtdd "isPropagationStopped()"}}
Returns whether `stopPropagation()` has been called for this event.
{{/dtdd}}

{{#dtdd "isImmediatePropagationStopped()"}}
Returns whether `stopImmediatePropagation()` has been called for this event.
{{/dtdd}}

{{#dtdd "isDefaultPrevented()"}}
Returns whether `preventDefault()` has been called for this event.
{{/dtdd}}
</dl>

Returning `false` from a handler is the same as calling
both `stopImmediatePropagation` and `preventDefault` on the event.

Event types and their uses include:

<dl class="objdesc">
{{#dtdd "<code>click</code>"}}
Mouse click on any element, including a link, button, form control, or div.
Use `preventDefault()` to prevent a clicked link from being followed.
Some ways of activating an element from the keyboard also fire `click`.
{{/dtdd}}

{{#dtdd "<code>dblclick</code>"}}
Double-click.
{{/dtdd}}

{{#dtdd "<code>focus, blur</code>"}}
A text input field or other form control gains or loses focus.  You
can make any element focusable by giving it a `tabindex` property.
Browsers differ on whether links, checkboxes, and radio buttons are
natively focusable.  These events do not bubble.
{{/dtdd}}

{{#dtdd "<code>change</code>"}}
A checkbox or radio button changes state.  For text fields, use
`blur` or key events to respond to changes.
{{/dtdd}}

{{#dtdd "<code>mouseenter, mouseleave</code>"}} The pointer enters or
leaves the bounds of an element.  These events do not bubble.
{{/dtdd}}

{{#dtdd "<code>mousedown, mouseup</code>"}}
The mouse button is newly down or up.
{{/dtdd}}

{{#dtdd "<code>keydown, keypress, keyup</code>"}}
The user presses a keyboard key.  `keypress` is most useful for
catching typing in text fields, while `keydown` and `keyup` can be
used for arrow keys or modifier keys.
{{/dtdd}}

</dl>

Other DOM events are available as well, but for the events above,
Meteor has taken some care to ensure that they work uniformly in all
browsers.


{{/template}}