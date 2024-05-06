$(document).ready(function() {
    // Fetch JSON data
    //console.log("hello...arguments.")
    $.getJSON('data.json', function(data) {  
      // Iterate through each item in the JSON arr
      $.each(data, function(index, item) {
        var row = $('<tr>');
        // Add cells to the row with data
        $('<td>').text(item.id).appendTo(row);
        $('<td>').text(item.modelName).appendTo(row);
        $('<td>').text(item.applePrice).appendTo(row);
        $('<td>').text(item.ecoPrice).appendTo(row);
        // Append the row to the table body
        $('#data-table-body').append(row);
      });
    });
  });