document.getElementById('csvFile').addEventListener('change', function(e) {
  var file = e.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function(e) {
      var contents = e.target.result;
      processData(contents); // Process CSV data
  };
  reader.readAsText(file);
});

// Function to process CSV data
function processData(csvData) {
  var lines = csvData.split('\n');
  var data = [];
  var headers = lines[0].split(','); // Assuming headers are in the first line

  for (var i = 1; i < lines.length; i++) {
      var values = lines[i].split(',');
      if (values.length === headers.length) {
          var entry = {};
          for (var j = 0; j < headers.length; j++) {
              entry[headers[j].trim()] = values[j].trim();
          }
          data.push(entry);
      }
  }

  // Save data array to use for searching later
  window.csvData = data;
  window.csvHeaders = headers;
  console.log(window.csvData);  // Debugging: print the data to the console
}

// Function to handle search button click
function searchICSCode() {
  var searchInput = document.getElementById('searchInput').value.trim();
  var resultsList = document.getElementById('resultsList');
  var resultsList2 = document.getElementById('resultsList2');
  var resultsTableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
  
  resultsList.innerHTML = '';
  resultsList2.innerHTML = '';
  resultsTableBody.innerHTML = '';
  
  if (!window.csvData) {
    alert('No CSV data available.');
    return;
  }

  // Search for ICS Code
  var foundIndexes = [];
  for (var i = 0; i < window.csvData.length; i++) {
    if (window.csvData[i]['ICS Code'] === searchInput ||
        window.csvData[i]['Part Name'] === searchInput ||
        window.csvData[i]['Program Name'] === searchInput ||
        window.csvData[i]['Line No.'] === searchInput ||
        window.csvData[i]['Machine No.'] === searchInput ||
        window.csvData[i]['Feeder Type'] === searchInput) {
        
      foundIndexes.push(i);
    }
  }

  if (foundIndexes.length > 0) {
    // Display ICS Code, Part Name, and other details only once
    var firstFoundIndex = foundIndexes[0];
    
    var option = document.createElement('option');
    option.text = window.csvData[firstFoundIndex]['ICS Code'];
    resultsList.add(option);

    var option2 = document.createElement('option');
    option2.text = window.csvData[firstFoundIndex]['Part Name'];
    resultsList2.add(option2);

    // Display all Program Names and Line Nos that match the ICS Code
    foundIndexes.forEach(function(index) {
      var row = resultsTableBody.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2)
      var cell4 = row.insertCell(3)
      cell1.textContent = window.csvData[index]['Program Name'];
      cell2.textContent = window.csvData[index]['Feeder Type'];
      cell3.textContent = window.csvData[index]['Machine No.'];
      cell4.textContent = window.csvData[index]['Line No.'];
    });

  } else {
    alert('ICS Code not found.');
  }
}