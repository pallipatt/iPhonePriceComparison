$(document).ready(function() {
    // Fetch JSON data
    //console.log("hello...arguments.")
    $.getJSON('data.json', function(data) {  
      // Iterate through each item in the JSON array
      console.log("hello...arguments.")
      $.each(data, function(index, item) {
        console.log("Steffy..........")
        // Create a new row
         
        var row = $('<tr>');
        
        // Add cells to the row with data
        $('<td>').text(item.id).appendTo(row);
        $('<td>').text(item.name).appendTo(row);
        $('<td>').text(item.email).appendTo(row);
        $('<td>').text(item.phone).appendTo(row);
        // Append the row to the table body
        $('#data-table-body').append(row);
      });
    });
  });