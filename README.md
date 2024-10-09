# ChatGPT to goose
This is a browser extension (chrome, brave etc): Start your project in chatGPT, and then "eject" to goose where you can run code and continue development of it locally with all the context from your chatGPT or chatGPT canvas session.

Uses https://github.com/block-open-source/goose (assumes you have that installed already)

Live demo of it making a web scraper from chatgpt -> goose: 

https://github.com/user-attachments/assets/dedde39c-6eb9-425e-a2cf-6588605e3afe


## Installation and usage

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.
5. Run `python goose-listen.py`


## Limitations and TODO

Have to run a goose listener for now to hand off to a goose session (would like to replace this with something more native)
Doesn't as crisply pull out context as it could
Only tested with ChatGPT
Only starts new sessions


<img width="1268" alt="image" src="https://github.com/user-attachments/assets/ababf8e0-b49e-4c80-b8bc-1709f37220ad">
