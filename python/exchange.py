'''
requirements.txt
'''
import os
import time
from urllib.parse import urlencode
import requests
import jwt


request_url = "https://api.upbit.com/v1/{}"
ACCESS_KEY = os.getenv('ACCESS_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')


def get(path, params=None):
    """
    Rest API Call GET Method.
    """
    token = build_token(params)
    url = request_url.format(path)
    req = requests.get(url, params=params, headers=token)
    return req.json()


def post(path, params):
    """
    Rest API Call POST Method.
    """
    token = build_token(params)
    url = request_url.format(path)
    req = requests.post(url, data=params, headers=token)
    return req.json()


def delete(path, params):
    """
    Rest API Call DELETE Method.
    """
    token = build_token(params)
    url = request_url.format(path)
    req = requests.delete(url, data=params, headers=token)
    return req.json()


def build_payload(params=None):
    payload = {
        'access_key': ACCESS_KEY,
        'nonce': int(time.time() * 1000)
    }
    if params is not None:
        payload['query'] = params
    return payload


def build_token(params=None):
    payload = build_payload(params)
    if 'query' in params:
        payload['query'] = urlencode(payload['query'])
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode('utf8')
    return {'Authorization': 'Bearer {}'.format(token)}


def currencies():
    path = "currencies"
    return get(path)


def currency(code):
    path = "currency"
    return get(path, {'code': code})


def get_account():
    path = "accounts"
    return get(path)


def order_chance(market='KRW-BTC'):
    path = "orders/chance"
    return get(path, {'market': market})


def do_order(market, side, volume, price, ord_type):
    path = "orders"
    params = {
        'market': market,
        'side': side,
        'volume': volume,
        'price': price,
        'ord_type': ord_type
    }
    return post(path, params)


def cancel_order(uuid):
    path = "order"
    return delete(path, {'uuid': uuid})


if __name__ == "__main__":
    print(do_order('KRW-BTC', 'bid', 0.00001, 100, 'limit'))
