var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const connection = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

module.exports =  
connection
  .then(db => {
    console.log('Successfully connected to DB!');
  return db;
})
.catch(err => {
  console.log('Error connecting to DB');
});

