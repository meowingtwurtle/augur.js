"use strict";

var assert = require('chai').assert;
var utils = require('../../../src/utilities.js');
var abi = require("augur-abi");
var augur = require('../../../src/');
// 12 tests total

describe("createMarket.createSingleEventMarket", function() {
	// 3 tests total
	var test = function(t) {
		it(t.testDescription, function() {
			var transact = augur.transact;
			var getGasPrice = augur.rpc.getGasPrice;
			// since transact is how all these functions end we are going to just use assertions from each test.
			augur.transact = t.assertions;
			augur.rpc.getGasPrice = t.getGasPrice;

			augur.createSingleEventMarket(t.branchId, t.description, t.expDate, t.minValue, t.maxValue, t.numOutcomes, t.resolution, t.takerFee, t.tags, t.makerFee, t.extraInfo, t.onSent, t.onSuccess, t.onFailed);

			augur.transact = transact;
			augur.rpc.getGasPrice = getGasPrice;
		});
	};
	test({
		testDescription: "Should create a single event market",
		assertions: function(tx, onSent, onSuccess, onFailed) {
			assert.deepEqual(tx.to, augur.tx.CreateMarket.createSingleEventMarket.to);
			assert.deepEqual(tx.label, 'Create Market');
			assert.deepEqual(tx.method, `createSingleEventMarket`);
			assert.deepEqual(tx.value, '0x1036640');
			assert.deepEqual(tx.params, [
			 '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
	     'Some question for an Event and Market',
	     15000000000,
	     '0xde0b6b3a7640000',
	     '0x1bc16d674ec80000',
	     2,
	     'https://someResolution.com',
	     '0x8e1bc9bf040000',
	     '0x6d6f766965730000000000000000000000000000000000000000000000000000',
	     '0x747673686f777300000000000000000000000000000000000000000000000000',
	     '0x706f646361737473000000000000000000000000000000000000000000000000',
	     '0x6f05b59d3b20000',
	     'This is some extra information about this fascinating market.'
			]);
		},
		getGasPrice: function(cb) {
			// for simplicity's sake, just return 10.
			if (cb) return cb('10');
			return '10';
		},
		branchId: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
		description: "Some question for an Event and Market",
		expDate: 15000000000,
		minValue: 1,
		maxValue: 2,
		numOutcomes: 2,
		resolution: 'https://someResolution.com',
		takerFee: 0.04,
		tags: ['movies', 'tvshows', 'podcasts'],
		makerFee: 0.02,
		extraInfo: 'This is some extra information about this fascinating market.',
		onSent: utils.noop,
		onSuccess: utils.noop,
		onFailed: utils.noop
	});
	test({
		testDescription: "Should create a single event market when no callbacks are passed",
		assertions: function(tx, onSent, onSuccess, onFailed) {
			assert.deepEqual(tx.to, augur.tx.CreateMarket.createSingleEventMarket.to);
			assert.deepEqual(tx.label, 'Create Market');
			assert.deepEqual(tx.method, `createSingleEventMarket`);
			assert.deepEqual(tx.value, '0x1036640');
			assert.deepEqual(tx.params, [
			 '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
	     'Some padded question for an Event and Market',
	     15000000000,
	     '0xde0b6b3a7640000',
	     '0x4563918244f40000',
	     5,
	     'https://someResolution.com/padded',
	     '0x5ebd312a02aaab',
	     '0x7370616365000000000000000000000000000000000000000000000000000000',
	     '0x706c616e65747300000000000000000000000000000000000000000000000000',
	     '0x6c69666500000000000000000000000000000000000000000000000000000000',
	     '0x53444835ec58000',
	     'This is some extra information about this fascinating market.'
			]);
		},
		getGasPrice: function(cb) {
			// for simplicity's sake, just return 10.
			if (cb) return cb('10');
			return '10';
		},
		branchId: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
		description: "    Some padded question for an Event and Market    ",
		expDate: 15000000000,
		minValue: 1,
		maxValue: 5,
		numOutcomes: 5,
		resolution: '    https://someResolution.com/padded    ',
		takerFee: 0.03,
		tags: ['space', 'planets', 'life'],
		makerFee: 0.01,
		extraInfo: 'This is some extra information about this fascinating market.',
	});
	test({
		testDescription: "Should create a single event market with a single argument object",
		assertions: function(tx, onSent, onSuccess, onFailed) {
			assert.deepEqual(tx.to, augur.tx.CreateMarket.createSingleEventMarket.to);
			assert.deepEqual(tx.label, 'Create Market');
			assert.deepEqual(tx.method, `createSingleEventMarket`);
			assert.deepEqual(tx.value, '0x1036640');
			assert.deepEqual(tx.params, [
			 '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
	     'Some padded question for an Event and Market',
	     15000000000,
	     '0xde0b6b3a7640000',
	     '0x6f05b59d3b200000',
	     8,
	     'https://someResolution.com/padded',
	     '0xbd7a6254055555',
	     '0x6f6e6c7954616700000000000000000000000000000000000000000000000000',
	     '0x0',
	     '0x0',
	     '0x7ce66c50e284000',
	     'This is some extra information about this fascinating market.'
			]);
		},
		getGasPrice: function(cb) {
			// for simplicity's sake, just return 10.
			if (cb) return cb('10');
			return '10';
		},
		branchId: {
			branchId: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
			description: "    Some padded question for an Event and Market    ",
			expDate: 15000000000,
			minValue: 1,
			maxValue: 8,
			numOutcomes: 8,
			resolution: '    https://someResolution.com/padded    ',
			takerFee: 0.05,
			tags: ['onlyTag',],
			makerFee: 0.03,
			extraInfo: 'This is some extra information about this fascinating market.',
		}
	});
});

