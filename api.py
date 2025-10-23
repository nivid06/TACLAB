#!/usr/bin/env python3
"""
TACLAB Analytics API (Python Version)
Real-time visitor tracking and email collection system
"""

import json
import os
import hashlib
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import sys

# Data directory and files
DATA_DIR = 'data'
VISITORS_FILE = os.path.join(DATA_DIR, 'visitors.json')
EMAILS_FILE = os.path.join(DATA_DIR, 'emails.json')
STATS_FILE = os.path.join(DATA_DIR, 'stats.json')

# Create data directory if it doesn't exist
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR, mode=0o755)

# Initialize files
def init_files():
    if not os.path.exists(VISITORS_FILE):
        with open(VISITORS_FILE, 'w') as f:
            json.dump([], f)
    
    if not os.path.exists(EMAILS_FILE):
        with open(EMAILS_FILE, 'w') as f:
            json.dump([], f)
    
    if not os.path.exists(STATS_FILE):
        with open(STATS_FILE, 'w') as f:
            json.dump({
                'total_visitors': 0,
                'total_emails': 0,
                'total_coupons': 0,
                'last_updated': datetime.now().isoformat()
            }, f)

init_files()

# Helper functions
def read_json_file(filename):
    try:
        with open(filename, 'r') as f:
            return json.load(f)
    except:
        return []

def write_json_file(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)

class APIHandler(BaseHTTPRequestHandler):
    
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        self._set_headers()
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        query = parse_qs(parsed_path.query)
        action = query.get('action', [''])[0]
        
        if action == 'health':
            self._set_headers()
            response = {
                'success': True,
                'message': 'TACLAB Analytics API is running (Python)',
                'timestamp': datetime.now().isoformat(),
                'version': sys.version
            }
            self.wfile.write(json.dumps(response).encode())
        
        elif action == 'get_stats':
            visitors = read_json_file(VISITORS_FILE)
            emails = read_json_file(EMAILS_FILE)
            
            # Calculate daily visitors for last 7 days
            daily_visitors = [0] * 7
            # Simplified version - just count all visitors
            for visitor in visitors:
                # In a real implementation, we'd parse dates
                pass
            
            self._set_headers()
            response = {
                'success': True,
                'stats': {
                    'total_visitors': len(visitors),
                    'total_emails': len(emails),
                    'total_coupons': len(emails),
                    'last_updated': datetime.now().isoformat()
                },
                'daily_visitors': daily_visitors,
                'recent_visitors': visitors[-10:][::-1] if len(visitors) > 10 else visitors[::-1]
            }
            self.wfile.write(json.dumps(response).encode())
        
        elif action == 'get_emails':
            emails = read_json_file(EMAILS_FILE)
            emails.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
            
            self._set_headers()
            response = {
                'success': True,
                'emails': emails,
                'total': len(emails)
            }
            self.wfile.write(json.dumps(response).encode())
        
        else:
            self._set_headers(400)
            response = {
                'success': False,
                'message': 'Invalid action',
                'available_actions': {
                    'track_visitor': 'POST - Track a new visitor',
                    'submit_email': 'POST - Submit email and get coupon',
                    'get_stats': 'GET - Get all statistics',
                    'get_emails': 'GET - Get email subscribers list',
                    'health': 'GET - API health check'
                }
            }
            self.wfile.write(json.dumps(response).encode())
    
    def do_POST(self):
        parsed_path = urlparse(self.path)
        query = parse_qs(parsed_path.query)
        action = query.get('action', [''])[0]
        
        # Read request body
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        
        try:
            data = json.loads(body) if body else {}
        except:
            data = {}
        
        if action == 'track_visitor':
            visitors = read_json_file(VISITORS_FILE)
            
            visitor_data = {
                'id': f'V{len(visitors) + 1}',
                'ip': self.client_address[0],
                'timestamp': datetime.now().isoformat(),
                'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'user_agent': self.headers.get('User-Agent', 'Unknown')
            }
            
            visitors.append(visitor_data)
            write_json_file(VISITORS_FILE, visitors)
            
            # Update stats
            stats = read_json_file(STATS_FILE)
            stats['total_visitors'] = len(visitors)
            stats['last_updated'] = datetime.now().isoformat()
            write_json_file(STATS_FILE, stats)
            
            self._set_headers()
            response = {
                'success': True,
                'message': 'Visitor tracked',
                'visitor_id': visitor_data['id'],
                'total_visitors': len(visitors)
            }
            self.wfile.write(json.dumps(response).encode())
        
        elif action == 'submit_email':
            email = data.get('email', '').strip()
            
            if not email or '@' not in email:
                self._set_headers(400)
                response = {
                    'success': False,
                    'message': 'Invalid email address'
                }
                self.wfile.write(json.dumps(response).encode())
                return
            
            emails = read_json_file(EMAILS_FILE)
            
            # Check if email already exists
            for existing in emails:
                if existing['email'] == email:
                    self._set_headers()
                    response = {
                        'success': True,
                        'message': 'Email already registered',
                        'coupon_code': existing['coupon_code'],
                        'already_registered': True
                    }
                    self.wfile.write(json.dumps(response).encode())
                    return
            
            # Generate coupon code
            hash_input = f"{email}{datetime.now().isoformat()}".encode()
            coupon_code = 'WELCOME20' + hashlib.md5(hash_input).hexdigest()[:4].upper()
            
            email_data = {
                'email': email,
                'coupon_code': coupon_code,
                'timestamp': datetime.now().isoformat(),
                'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'ip': self.client_address[0],
                'used': False
            }
            
            emails.append(email_data)
            write_json_file(EMAILS_FILE, emails)
            
            # Update stats
            stats = read_json_file(STATS_FILE)
            stats['total_emails'] = len(emails)
            stats['total_coupons'] = len(emails)
            stats['last_updated'] = datetime.now().isoformat()
            write_json_file(STATS_FILE, stats)
            
            self._set_headers()
            response = {
                'success': True,
                'message': 'Email registered successfully',
                'coupon_code': coupon_code,
                'already_registered': False
            }
            self.wfile.write(json.dumps(response).encode())
        
        else:
            self._set_headers(400)
            response = {
                'success': False,
                'message': 'Invalid action'
            }
            self.wfile.write(json.dumps(response).encode())
    
    def log_message(self, format, *args):
        # Custom logging
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, APIHandler)
    print(f"""
╔═══════════════════════════════════════════════════════════╗
║         🚀 TACLAB Real-Time Analytics API Server          ║
╚═══════════════════════════════════════════════════════════╝

✅ Server is running on: http://localhost:{port}

📊 Open these URLs:
   • Website:   http://localhost:{port}/index.html
   • API Test:  http://localhost:{port}/api.py?action=health
   • Test Page: http://localhost:{port}/test.html

🔑 Admin Dashboard Login:
   • Username: admin
   • Password: admin

⏹️  Press Ctrl+C to stop the server

═══════════════════════════════════════════════════════════
    """)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✅ Server stopped. Goodbye!")
        httpd.shutdown()

if __name__ == '__main__':
    run_server()

