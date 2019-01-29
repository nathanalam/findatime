var express = require("express");
var app = express();

console.log("Am I wrong?");

var path = __dirname;

app.use(express.static('public'));

app.get("/", function(req, res) {
  console.log("Sending /public/about.html");
  res.sendFile(path + "/public/about.html");
});

app.get("/format", function(req, res) {
  console.log("Sending /public/scheduleformat.html");
  res.sendFile(path + "/public/scheduleformat.html");
});

console.log("Listening on http://localhost:3000");
app.listen(3000);
