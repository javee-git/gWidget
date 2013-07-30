gWidget is a small attempt to create a generic and easily customizable booking widget.The main purpose behind gWidget was to create something that can be easily used/integrated,avoids writing markups at the time of integrateing and ofcourse which should be efficient in terms of performance.

The architecture of gWidget mainly consists of three components:
   1. Autocomplete
   2. Date-picker
   3. Support for features like one-way,round-trip and multi-city

<b>1.Autocomplete : </b>
     This component is simply a mixed effect of input text-box and select-box with added autocomplete/typeahead functionality.To enhance performance, trie data-structure(http://goo.gl/PTe6k) has been used instead of Regular Expressions.To integrate this component, it only needs to create a div
     
     /*<div id="combo_zone4" style = "height:30px"> */
     and it needs one line of javascript,
     var z=new SuggestComboBase("combo_zone4","alfa4",400);
     (for more see **index.html**)


<b>2.Date-picker :<b>
      This component is a simple date-picker calendar written in javascript. To add this datepicker it needs to create one input attribute(in markup) and following lines of javascript:
      
      /*<input type="text" name="start-date" id="start-date" class="date-pick" readonly="readonly" value="mm/dd/yy" onclick="start_datepicker.show();" />*/
      var start_datepicker = calen({
      dp_id_name: 'start-calen',     
      id_name: 'start-date',                
      max_date: '1Y',
      min_date: '0',
      display_count:2,
      onDateSelected: function() { DatePicked('start-date', end_datepicker); }
      });
      
      To customize this component it needs to change the following values:
     <i> dp_id_name: </i>
           location where the datepicker is to be displayed.
     <i> id_name:** </i>
           selector id where to populate a selected date.
     <i> display_count:** </i>
           number of months to display in datepicker,default is 1,maximum is 2.
     <i>max_date: </i>
           maximum date user can scroll forward to default is 1Y (one year)  acceptable values: 0, 3M, 6M, 9M, 1Y, 2Y, * (infinity)
     <i>min_date:</i>
           minimum date user can scroll backward to default is 0 (current date)  acceptable values: 0, 3M, 6M, 9M, 1Y, 2Y, * (infinity)
    <i>close_onselect:</i>
          default is true, acceptable values: true | false.
    
    
     (for more see <b>calendar/index.html</b>)

**If you find any bug or problem please mention it on issue page.**


**Any contribution is appreciated.**
