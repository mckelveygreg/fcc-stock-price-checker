var axios = require('axios');
var stockDB = require('./stockDB');

const API= process.env.ALPHA_VANTAGE_API;

module.exports = async (req, res) => {
  var userIP = req.headers['x-forwarded-for'] !== undefined ? req.headers['x-forwarded-for'].match(/^[^,]+/) : req.ip; // deals with local server calls
  console.log('userIP: ' + userIP);
  console.log(req.query)
  var stock = req.query.stock
  // if stock is array, then it is two stocks
  if (Array.isArray(stock)) {
    var result = {
     stockData: []
    }
    var relLikes = [] // stores likes to compare later
    //grabs stock names and prices for each stock
    const stuff = await stock.map(async sym => {
     var price = await getPrice(sym) 
     //returns number of likes and logs like if either stock or ip is not in DB
     relLikes.push(await stockDB(stock, userIP, req.query.like))
     var data = await {
      stock: price.stock,
      price: price.price
     }
     return data
    })
    // promise waits for data from both stocks
    result.stockData = await Promise.all(stuff);
    // compares number of likes
    result.stockData[0].rel_likes = await relLikes[0]-relLikes[1]
    result.stockData[1].rel_likes = await relLikes[1]-relLikes[0]
    
    res.json(result)
    
    // for single stocks
  } else {
      var price = await getPrice(stock)
      var numLikes = await stockDB(stock, userIP, req.query.like)
      var result = await {
        stockData:{
          stock: price.stock,
          price: price.price,
          likes: numLikes
        }
      }
   res.json( await result);
  }
}

async function getPrice(stock) {
  var url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=${API}`
  return await axios.get(url)
      .then(response => {

       var body = response.data['Global Quote'];
          var stockData = {
            stock: body['01. symbol'],
            price: body['05. price']
          }
       return stockData;
     })
      .catch(error => console.log(error));
  
}