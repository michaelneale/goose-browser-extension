import http.server
import socketserver
import json
import os
import tempfile
import subprocess

class GooseHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
                
        try:
            json_data = json.loads(post_data.decode('utf-8'))
            
            # Use system's temp directory
            temp_dir = tempfile.gettempdir()
            chat_file_path = os.path.join(temp_dir, 'chat_session.json')
            plan_file_path = os.path.join(temp_dir, 'plan.yaml')
            
            # Save chat session
            with open(chat_file_path, 'w') as f:
                json.dump(json_data, f, indent=2)
            
            print(f"Chat data saved to {chat_file_path}")
            
            # Create plan.yaml
            plan_content = f"""kickoff_message: |
  You are picking up from a chatgpt chat session and will want to execute/test/write code for the user as described in the context.

tasks:
  - please read the chatgpt context from {chat_file_path}
  - look at the chat context to work out what things are up to, if we need to test something
  - note where code blocks may be in the context, and what content is irrelevant
  - if you are running in an empty directory, assume that the user will want to build some of what was described in the chat session thus far as a new project (ask if not clear)
  - check if in an existing project dir, and look around and work out how to contribute to it from the chat so far (ask if unclear).
  - decide if you want to ask the user what to do next, with a summary of the last interaction from chat
"""
            
            with open(plan_file_path, 'w') as f:
                f.write(plan_content)
            
            print(f"Plan saved to {plan_file_path}")
            
            # Ensure the directory exists before starting Goose
            os.makedirs(os.path.expanduser('~/Documents/goose-chat'), exist_ok=True)

            # Open Terminal and start Goose with the plan
            applescript = f'''
            tell application "Terminal"
                activate
                do script "cd ~/Documents/goose-chat && goose session start --plan {plan_file_path}"
            end tell
            '''
            subprocess.run(["osascript", "-e", applescript])
            
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(f"Data received. Chat saved to {chat_file_path}. Plan saved to {plan_file_path}. Goose started with plan.".encode('utf-8'))
        except json.JSONDecodeError:
            print("Received data is not valid JSON")
            self.send_response(400)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"Error: Received data is not valid JSON")

    def do_GET(self):
        if self.path == '/context':
        # Return some mock context data for testing
                context_data = {
            'text': 'This is a sample context text from the server.'
        }
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(context_data).encode('utf-8'))
        return

    # For other GET requests, return a simple message
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b"Goose Listener is running")

PORT = 9898

print(f"Starting Goose Listener on port {PORT}")
print("Waiting for data...")

with socketserver.TCPServer(("", PORT), GooseHandler) as httpd:
    httpd.serve_forever()