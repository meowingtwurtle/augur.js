"use strict";

var chalk = require("chalk");
var speedomatic = require("speedomatic");
var printTransactionStatus = require("./print-transaction-status");
var debugOptions = require("../../debug-options");

var USE_PUBLIC_CREATE_ORDER = true; // set to false to test trading.placeTrade endpoint

function createOrder(augur, marketId, outcome, numOutcomes, maxPrice, minPrice, numTicks, orderType, order, tradeGroupId, auth, callback) {
  var displayPrice = order.price;
  var displayAmount = order.shares;
  var orderTypeCode = orderType === "buy" ? 0 : 1;
  var tradeCost = augur.trading.calculateTradeCost({
    displayPrice: displayPrice,
    displayAmount: displayAmount,
    numTicks: numTicks,
    orderType: orderTypeCode,
    minDisplayPrice: minPrice,
    maxDisplayPrice: maxPrice,
  });
  if (debugOptions.cannedMarkets) {
    console.log("price:", displayPrice, tradeCost.onChainPrice.toFixed());
    console.log("amount:", displayAmount, tradeCost.onChainAmount.toFixed());
    console.log("numTicks:", numTicks);
    console.log(chalk.green.bold("cost:"), chalk.cyan(speedomatic.unfix(tradeCost.cost, "string")), chalk.cyan.dim("ETH"));
  }
  if (USE_PUBLIC_CREATE_ORDER) {
    augur.trading.getBetterWorseOrders({
      orderType: orderType,
      marketId: marketId,
      outcome: outcome,
      price: displayPrice,
    }, function (err, betterWorseOrders) {
      if (err) betterWorseOrders = { betterOrderId: "0x0", worseOrderId: "0x0" };
      var publicCreateOrderPayload = {
        meta: auth,
        tx: { value: augur.utils.convertBigNumberToHexString(tradeCost.cost), gas: augur.constants.CREATE_ORDER_GAS },
        _type: orderTypeCode,
        _attoshares: augur.utils.convertBigNumberToHexString(tradeCost.onChainAmount),
        _displayPrice: augur.utils.convertBigNumberToHexString(tradeCost.onChainPrice),
        _market: marketId,
        _outcome: outcome,
        _betterOrderId: (betterWorseOrders || {}).betterOrderId || "0x0",
        _worseOrderId: (betterWorseOrders || {}).worseOrderId || "0x0",
        _tradeGroupId: tradeGroupId,
        onSent: function (res) {
          if (debugOptions.cannedMarkets) {
            console.log(chalk.green.dim("publicCreateOrder sent:"), chalk.green(res.hash), chalk.cyan.dim(JSON.stringify(order)));
          }
        },
        onSuccess: function (res) {
          if (debugOptions.cannedMarkets) {
            console.log(chalk.green.dim("publicCreateOrder success:"), chalk.green(res.callReturn), chalk.cyan.dim(JSON.stringify(order)));
          }
          printTransactionStatus(augur.rpc, (res || {}).hash, function (err) {
            if (err) return callback(err);
            callback(null, res);
          });
        },
        onFailed: function (err) {
          if (debugOptions.cannedMarkets) {
            console.log(chalk.red.bold("publicCreateOrder failed:"), err, chalk.cyan.dim(JSON.stringify(order)));
          }
          printTransactionStatus(augur.rpc, (err || {}).hash, function (e) {
            if (e) return callback(e);
            callback(err);
          });
        },
      };
      console.log("publicCreateOrder payload:", publicCreateOrderPayload);
      augur.api.CreateOrder.publicCreateOrder(publicCreateOrderPayload);
    });
  } else {
    var placeTradePayload = {
      meta: auth,
      amount: displayAmount,
      limitPrice: displayPrice,
      minPrice: minPrice,
      maxPrice: maxPrice,
      numTicks: numTicks,
      _direction: orderTypeCode,
      _market: marketId,
      _outcome: outcome,
      _tradeGroupId: tradeGroupId,
      doNotCreateOrders: false,
      onSent: function (res) {
        if (debugOptions.cannedMarkets) console.log(chalk.green.dim("placeTrade sent:"), res.hash);
      },
      onSuccess: function () { callback(null); },
      onFailed: callback,
    };
    if (debugOptions.cannedMarkets) console.log("create-order placeTradePayload:", placeTradePayload);
    augur.trading.placeTrade(placeTradePayload);
  }
}

module.exports = createOrder;
