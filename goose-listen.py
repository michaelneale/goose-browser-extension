import http.server
import socketserver
import json
from datetime import datetime

class GooseHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        print("Received data:")
        print(post_data.decode('utf-8'))
        
        try:
            json_data = json.loads(post_data.decode('utf-8'))
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"goose_data_{timestamp}.json"
            
            with open(filename, 'w') as f:
                json.dump(json_data, f, indent=2)
            
            print(f"Data saved to {filename}")
            
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"Data received and saved successfully")
        except json.JSONDecodeError:
            print("Received data is not valid JSON")
            self.send_response(400)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"Error: Received data is not valid JSON")

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b"Goose Listener is running")

PORT = 9898

with socketserver.TCPServer(("", PORT), GooseHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()