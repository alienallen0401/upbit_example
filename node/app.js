var api = require('./lib/api.js');
var websocket = require('./lib/websocket.js');
var exchange = require('./lib/exchange.js');

/**
 * QUOTATION Websocket Connect Examples.
 * */
websocket.connect("orderbook", ['KRW-BTC', 'BTC-ADA']);

/**
 * QUOTATION API.
 * */
api.ticker(["KRW-BTC", "BTC-ADA"]);
api.orderbook(["KRW-BTC", "BTC-ADA"]);

var to = new Date();
var timezoneOffset = new Date().getTimezoneOffset() * 60000
api.minutes(1, "KRW-BTC", to.toISOString());
api.minutes(1, "KRW-BTC", new Date(to - timezoneOffset).toISOString()); // to KST

/**
 * EXCHANGE TRADE API
  * */
exchange.currencies();
exchange.order_detail('random-uuid');
exchange.order_history('KRW-BTC');
exchange.order('KRW-BTC', 'bid', 1, 100000, 'limit');
exchange.order_cancel('random-uuid');

/**
 * EXCHANGE WITHDRAW API
 * */
exchange.withdraw_history('BTC');
exchange.withdraw_detail('random-uuid');
exchange.withdraw_chance('BTC');
exchange.withdraw_coin('BTC', 100, 'random-address');
exchange.withdraw_krw(100);
/**
 * EXCHANGE DEPOSIT API
 * */
exchange.deposit_history('BTC');
exchange.deposit_detail('random-uuid');
