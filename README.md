gWidget is a small attempt to create a generic and easily customizable booking widget.The main purpose behind gWidget was to create something that can be easily used/integrated,avoids writing markups at the time of integrateing and ofcourse which should be efficient in terms of performance.

The architecture of gWidget mainly consists of three components:
  1. Autocomplete
  2. Date-picker
  3. Support for features like one-way,round-trip and multi-city

1.Autocomplete :
     This component is simply a mixed effect of input text-box and select-box with added autocomplete/typeahead functionality.To enhance performance, trie data-structure(http://goo.gl/PTe6k) has been used instead of Regular Expressions.To integrate this component, it only needs to create a div
     
     /*<div id="combo_zone4" style = "height:30px"> */
     and it needs one line of javascript,
     var z=new SuggestComboBase("combo_zone4","alfa4",400);
     (for more see **index.html**)


**2nd and 3rd component will be added soon with an updated version.**


**If you find any bug or problem please mention it on issue page.**


**Any contribution is appreciated.**
