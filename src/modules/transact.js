/**
 * ethrpc fire/transact wrappers
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var ethereumLedger = require("ethereumjs-ledger");

module.exports = {

  fire: function (tx, callback, wrapper, aux) {
    if (this.accounts && this.accounts.account && this.accounts.account.address) {
      tx.from = this.accounts.account.address;
    } else {
      tx.from = tx.from || this.from || this.coinbase;
    }
    return this.rpc.fire(tx, callback, wrapper, aux);
  },

  transact: function (tx, onSent, onSuccess, onFailed) {
    var self = this;
    if (this.accounts && this.accounts.account && this.accounts.account.address) {
      tx.from = this.accounts.account.address;
      var privateKeyOrSigner = this.accounts.account.privateKey || function (transaction, callback) {
        augur.ledger
          .then(function (signedTransaction) { callback(undefined, signedTransaction); })
          .catch(function (error) { callback(error, undefined); });
      };
      tx.invoke = function (payload, onSent, onSuccess, onFailed) {
        return self.rpc.packageAndSubmitRawTransaction(payload, self.accounts.account.address, privateKeyOrSigner, onSent, onSuccess, onFailed);
      };
    } else {
      tx.from = tx.from || this.from || this.coinbase;
    }
    return this.rpc.transact(tx, onSent, onSuccess, onFailed);
  }
};
