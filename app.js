// require the express module
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/index');
const connect = require('./dbconnect');

app.get("/", (req, res) => {
  res.send("App start...");
});

connect.then((db) => {
  console.log(`Connected to MongoDB`);
}).catch((e) => {
  console.error(`Could not init db\n${e.trace}`);
});

app.use(cors());

// bodyparser middleware
app.use(bodyParser.json());

// routes
require('./modules/common/router')(app);
require('./modules/Admin/router')(app);
require('./modules/Brokers/router')(app);
require('./modules/Followers/router')(app);
require('./modules/Help/router')(app);
require('./modules/Notification/router')(app);
require('./modules/Property/router')(app);
require('./modules/Review/router')(app);
require('./modules/Wishlist/router')(app);
require('./modules/Callrequest/router')(app);
require('./modules/Flagproperty/router')(app);
require('./modules/Soldproperty/router')(app);
require('./modules/Constant/router')(app);

const server = express()
  .use(app)
  .listen(config.port, () => console.log(`Listening on Port: ${config.port}`));


