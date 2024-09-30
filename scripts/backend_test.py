import requests
import pytest # pytest scripts/backend_test.py
import time

BASE_URL = "http://127.0.0.1:5000"

@pytest.fixture(scope="module")
def tokens():
    # Delete user if exists
    url = f"{BASE_URL}/delete_user"
    requests.post(url, json={"username": "testuser"})

    # Register user
    url = f"{BASE_URL}/register"
    requests.post(url, json={"username": "testuser", "password": "testpassword"})

    # Login user and get tokens
    url = f"{BASE_URL}/login"
    response = requests.post(url, json={"username": "testuser", "password": "testpassword"})
    data = response.json()
    return [data["access_token"], data["refresh_token"]]  # Return tokens as a list

def test_delete_user():
    url = f"{BASE_URL}/delete_user"
    response = requests.post(url, json={"username": "testuser"})
    assert response.status_code in [200, 404], f"Unexpected status code: {response.status_code}"

def test_register():
    url = f"{BASE_URL}/register"
    response = requests.post(url, json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 201 or response.json().get("error") == "User already exists", f"Unexpected response: {response.text}"

def test_login(tokens):
    access_token, refresh_token = tokens
    assert access_token is not None, "Access token is None"
    assert refresh_token is not None, "Refresh token is None"

def test_protected(tokens):
    access_token, _ = tokens
    url = f"{BASE_URL}/protected"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    assert response.json().get("logged_in_as") == "testuser", f"Unexpected response: {response.text}"

def test_refresh(tokens):
    _, refresh_token = tokens
    url = f"{BASE_URL}/refresh"
    headers = {"Authorization": f"Bearer {refresh_token}"}
    response = requests.post(url, headers=headers)
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    data = response.json()
    assert "access_token" in data, f"Unexpected response: {response.text}"
    tokens[0] = data["access_token"]  # Update the access token in the tokens list

def test_logout(tokens):
    access_token, _ = tokens
    url = f"{BASE_URL}/logout"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.post(url, headers=headers)
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
    assert response.json().get("message") == "User logged out successfully", f"Unexpected response: {response.text}"

def test_all(tokens):
    start_time = time.time()
    test_delete_user()
    test_register()
    test_login(tokens)
    test_protected(tokens)
    test_refresh(tokens)
    test_logout(tokens)
    end_time = time.time()
    total_time = end_time - start_time
    print(f"Tests Completed. Total time taken: {total_time:.2f} seconds")
