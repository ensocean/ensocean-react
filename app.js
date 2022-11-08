const express = require('express');
const path = require('path');
const http = require('http');
const https = require('https');
const app = express();
const port = 80;

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

app.use(express.static(path.join(__dirname, 'build')));
 
app.get('/', function (req, res) {
    req.header("Content-Security-Policy", "upgrade-insecure-requests");
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
  
app.listen(port, ()=> { 
    console.log(`Listening port ${port}`)
})
