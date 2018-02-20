#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var setTimestamp = require("./set-timestamp");
var displayTime = require("./display-time");
var doInitialReport = require("./do-initial-report");
var getPrivateKeyFromString = require("../dp/lib/get-private-key").getPrivateKeyFromString;
var repFaucet = require("../rep-faucet");

/**
 * Move time to Market end time and do initial report
 */
function initialReportInternal(augur, marketID, outcome, userAuth, invalid, auth, callback) {
  repFaucet(augur, userAuth, function (err) {
    if (err) {
      console.log(chalk.red("Error"), chalk.red(err));
      callback(err);
    }
    augur.markets.getMarketsInfo({ marketIDs: [marketID] }, function (err, marketsInfo) {
      var market = marketsInfo[0];
      var marketPayload = { tx: { to: marketID } };
      augur.api.Market.getEndTime(marketPayload, function (err, endTime) {
        displayTime("Market End Time", endTime);
        getTime(augur, auth, function (err, timeResult) {
          if (err) {
            console.log(chalk.red(err));
            return callback(err);
          }
          var day = 108000; // day
          endTime = parseInt(endTime, 10) + (day * 3); // push time after designated reporter time
          displayTime("Move time to ", endTime);
          setTimestamp(augur, endTime, timeResult.timeAddress, auth, function (err) {
            if (err) {
              console.log(chalk.red(err));
              return callback(err);
            }
            var numTicks = market.numTicks;
            var payoutNumerators = Array(market.numOutcomes).fill(0);
            payoutNumerators[outcome] = numTicks;
            doInitialReport(augur, marketID, payoutNumerators, invalid, userAuth, function (err) {
              if (err) {
                console.log(chalk.red(err));
                return callback(err);
              }
              console.log(chalk.green("Initial Report Done"));
              callback(null);
            });
          });
        });
      });
    });
  });
}

function help(callback) {
  console.log(chalk.red("params syntax --> -p marketID,0,<user priv key>,false"));
  console.log(chalk.red("parameter 1: marketID is needed"));
  console.log(chalk.red("parameter 2: outcome is needed"));
  console.log(chalk.red("parameter 3: user priv key is needed"));
  console.log(chalk.red("parameter 4: invalid is optional, default is false"));
  console.log(chalk.yellow("user will be give REP if balance is 0"));
  callback(null);
}

function initialReport(augur, params, auth, callback) {
  if (!params || params === "help" || params.split(",").length < 3) {
    help(callback);
  } else {
    var paramArray = params.split(",");
    var invalid = paramArray.length === 4 ? paramArray[3] : false;
    var marketID = paramArray[0];
    var outcomeId = paramArray[1];
    var userAuth = getPrivateKeyFromString(paramArray[2]);
    console.log(chalk.yellow.dim("marketID"), marketID);
    console.log(chalk.yellow.dim("outcomeId"), outcomeId);
    console.log(chalk.yellow.dim("reporter"), userAuth.address);
    console.log(chalk.yellow.dim("owner"), auth.address);
    console.log(chalk.yellow.dim("invalid"), invalid);
    initialReportInternal(augur, marketID, outcomeId, userAuth, invalid, auth, callback);
  }
}

module.exports = initialReport;