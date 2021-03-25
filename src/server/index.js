const express = require("express");
const bodyParser = require("body-parser");
const robots = require("express-robots-txt");

const app = express();

app.use(robots({ UserAgent: "*", Allow: "/" }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static("dist"));
app.use(express.static("public"));

app.enable("trust proxy");

app.get("*", (req, res) => {
  res.sendFile(path.resolve("./dist/index.html"));
});

app.listen(process.env.PORT || 8081, () =>
  console.log(`Listening on port ${process.env.PORT || 8081}!`)
);
