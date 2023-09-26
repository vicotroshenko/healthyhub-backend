const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const swaggerUi = require('swagger-ui-express');
require("dotenv").config();

const swaggerDocument = require("./swagger.json");

const { recommendedFoodRouter, healthyRouter, authRouter, settingsRouter } = require("./routes/api");
const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());

app.use("/api", recommendedFoodRouter);
app.use("/api/user", healthyRouter);
app.use("/api/auth", authRouter);
app.use("/api/settings", settingsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use((req, res) => {
	res.status(404).json({ message: "Not found"});
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Server error" } = err;
	res.status(status).json({ message });
})



module.exports = app;