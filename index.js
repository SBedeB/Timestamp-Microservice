// index.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// Middleware for the API endpoint
const nowMiddleware = (req, res, next) => {
  req.time = new Date().toString();
  next();
};

// Root-Level Request Logger Middleware
app.use((req, res, next) => {
  const method = req.method;
  const path = req.path;
  const ip = req.ip;
  console.log(`${method} ${path} - ${ip}`);
  next();
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Middleware to handle timestamp requests
app.use("/api/:date?", (req, res, next) => {
  const dateString = req.params.date;

  if (!dateString) {
    // If the date parameter is empty, use the current time
    req.parsedDate = new Date();
  } else if (!isNaN(dateString)) {
    // If the date is a valid Unix timestamp, parse it
    req.parsedDate = new Date(parseInt(dateString));
  } else {
    // Check if the date is valid
    const parsedDate = new Date(dateString);
    if (!isNaN(parsedDate.getTime())) {
      req.parsedDate = parsedDate;
    } else {
      // If the date is invalid, return an error
      return res.json({ error: "Invalid Date" });
    }
  }

  next();
});

// Route handler for the timestamp endpoint
app.get("/api/:date?", nowMiddleware, (req, res) => {
  const unixTimestamp = req.parsedDate.getTime();
  const utcString = req.parsedDate.toUTCString();

  res.json({ unix: unixTimestamp, utc: utcString });
});

// listen for requests
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app;
