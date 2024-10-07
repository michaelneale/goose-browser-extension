# ChatGPT to goose
This is a browser extension (chrome, brave etc): Start your project in chatGPT, and then "eject" to goose where you can run code and continue development of it locally with all the context from your chatGPT or chatGPT canvas session.

## Installation and usage

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.
5. Run `python goose-listen.py`

## Limitations and TODO

Have to run a goose listener for now to hand off to a goose session
Doesn't as crisply pull out context as it could
Only tested with ChatGPT
Only starts new sessions
TODO: should be able to push back into chatgpt to add in newer context from the session in goose and go back and forth ideally (can use session jsonl for that ideally to sync context)

