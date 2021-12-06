'use strict';
const express = require("express"); 

let app = express();
app.listen(3000,()=>{
    console.log('App listening on port 3000')
})

app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/newbug.html');
  });
  
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Sorry, this request cannot be handled.');
});

