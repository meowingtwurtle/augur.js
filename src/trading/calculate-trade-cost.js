"use strict";

var BigNumber = require("bignumber.js");
var calculateBidCost = require("./calculate-bid-cost");
var calculateAskCost = require("./calculate-ask-cost");
var convertDisplayPriceToOnChainPrice = require("../utils/convert-display-price-to-on-chain-price");
var convertDisplayAmountToOnChainAmount = require("../utils/convert-display-amount-to-on-chain-amount");

/** Type definition for TradeCost.
 * @typedef {Object} TradeCost
 * @property {BigNumber} cost Wei (attoether) value needed for this trade.
 * @property {BigNumber} onChainAmount On-chain number of shares for this trade.
 * @property {BigNumber} onChainPrice On-chain price for this trade.
 */

/**
 * @param {Object} p Parameters object.
 * @param {string} p.displayPrice Normalized display price for this trade, as a base-10 string.
 * @param {string} p.displayAmount Number of shares to trade, as a base-10 string.
 * @param {string} p.numTicks The number of ticks for this market.
 * @param {string} p.maxDisplayPrice The maximum display price for this market, as a base-10 string.
 * @param {string} p.minDisplayPrice The minimum display price for this market, as a base-10 string.
 * @param {number} p.orderType Order type (0 for "buy", 1 for "sell").
 * @return {TradeCost} Cost breakdown of this trade.
 */
function calculateTradeCost(p) {
  var minDisplayPrice = new BigNumber(p.minDisplayPrice, 10);
  var maxDisplayPrice = new BigNumber(p.maxDisplayPrice, 10);
  var displayPrice = new BigNumber(p.displayPrice, 10);
  var displayAmount = new BigNumber(p.displayAmount, 10);
  var numTicks = new BigNumber(p.numTicks, 10);
  var tickSize = maxDisplayPrice.minus(minDisplayPrice).dividedBy(numTicks);
  var onChainPrice = convertDisplayPriceToOnChainPrice(displayPrice, minDisplayPrice, tickSize);
  var onChainAmount = convertDisplayAmountToOnChainAmount(displayAmount, tickSize);
  var cost;
  if (p.orderType === 0) {
    onChainPrice = onChainPrice.integerValue(BigNumber.ROUND_CEIL);
    cost = calculateBidCost(onChainPrice, onChainAmount);
  } else {
    onChainPrice = onChainPrice.integerValue(BigNumber.ROUND_FLOOR);
    cost = calculateAskCost(onChainPrice, onChainAmount, numTicks);
  }
  console.log(JSON.stringify({ cost: cost, onChainAmount: onChainAmount, onChainPrice: onChainPrice }));
  return { cost: cost.integerValue(BigNumber.ROUND_CEIL), onChainAmount: onChainAmount.integerValue(BigNumber.ROUND_FLOOR), onChainPrice: onChainPrice };
}

module.exports = calculateTradeCost;
