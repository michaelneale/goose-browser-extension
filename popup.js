document.addEventListener('DOMContentLoaded', function() {
  const scrapeButton = document.getElementById('scrapeButton');

  function scrapeAndSend() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (!tabs || tabs.length === 0) {
        console.error('Error: No active tab found');
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {action: "scrape"}, function(response) {
        if (chrome.runtime.lastError) {
          console.error('Error:', chrome.runtime.lastError.message);
          return;
        }

        if (response && response.data) {
          const jsonData = JSON.stringify(response.data);
          
          // Send data to localhost:9898
          fetch('http://localhost:9898', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: jsonData,
          })
          .then(response => response.text())
          .then(result => {
            console.log('Data sent to localhost:9898');
          })
          .catch(error => {
            console.error('Error sending data to localhost:9898:', error.message);
document.getElementById('result').innerText = 'The goose listener must be running. Please run python goose-listen.py';
          });
        } else {
          console.error('Error: Could not scrape data');
        }
      });
    });

    const askGooseButton = document.getElementById('askGooseButton');
    if (askGooseButton) {  // Ensure the button exists before adding event listener
      askGooseButton.addEventListener('click', function () {
        fetch('http://localhost:9898/ask', {
          method: 'POST',
        })
          .then(response => response.text())
          .then(data => {
            console.log('Response from goose:', data);
            document.getElementById('result').innerText = data;
          })
          .catch(error => {
            console.error('Error asking goose:', error.message);
            document.getElementById('result').innerText = 'Error contacting goose.';
          });
      });
    }

  }

  // Scrape when the button is clicked
  scrapeButton.addEventListener('click', scrapeAndSend);
});