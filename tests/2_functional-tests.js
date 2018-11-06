/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.body.stockData.stock, 'GOOG')
          console.log('response ' + res.body.stockData.price) 
          assert.match(res.body.stockData.price, /\d+/)
          done();
        });
      });
      var likeCount = 0;
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: 'true'})
          .end(function(err, res){
            assert.equal(res.status, 200)
            assert.equal(res.body.stockData.stock, 'GOOG')
            assert.match(res.body.stockData.price, /\d+/)
            assert.match(res.body.stockData.likes, /\d+/)
            likeCount = 0; //reset
            likeCount = res.body.stockData.likes // for testing with multiple likes in the next test
            done()
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: 'true'})
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.stockData.stock, 'GOOG')
            assert.match(res.body.stockData.price, /\d+/)
            assert.match(res.body.stockData.likes, /\d+/)  
            assert.equal(res.body.stockData.likes, likeCount) // likes from previous test
            console.log('likeCount: ' + likeCount)
            done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['goog', 'msft']})
          .end(function(err,res) {
          console.log(res.body)
            assert.equal(res.status, 200)
            assert.equal(res.body.stockData[0].stock, 'GOOG')
            assert.match(res.body.stockData[0].price, /\d+/)
            assert.equal(res.body.stockData[1].stock, 'MSFT')
            assert.match(res.body.stockData[1].price, /\d+/)
            done()
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['goog', 'msft'], like: 'true'})
          .end(function(err,res) {
            console.log(res.body)
            assert.equal(res.status, 200)
            assert.equal(res.body.stockData[0].stock, 'GOOG')
            assert.match(res.body.stockData[0].price, /\d+/)
            assert.match(res.body.stockData[0].rel_likes, /\d+/)
            assert.equal(res.body.stockData[1].stock, 'MSFT')
            assert.match(res.body.stockData[1].price, /\d+/)
            assert.match(res.body.stockData[1].rel_likes, /\d+/)
            done()
        })
      });
      
    });

});
