# test_api.py

import requests

BASE_URL = 'http://127.0.0.1:8000'

# 1. Register a new user
register_url = f'{BASE_URL}/api/users/'
user_data = {
    'email': 'testuser@example.com',
    'username': 'testuser',
    'password': 'testpassword123'
}
response = requests.post(register_url, json=user_data)
print('Register User Response:', response.status_code, response.json())

# 2. Obtain JWT token
token_url = f'{BASE_URL}/api/token/'
token_data = {
    'email': 'testuser@example.com',
    'password': 'testpassword123'
}
response = requests.post(token_url, json=token_data)
print('Token Response:', response.status_code, response.json())
tokens = response.json()
access_token = tokens.get('access')

# 3. Get user details using the token
headers = {'Authorization': f'Bearer {access_token}'}
user_detail_url = f'{BASE_URL}/api/users/'
response = requests.get(user_detail_url, headers=headers)
print('User Detail Response:', response.status_code, response.json())


