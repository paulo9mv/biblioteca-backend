var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/biblioteca_db',function(){
    /* Drop the DB */
    mongoose.connection.db.dropDatabase();
});