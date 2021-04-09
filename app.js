const path = require("path");
const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const bodyParser = require("body-parser");
const app = express();

const userRouter = require("./routes/userRoutes");
const viewRouter = require("./routes/viewRoutes");
const geoRouter = require("./routes/geoRoutes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
//Development  logging
app.use(morgan("dev"));

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many requests from this IP, please try again in 60 minutes..",
});
app.use("/api", limiter);

app.use(express.json({ limit: "80kb" }));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
//looks at req.body, query and param. Filters out $ and dots (.)
app.use(mongoSanitize());

//Data sanitization against XSS
//cleans user input from malicious html code (JS can be attached to html)
app.use(xss());

//Serving static files
app.use(express.static(`${__dirname}/public`));
//Test middleware (request time)
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES (Mounting)
app.use("/api/v1/users", userRouter);
app.use("/api/v1/geodata", geoRouter);
app.use("/", viewRouter);

//Error for unkown routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can´t find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
