document.addEventListener('DOMContentLoaded', function() {
  const resultDiv = document.getElementById('result');

  function scrapeAndDisplay() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "scrape"}, function(response) {
        if (response && response.data) {
          const jsonData = JSON.stringify(response.data, null, 2); // Pretty-print JSON
          const blob = new Blob([jsonData], {type: 'application/json'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'scraped_data.json';
          a.textContent = 'Download JSON';
          resultDiv.innerHTML = '';
          resultDiv.appendChild(a);
          
          // Display pretty-printed JSON in the popup
          const pre = document.createElement('pre');
          pre.textContent = jsonData;
          resultDiv.appendChild(pre);
        } else {
          resultDiv.textContent = 'Error: Could not scrape data';
        }
      });
    });
  }

  // Scrape immediately when the popup opens
  scrapeAndDisplay();
});