describe("createMarket.createEvent", function() {
	// 3 tests total
	var test = function(t) {
		it(t.testDescription, function() {
			var transact = augur.transact;
			augur.transact = t.assertions;

			augur.createEvent(t.branchId, t.description, t.expDate, t.minValue, t.maxValue, t.numOutcomes, t.resolution, t.onSent, t.onSuccess, t.onFailed);

			augur.transact = transact;
		});
	};
	test({
		testDescription: "Should handle a createEvent call",
		branchId: '010101',
		description: 'This is a test event description',
		expDate: 1500000000,
		minValue: '1',
		maxValue: '2',
		numOutcomes: '2',
		resolution: 'https://iknoweverything.com',
		onSent: utils.noop,
		onSuccess: utils.noop,
		onFailed: utils.noop,
		assertions: function(tx, onSent, onSuccess, onFailed) {
			assert.deepEqual(tx.to, augur.tx.CreateMarket.createEvent.to);
			assert.deepEqual(tx.params, ['010101', 'This is a test event description', 1500000000, '0xde0b6b3a7640000', '0x1bc16d674ec80000', '2', 'https://iknoweverything.com']);
			assert.deepEqual(tx.label, 'Create Event');
			assert.deepEqual(tx.method, 'createEvent');
		}
	});
	test({
		testDescription: "Should handle a createEvent call with space padded description and resolution",
		branchId: '010101',
		description: '        This is a test event description',
		expDate: 1500000000,
		minValue: '1',
		maxValue: '2',
		numOutcomes: '2',
		resolution: '     https://iknoweverything.com',
		onSent: utils.noop,
		onSuccess: utils.noop,
		onFailed: utils.noop,
		assertions: function(tx, onSent, onSuccess, onFailed) {
			assert.deepEqual(tx.to, augur.tx.CreateMarket.createEvent.to);
			assert.deepEqual(tx.params, ['010101', 'This is a test event description', 1500000000, '0xde0b6b3a7640000', '0x1bc16d674ec80000', '2', 'https://iknoweverything.com']);
			assert.deepEqual(tx.label, 'Create Event');
			assert.deepEqual(tx.method, 'createEvent');
		}
	});
	test({
		testDescription: "Should handle a createEvent call with one argument object",
		branchId: {
			branchId: '010101',
			description: '        This is a test event description',
			expDate: 1500000000,
			minValue: '1',
			maxValue: '5',
			numOutcomes: '5',
			resolution: '     https://iknowmostthings.com',
			onSent: utils.noop,
			onSuccess: utils.noop,
			onFailed: utils.noop,
		},
		assertions: function(tx, onSent, onSuccess, onFailed) {
			assert.deepEqual(tx.to, augur.tx.CreateMarket.createEvent.to);
			assert.deepEqual(tx.params, ['010101', 'This is a test event description', 1500000000, '0xde0b6b3a7640000', '0x4563918244f40000', '5', 'https://iknowmostthings.com']);
			assert.deepEqual(tx.label, 'Create Event');
			assert.deepEqual(tx.method, 'createEvent');
		}
	});
});

