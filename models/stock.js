var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var StockSchema = new Schema({
  stock: String,
  ip_likes: [String]
});

// Virtual for total counts
StockSchema
  .virtual('likes')
  .get(function () {
    return this.ip_likes.length
})

module.exports = mongoose.model('Stock', StockSchema)