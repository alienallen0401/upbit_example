'''
requirements.txt
'''
import os
import requests


request_url = "https://api.upbit.com/v1/{}"
ACCESS_KEY = os.getenv('ACCESS_KEY')
SECRET_KEY = os.getenv('SECRET_KEY')


def get(path, params=None):
    """
    Rest API Call GET Method.
    """
    url = request_url.format(path)
    req = requests.get(url, params=params)
    return req.json()


def markets():
    path = "market/all"
    return get(path)


def ticker(markets=['KRW-BTC']):
    path = "ticker"
    return get(path, {"markets": markets})


def candle(unit=1, market='KRW-BTC', count=1, to=None):
    path = "candles/ticks/{}".format(str(unit))
    query = {
        'market': market,
        'count': count
    }
    if to is not None:
        query['to'] = to
    return get(path, query)


def orderbook(markets=['KRW-BTC']):
    path = "orderbook"
    return get(path, {'markets': markets})


if __name__ == "__main__":
    print(orderbook())
