import socket
import requests

def check_port(host, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(2)
    result = sock.connect_ex((host, port))
    sock.close()
    return result == 0

def check_http(url):
    try:
        response = requests.get(url, timeout=5)
        return response.status_code
    except requests.exceptions.RequestException as e:
        return str(e)

print("Checking Frontend (5173)...")
for host in ['localhost', '127.0.0.1']:
    if check_port(host, 5173):
        print(f"  {host}:5173 Open: YES")
        print(f"  HTTP Response: {check_http(f'http://{host}:5173')}")
    else:
        print(f"  {host}:5173 Open: NO")

print("\nChecking Backend (8000)...")
for host in ['localhost', '127.0.0.1']:
    if check_port(host, 8000):
        print(f"  {host}:8000 Open: YES")
        print(f"  HTTP Response: {check_http(f'http://{host}:8000/api/')}")
    else:
        print(f"  {host}:8000 Open: NO")
