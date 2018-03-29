#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var async = require("async");
var getTime = require("./get-timestamp");
var getRepTokens = require("./get-rep-tokens");
var cannedMarketsData = require("../dp/data/canned-markets");
var immutableDelete = require("immutable-delete");
var displayTime = require("./display-time");
var getPayoutNumerators = require("./get-payout-numerators");

function getMarket(augur, universe, marketType, callback) {
  augur.markets.getMarkets({ universe: universe}, function (err, marketIds) {
    if (err) return callback(err);
    augur.markets.getMarketsInfo({ marketIds: marketIds }, function (err, marketInfos) {
      if (err) return callback(err);
      callback(null, marketInfos.find(function (marketInfo) { return marketInfo.marketType === marketType; }));
    });
  });
}

function estimateFinalizeMarket(augur, universe, auth, callback) {
  getMarket(augur, universe, "binary", function (err, market) {
    augur.api.Market.finalize({ tx: { to: market.id, estimateGas: true, gas: augur.constants.DEFAULT_MAX_GAS },
      onSent: function () { },
      onSuccess: function (result) {
        console.log(chalk.red("Finalize Market"));
        console.log(chalk.green.dim("gas Result"), chalk.green(JSON.stringify(result)));
        callback(null, result);
      },
      onFailed: function (err) {
        console.log(chalk.red("Finalize Market"));
        console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(err)));
        callback(err);
      },
    });
  });
}
function estimateInitialReport(augur, universe, auth, timestamp, callback) {
  getMarket(augur, universe, "binary", function (err, market) {
    var payoutNumerators = getPayoutNumerators(market, 1, false);
    augur.api.Market.doInitialReport({
      meta: auth,
      tx: { to: market.id, estimateGas: true, gas: augur.constants.DEFAULT_MAX_GAS },
      _payoutNumerators: payoutNumerators,
      _invalid: false,
      onSent: function () { },
      onSuccess: function (result) {
        console.log(chalk.red("Initial Report"));
        console.log(chalk.green.dim("gas Result"), chalk.green(JSON.stringify(result)));
        callback(null, result);
      },
      onFailed: function (err) {
        console.log(chalk.red("Initial Report"));
        console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(err)));
        callback(err);
      },
    });
  });
}

function estimateCreateBinaryMarket(augur, universe, auth, timestamp, callback) {
  var amount = 10000;
  var newEndTime = parseInt(timestamp, 10) + 1000;
  getRepTokens(augur, amount, auth, function (err) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    var market = cannedMarketsData.find(function (m) { return m.marketType === "binary"; });
    if (market == null) {
      return callback("Binary market not found");
    }
    market._endTime = newEndTime;
    var createMarketOfType = augur.createMarket.createBinaryMarket;
    var createMarketParams = Object.assign({}, immutableDelete(market, ["orderBook", "marketType"]), {
      meta: auth,
      universe: universe,
      _feePerEthInWei: "0x123456",
      _denominationToken: augur.contracts.addresses[augur.rpc.getNetworkID()].Cash,
      _designatedReporterAddress: auth.address,
      tx: {estimateGas: true, call: true, send: false, gas: augur.constants.DEFAULT_MAX_GAS },
      onSent: function () { },
      onSuccess: function (result) {
        console.log(chalk.red("Create Binary Market"));
        console.log(chalk.green.dim("gas result"), chalk.green(JSON.stringify(result)));
        callback(result);
      },
      onFailed: function (err) {
        console.log(chalk.red("Create Binary Market"));
        console.log(chalk.red(JSON.stringify(err)));
        callback(err);
      },
    });
    // console.log(JSON.stringify(createMarketParams));
    createMarketOfType(createMarketParams);
  });
}

function gasEstimatesInternal(augur, universe, auth, callback) {
  console.log(chalk.green.dim("address:"), chalk.green(auth.address));
  console.log(chalk.green.dim("universe:"), chalk.green(universe));
  getTime(augur, auth, function (err, timeResult) {
    var timestamp = timeResult.timestamp;
    displayTime("Current Time:", timestamp);
    if (err) return callback(err);
    async.parallel({
      finalizeMarket: function (next) {
        estimateFinalizeMarket(augur, universe, auth, function (err, value) {
          if (err) return next(err);
          next(null, value);
        });
      },
      initialReport: function (next) {
        estimateInitialReport(augur, universe, auth, timestamp, function (err, value) {
          if (err) return next(err);
          next(null, value);
        });
      },
      binaryMarket: function (next) {
        estimateCreateBinaryMarket(augur, universe, auth, timestamp, function (err, value) {
          if (err) return next(err);
          next(null, value);
        });
      },
    }, callback);
  });
}

function help(callback) {
  console.log(chalk.red("params syntax --> no params needed"));
  callback(null);
}

function gasEstimates(augur, params, auth, callback) {
  if (params === "help") {
    help(callback);
  } else {
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    gasEstimatesInternal(augur, universe, auth, callback);
  }
}

module.exports = gasEstimates;