describe("createMarket.createMarket", function() {
	// 3 tests total
	var test = function(t) {
		it(t.testDescription, function() {
			var transact = augur.transact;
			var getGasPrice = augur.rpc.getGasPrice;
			augur.transact = t.assertions;
			augur.rpc.getGasPrice = t.getGasPrice;

			augur.createMarket(t.branchId, t.description, t.takerFee, t.events, t.tags, t.makerFee, t.extraInfo, t.onSent, t.onSuccess, t.onFailed);

			augur.transact = transact;
			augur.rpc.getGasPrice = getGasPrice;
		});
	};

	test({
		testDescription: "Should handle creation of a market without callbacks",
		assertions: function(tx, onSent, onSuccess, onFailed) {
			assert.deepEqual(tx.to, augur.tx.CreateMarket.createMarket.to);
			assert.deepEqual(tx.label, 'Create Market');
			assert.deepEqual(tx.method, 'createMarket');
			assert.deepEqual(tx.value, '0x1036640');
			assert.deepEqual(tx.params, [
				'0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
				'this is a description',
				'0x470de4df820000',
				['d262e2b552568085340c349b975ad02518a58cf0ca81666f02d96f828d43f5ef', '52057b64aa5c3bc32b6dd5815958b7b544c84bd8e93205d890da72f99fd87eff'],
				'0x636f646500000000000000000000000000000000000000000000000000000000',
				'0x636f6d7075746572730000000000000000000000000000000000000000000000',
				'0x696e7465726e6574000000000000000000000000000000000000000000000000',
				'0x6f05b59d3b20000',
				'more info'
			]);
		},
		getGasPrice: function(cb) {
			// for simplicity's sake, just return 10.
			if (cb) return cb('10');
			return '10';
		},
		branchId: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
		description: 'this is a description',
		takerFee: 0.02,
		events: ['d262e2b552568085340c349b975ad02518a58cf0ca81666f02d96f828d43f5ef', '52057b64aa5c3bc32b6dd5815958b7b544c84bd8e93205d890da72f99fd87eff'],
		tags: ['code', 'computers', 'internet'],
		makerFee: 0.01,
		extraInfo: 'more info',
	});
	test({
		testDescription: "Should handle creation of a market with callbacks",
		assertions: function(tx, onSent, onSuccess, onFailed) {
			assert.deepEqual(tx.to, augur.tx.CreateMarket.createMarket.to);
			assert.deepEqual(tx.label, 'Create Market');
			assert.deepEqual(tx.method, 'createMarket');
			assert.deepEqual(tx.value, '0x1036640');
			assert.deepEqual(tx.params, [
				'0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
				'This is a super cool market!',
				'0x8e1bc9bf040000',
				['d262e2b552568085340c349b975ad02518a58cf0ca81666f02d96f828d43f5ef', '52057b64aa5c3bc32b6dd5815958b7b544c84bd8e93205d890da72f99fd87eff'],
				'0x666f6f7462616c6c000000000000000000000000000000000000000000000000',
				'0x736f636365720000000000000000000000000000000000000000000000000000',
				'0x6261736562616c6c000000000000000000000000000000000000000000000000',
				'0x6f05b59d3b20000',
				'even more information'
			]);
		},
		getGasPrice: function(cb) {
			// for simplicity's sake, just return 10.
			if (cb) return cb('10');
			return '10';
		},
		branchId: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
		description: 'This is a super cool market!',
		takerFee: 0.04,
		events: ['d262e2b552568085340c349b975ad02518a58cf0ca81666f02d96f828d43f5ef',  '52057b64aa5c3bc32b6dd5815958b7b544c84bd8e93205d890da72f99fd87eff'],
		tags: ['football', 'soccer', 'baseball'],
		makerFee: 0.02,
		extraInfo: 'even more information',
		onSent: utils.noop,
		onSuccess: utils.noop,
		onFailed: utils.noop
	});
	test({
		testDescription: "Should handle creation of a market with callbacks and a single object argument",
		assertions: function(tx, onSent, onSuccess, onFailed) {
			assert.deepEqual(tx.to, augur.tx.CreateMarket.createMarket.to);
			assert.deepEqual(tx.label, 'Create Market');
			assert.deepEqual(tx.method, 'createMarket');
			assert.deepEqual(tx.value, '0x1036640');
			assert.deepEqual(tx.params, [
				'0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
				'This is a super cool market with a padded description!',
				'0x8e1bc9bf040000',
				['d262e2b552568085340c349b975ad02518a58cf0ca81666f02d96f828d43f5ef', '52057b64aa5c3bc32b6dd5815958b7b544c84bd8e93205d890da72f99fd87eff'],
				'0x666f6f7462616c6c000000000000000000000000000000000000000000000000',
				'0x736f636365720000000000000000000000000000000000000000000000000000',
				'0x6261736562616c6c000000000000000000000000000000000000000000000000',
				'0x6f05b59d3b20000',
				'even more information'
			]);
		},
		getGasPrice: function(cb) {
			// for simplicity's sake, just return 10.
			if (cb) return cb('10');
			return '10';
		},
		branchId: {
			branchId: '0a1d18a485f77dcee53ea81f1010276b67153b745219afc4eac4288045f5ca3d',
			description: '      This is a super cool market with a padded description!     ',
			takerFee: 0.04,
			events: ['d262e2b552568085340c349b975ad02518a58cf0ca81666f02d96f828d43f5ef', '52057b64aa5c3bc32b6dd5815958b7b544c84bd8e93205d890da72f99fd87eff'],
			tags: ['football', 'soccer', 'baseball'],
			makerFee: 0.02,
			extraInfo: 'even more information',
			onSent: utils.noop,
			onSuccess: utils.noop,
			onFailed: utils.noop
		}
	});
});

