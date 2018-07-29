const https = require('https');
const host = 'https://api.upbit.com/v1';

function _get(url) {
  https.get(url, (resp) => {
    console.log(url);
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      console.log(JSON.parse(data));
    });
  }).on("error", (err) => {
    console.log("Error when request GET method.");
  });
}

exports.markets = function () {
  var url = `${host}/market/all`;
  _get(url);
}
exports.ticker = function (markets) {
  var url = `${host}/ticker?markets=${markets.join()}`;
  _get(url);
}

exports.minutes = function (unit = 1, market, to, count = 1) {
  var url = `${host}/candles/minutes/${unit}?market=${market}&count=${count}`;
  if (to !== undefined) url += `&to=${to}`;
  _get(url);
}

exports.days = function (market, to, count = 1, converting_price_unit) {
  var url = `${host}/candles/days?market=${market}&count=${count}`;
  if (to !== undefined) url += `&to=${to}`;
  if (converting_price_unit !== undefined) url += `&convertingPriceUnit=${converting_price_unit}`;

  _get(url);
}

exports.weeks = function (market, to, count = 1) {
  var url = `${host}/candles/weeks?market=${market}&count=${count}`;
  if (to !== undefined) url += `&to=${to}`;
  _get(url);
}

exports.months = function (market, to, count = 1) {
  var url = `${host}/candles/months?market=${market}&count=${count}`;
  if (to !== undefined) url += `&to=${to}`;
  _get(url);
}

exports.trades = function (market, to, count = 1) {
  var url = `${host}/trades/ticks?market=${market}&count=${count}`;
  _get(url);
}

exports.orderbook = function (markets) {
  var url = `${host}/orderbook?markets=${markets.join()}`;
  _get(url);
}
