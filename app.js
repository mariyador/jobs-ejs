const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const connectDB = require("./db/connect");
require("dotenv").config();
require("express-async-errors");

// Initialize the Express app
const app = express();

// Set up MongoDB session store
const url = process.env.MONGO_URI;
const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});

store.on("error", function (error) {
  console.log(error);
});

// Configure session parameters
const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}

// Middleware setup
app.use(session(sessionParms));
app.use(flash());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

passportInit();
app.use(passport.initialize());
app.use(passport.session());

// Middleware to add flash messages to the response locals
app.use((req, res, next) => {
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  next();
});

const storeLocals = require("./middleware/storeLocals");
app.use(storeLocals);

// Routes
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));

const auth = require("./middleware/auth");
app.use("/secretWord", auth, require("./routes/secretWord"));

// 404 handler
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
