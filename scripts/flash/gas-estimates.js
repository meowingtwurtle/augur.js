#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var async = require("async");
var getTime = require("./get-timestamp");
var getRepTokens = require("./get-rep-tokens");
var cannedMarketsData = require("../dp/data/canned-markets");
var immutableDelete = require("immutable-delete");
var displayTime = require("./display-time");

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
      tx: {estimateGas: true},
      onSent: function (res) {
        console.log(chalk.green.dim("createMarket gas estimate sent:"), chalk.green(res.hash));
      },
      onSuccess: function (res) {
        console.log(chalk.green.dim("gas result"), chalk.green(JSON.stringify(res)));
        callback(res);
      },
      onFailed: function (err) {
        console.log(chalk.red(JSON.stringify(err)));
        callback(err);
      },
    });
    console.log(JSON.stringify(createMarketParams));
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
