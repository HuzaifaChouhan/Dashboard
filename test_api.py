import requests
import sys

BASE_URL = 'http://localhost:8000/api'

def test_api():
    print("Testing API...")
    
    # 1. Login
    try:
        response = requests.post(f'{BASE_URL}/token/', data={'username': 'admin', 'password': 'admin'})
        if response.status_code != 200:
            print(f"Login failed: {response.text}")
            return
        
        token = response.json()['access']
        print("Login successful. Token obtained.")
        headers = {'Authorization': f'Bearer {token}'}
    except Exception as e:
        print(f"Connection failed: {e}")
        return

    # 2. Get Products
    try:
        response = requests.get(f'{BASE_URL}/products/', headers=headers)
        if response.status_code == 200:
            print(f"Products fetched: {len(response.json())} items")
        else:
            print(f"Products fetch failed: {response.status_code}")
    except Exception as e:
        print(f"Products fetch error: {e}")

    # 3. Get Dashboard Stats
    try:
        response = requests.get(f'{BASE_URL}/dashboard-stats/', headers=headers)
        if response.status_code == 200:
            stats = response.json()
            print("Dashboard Stats fetched:")
            print(f"  Revenue: {stats['kpi']['total_revenue']}")
            print(f"  Orders: {stats['kpi']['total_orders']}")
        else:
            print(f"Dashboard Stats fetch failed: {response.status_code}")
    except Exception as e:
        print(f"Dashboard fetch error: {e}")

if __name__ == '__main__':
    test_api()
