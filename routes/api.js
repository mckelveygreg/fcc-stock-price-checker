/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
//var MongoClient = require('mongodb');

//const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
require('../utils/db');
var Stock = require('../models/stock');
var getStockPrice = require('../controllers/stockPrice');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(getStockPrice)
    
};
