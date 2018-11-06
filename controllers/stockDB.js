var Stock = require('../models/stock');

module.exports = async (stockName, likeIP, like) => {
  var numLikes; 
  console.log("likeIP: " + likeIP)
  // add likes to database
  await Stock.findOne({stock: stockName}, (err, data) => {
    if (err) console.log(err);
    if (data == null) {
     var newStock = new Stock({ 
       stock: stockName,
       ip_likes: likeIP
     })
     .save()
     .catch(err => console.log(err));
  } else {
    if (data.ip_likes.find(ip => ip == likeIP) == undefined && like) {
      console.log(data.ip_likes)
      data.ip_likes.push(likeIP)
      data.save()
      console.log('like added');
    }
  }
    numLikes = data.likes
})
  return await numLikes
}