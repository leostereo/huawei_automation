const express = require("express");
const app = express();
const puppeteer = require('puppeteer');

// routes
var routes = require('./routes/route_index')(app); //This is the extra line
var routes = require('./routes/route_save')(app); //This is the extra line
var routes = require('./routes/route_get_sn')(app); //This is the extra line
var routes = require('./routes/route_get_name')(app); //This is the extra line
var routes = require('./routes/route_rem_smart')(app); //This is the extra line
var routes = require('./routes/route_upload')(app); //This is the extra line
var routes = require('./routes/route_set_userid')(app); //This is the extra line

app.listen(3000, () => {
 console.log("El servidor está inicializado en el puerto 3000");
});