describe("createMarket.updateTradingFee", function() {
	// 3 tests total
	var test = function(t) {
		it(t.testDescription, function() {
			var transact = augur.transact;
			augur.transact = t.assertions;

			augur.updateTradingFee(t.branchId, t.market, t.takerFee, t.makerFee, t.onSent, t.onSuccess, t.onFailed);

			augur.transact = transact;
		});
	};

	test({
		testDescription: 'Should be able to send an updateTradingFee transaction',
		assertions: function(tx, onSent, onSuccess, onFailed) {
			assert.deepEqual(tx.to, augur.tx.CreateMarket.updateTradingFee.to);
			assert.deepEqual(tx.label, 'Update Trading Fee');
			assert.deepEqual(tx.method, 'updateTradingFee');
			assert.deepEqual(tx.params, ['010101', 'someFakeMarketID', '0x470de4df820000', '0x6f05b59d3b20000']);
		},
		branchId: '010101',
		market: 'someFakeMarketID',
		takerFee: 0.02,
		makerFee: 0.01,
		onSent: utils.noop,
		onSuccess: utils.noop,
		onFailed: utils.noop
	});

	test({
		testDescription: 'Should be able to send an updateTradingFee transaction as one object',
		assertions: function(tx, onSent, onSuccess, onFailed) {
			assert.deepEqual(tx.to, augur.tx.CreateMarket.updateTradingFee.to);
			assert.deepEqual(tx.label, 'Update Trading Fee');
			assert.deepEqual(tx.method, 'updateTradingFee');
			assert.deepEqual(tx.params, ['010101', 'someFakeMarketID', '0x470de4df820000', '0x6f05b59d3b20000']);
		},
		branchId: {
			branchId: '010101',
			market: 'someFakeMarketID',
			takerFee: 0.02,
			makerFee: 0.01,
			onSent: utils.noop,
			onSuccess: utils.noop,
			onFailed: utils.noop
		}
	});

	test({
		testDescription: 'Should be able to send an updateTradingFee transaction without passing callbacks',
		assertions: function(tx, onSent, onSuccess, onFailed) {
			assert.deepEqual(tx.to, augur.tx.CreateMarket.updateTradingFee.to);
			assert.deepEqual(tx.label, 'Update Trading Fee');
			assert.deepEqual(tx.method, 'updateTradingFee');
			assert.deepEqual(tx.params, ['010101', 'someFakeMarketID', '0x470de4df820000', '0x6f05b59d3b20000']);
		},
		branchId: {
			branchId: '010101',
			market: 'someFakeMarketID',
			takerFee: 0.02,
			makerFee: 0.01,
		}
	});
});