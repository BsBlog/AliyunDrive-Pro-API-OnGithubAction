import requests
import json
import os
import hashlib


def sha256(text):
    hash_object = hashlib.sha256()
    hash_object.update(text.encode('utf-8'))
    return hash_object.hexdigest()


login_url = "https://aliyundrive.pro/api/v1/auth/login"

email = os.environ["email"]
password_input = os.environ["password"]
password = sha256(password_input)

login_payload = json.dumps({
    "email": email,
    "password": password
})
login_headers = {
    'Content-Type': 'application/json'
}

login_response = requests.post(login_url, headers=login_headers, data=login_payload)

login_data = json.loads(login_response.text)

account_id_input = os.environ["account_id"].split(',')

signin_url = "https://aliyundrive.pro/api/v1/accounts/{account_id}/signin"

signin_payload = {}
access_token = login_data["data"]["session"]["access_token"]
signin_headers = {
    'Authorization': 'Bearer ' + access_token
}

# signin_response = requests.request("POST", signin_url, headers=signin_headers, data=signin_payload)

# 发送 POST 请求
signin_responses = []
for account_id in account_id_input:
    signin_response = requests.post(signin_url.format(account_id=account_id), headers=signin_headers,data=signin_payload)
    signin_responses.append(signin_response)

# 检查响应状态码
for signin_response in signin_responses:
    if signin_response.status_code == 200:
        # 请求成功
        print("Success")
    else:
        # 请求失败
        print("Error: {}".format(signin_response.status_code))

signin_data = json.loads(signin_response.text)

print(signin_data)
