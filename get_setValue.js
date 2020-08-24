// Get value by element id
<input type="text" id="searchTxt" class="searchField"/>
<input type="button" value="Get Value" onclick="alert(searchTxt.value)">


// Set value in form element
<form name="calc" id="calculator">
  <input type="text" name="input">
  <input type="button" value="Set Value" onclick="calc.input.value='Set Value'">
</form>
