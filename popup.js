document.addEventListener('DOMContentLoaded', function() {
  const scrapeButton = document.getElementById('scrapeButton');
  const resultDiv = document.getElementById('result');

  scrapeButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "scrape"}, function(response) {
        if (response && response.data) {
          const jsonlData = response.data.map(JSON.stringify).join('\n');
          const blob = new Blob([jsonlData], {type: 'application/json'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'scraped_data.jsonl';
          a.textContent = 'Download JSONL';
          resultDiv.innerHTML = '';
          resultDiv.appendChild(a);
        } else {
          resultDiv.textContent = 'Error: Could not scrape data';
        }
      });
    });
  });
});