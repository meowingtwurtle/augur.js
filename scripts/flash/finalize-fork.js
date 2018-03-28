#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var getTime = require("./get-timestamp");
var displayTime = require("./display-time");

function finalizeForkInternal(augur, marketId, auth, callback) {
  getTime(augur, auth, function (err, timeResult) {
    if (err) return callback(err);
    displayTime("Current Time", timeResult.timestamp);
    augur.api.Market.finalize({ tx: { to: marketId  },
      onSent: function (result) {
        console.log(chalk.yellow.dim("Sent:"), chalk.yellow(JSON.stringify(result)));
        console.log(chalk.yellow.dim("Waiting for reply ...."));
      },
      onSuccess: function (result) {
        console.log(chalk.green.dim("Finalize Fork Success:"), chalk.green(JSON.stringify(result)));
        callback(null);
      },
      onFailed: function (err) {
        console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(err)));
        callback(err);
      },
    });
  });
}

function help(callback) {
  console.log(chalk.red("params syntax --> marketId"));
  console.log(chalk.red("parameter 1: marketId is needed"));
  console.log(chalk.yellow("Simply finalizes market, doesn't move time"));
  callback(null);
}

function finalizeFork(augur, params, auth, callback) {
  if (!params || params === "help") {
    help(callback);
  } else {
    var marketId = params;
    console.log(chalk.yellow.dim("marketId"), marketId);
    console.log(chalk.yellow.dim("owner"), auth.address);
    finalizeForkInternal(augur, marketId, auth, callback);
  }
}

module.exports = finalizeFork;
