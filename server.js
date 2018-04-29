const mongoose = require("mongoose");
const config = require('./config/config').get(process.env.NODE_ENV);
const app = require('./app');
const port = process.env.PORT || 4512;

mongoose.Promise = global.Promise;
mongoose.connect(config.DATABASE);

app.listen(port, () => {
    console.log("SERVER RUNNING");

});