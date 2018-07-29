const jwt = require('jsonwebtoken')
const request = require('request')
const querystring = require('querystring')
const assert = require('assert')

function requests(path, token, method, param) {
  var options = {
    url: `https://api.upbit.com/v1/${path}`,
    method: method,
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  if (param !== undefined) options["json"] = param;

  request(options, (error, resp, body) => {
    /**
     * you can do anything with response body.
     * Also, you must consider Upbit Open API Rate Limiting with response headers.
     * The error message, "Jwt의 query를 검증하는데 실패하였습니다.", means
     * your payload did not satisfy some conditions, not your request failed.
      * */
    console.log(body);
  });
}

function _get(path, param) {
  const query = param !== undefined ? querystring.encode(param) : undefined;
  const token = buildAuthToken(query);

  requests(param !== undefined ? `${path}?${query}` : path, token, 'GET');
}

function _post(path, param) {
  const query = querystring.encode(param);
  const token = buildAuthToken(query);

  requests(path, token, 'POST', param);
}

function _delete(path, param) {
  const query = querystring.encode(param);
  const token = buildAuthToken(query);

  requests(path, token, 'DELETE');
}

function buildAuthToken(query) {
  var accessKey = process.env.ACCESS_KEY;
  var secretKey = process.env.SECRET_KEY;

  var payload = {
    access_key: accessKey,
    nonce: (new Date).getTime()
  }
  if (query !== undefined) payload["query"] = query;
  console.log(payload);
  const token = jwt.sign(payload, secretKey);

  return token;
}


/**
 *
 *  UPBIT ORDER API
 *
  * */
exports.currencies = function () {
  const path = 'accounts';
  _get(path);
}

exports.chance = function(market) {
  const path = 'orders/chance';
  const param = {market: market};

  _get(path, param);
}

exports.order_detail = function(uuid, identifier) {
  if (uuid == undefined && identifier == undefined) {
    throw new Error("you must specify either uuid or identifier.");
  }

  const path = 'order';
  const param = uuid !== undefined ? {uuid: uuid} : {identifier: identifier};

  _get(path, param);
}

exports.order_history = function(market, state = 'wait', page = 1, order_by = 'asc') {
  if (market == undefined) {
    throw new Error("you must specify market to get history");
  }
  if (!['wait', 'done', 'cancel'].includes(state)) {
    throw new Error("state must be one of wait, done and cancel.");
  }

  const path = 'orders';
  const params = {
    market: market,
    state: state,
    page: page,
    order_by: order_by
  };
  _get(path, params);
}

/**
 * If you are uncomfortable due to many parameters,
 * you can construct map or class to classify order.
  * */
exports.order = function(market, side, volume, price, ord_type, identifier) {
  if (market == undefined) {
    throw new Error("you must specify market to get history.");
  }
  if (!['ask', 'bid'].includes(side)) {
    throw new Error("side must be either ask or bid.");
  }
  if (price == undefined || volume == undefined) {
    throw new Error("you must specify all of price and volume.");
  }
  if (ord_type != "limit") {
    throw new Error("only limit type is allowed.");
  }

  const path = 'orders';
  const params = {
    market: market,
    side: side,
    volume: volume,
    price: price,
    ord_type: ord_type
  }
  if (identifier !== undefined) params["identifier"] = identifier;

  _post(path, params);
}

exports.order_cancel = function(uuid) {
  if (uuid == undefined) {
    throw new Error("you must specify uuid to cancel order.");
  }

  const path = 'order';
  const params = {uuid: uuid}

  _delete(path, params);
}


/**
 *
 * UPBIT WITHDRAWL API
 *
 * */
exports.withdraw_history = function(currency, state = 'submitting', limit = 100) {
  const path = 'withdraws'
  const params = {currency: currency, state: state, limit: limit}

  _get(path, params);
}

exports.withdraw_detail = function(uuid) {
  if (uuid == undefined) {
    throw new Error("you must specify uuid to get withdraw detail.");
  }

  const path = 'withdraw'
  const params = {uuid: uuid}

  _get(path, params);
}

exports.withdraw_chance = function(currency) {
  const path = 'withdraws/chance'
  const params = {currency: currency}

  _get(path, params);
}

exports.withdraw_coin = function(currency, amount, address, secondary_address) {
  const path = 'withdraws/coin'
  var params = {currency: currency, amount: amount, address: address}
  if (secondary_address !== undefined) params["secondary_address"] = secondary_address;

  _post(path, params);
}

exports.withdraw_krw = function(amount) {
  if (amount <= 0) {
    throw new Error("Amount to withdraw must be larger than 0.");
  }
  const path = 'withdraws/krw'
  const params = {amount: amount}

  _post(path, params);
}
/**
 *
 * UPBIT DEPOSIT API
 *
 */
exports.deposit_history = function(currency, limit = 1, page = 1, order_by = 'asc') {
  const path = 'deposits'
  const params = {currency: currency, limit: limit, page: page, order_by: order_by}

  _get(path, params);
}

exports.deposit_detail = function(uuid) {
  if (uuid == undefined) {
    throw new Error("you must specify uuid to get deposit detail.");
  }

  const path = 'deposit'
  const params = {uuid: uuid}

  _get(path, params);
}
