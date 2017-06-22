"use strict";

var loginWithLedger = function (callback) {
  this.ledger.getAddressByBip44Index().then(function (address) {
    this.account = {
      address: address
    };
    callback(clone(undefined, this.account));
  }).catch(function (error) {
    callback(error, undefined);
  });
}

module.exports = loginWithLedger;
