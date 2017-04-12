/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var LedgerEthereum = require("ethereumjs-ledger").LedgerEthereum;
var LedgerEthereumNetwork = require("ethereumjs-ledger").Network;
var LedgerBrowserConnectionFactory = require("ethereumjs-ledger").BrowserLedgerConnectionFactory;
var keythereum = require("keythereum");
var pify = require("pify");
var ROUNDS = require("./constants").ROUNDS;

BigNumber.config({
  MODULO_MODE: BigNumber.EUCLID,
  ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

keythereum.constants.pbkdf2.c = ROUNDS;
keythereum.constants.scrypt.n = ROUNDS;

function Augur() {
  this.version = "4.0.6";
  this.options = {
    debug: {
      tools: false,       // if true, testing tools (test/tools.js) included
      broadcast: false,   // broadcast debug logging in ethrpc
      connect: false,     // connection debug logging in ethrpc and ethereumjs-connect
      trading: false,     // trading-related debug logging
      reporting: false,   // reporting-related debug logging
      filters: false,     // filters-related debug logging
      sync: false,        // show warning on synchronous RPC request
      accounts: false     // show info about funding from faucet
    },
    loadZeroVolumeMarkets: true
  };
  this.abi = require("augur-abi");
  this.accounts = require("./accounts");
  this.api = require("./api")();
  this.generateContractAPI = require("./api").generateContractAPI;
  this.assets = require("./assets");
  this.beta = require("./beta");
  this.chat = require("./chat");
  this.connect = require("./connect").bind(this);
  this.constants = require("./constants");
  this.create = require("./create");
  this.filters = require("./filters");
  this.format = require("./format");
  // TODO: make these functions prompt the user to interact with their ledger (e.g., plug it in, open the Ethereum app, change app settings on device) and then call the callback once the user indicates they are done
  var connectLedgerRequest = function (callback) { callback(new Error("connectLedgerRequest not implemented"), undefined); };
  var openEthereumAppRequest = function (callback) { callback(new Error("openEthereumAppRequest not implemented"), undefined); };
  var switchLedgerModeRequest = function (callback) { callback(new Error("switchLedgerModeRequest not implemented"), undefined); };
  var enableContractSupportRequest = function (callback) { callback(new Error("enableContractSupportRequest not implemented"), undefined); };
  this.ledger = new LedgerEthereum(LedgerEthereumNetwork.Test, LedgerBrowserConnectionFactory, pify(connectLedgerRequest), pify(openEthereumAppRequest), pify(switchLedgerModeRequest), pify(enableContractSupportRequest));
  this.logs = require("./logs");
  this.markets = require("./markets");
  this.reporting = require("./reporting");
  this.rpc = require("./rpc-interface");
  this.topics = require("./topics");
  this.trading = require("./trading");
  this.utils = require("./utils");
  if (this.options.debug.tools) this.tools = require("../test/tools");
}

module.exports = Augur;
