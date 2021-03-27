const express = require("express");
const bodyParser = require("body-parser");
const robots = require("express-robots-txt");
const path = require("path");

const app = express();

app.use(robots({ UserAgent: "*", Allow: "/" }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static("dist"));
app.use(express.static("public"));

app.enable("trust proxy");

const nftController = require("./controllers/nftController");
const userController = require("./controllers/userController");

app.get("/api/getUser", async (req, res) => {
  const { status, response } = await userController.getUser(req.query.address);

  res.status(status).send(response);
});

app.get("/api/getUsers", async (req, res) => {
  const { status, response } = await userController.getUsers(
    req.query.addresses
  );

  res.status(status).send(response);
});

app.post("/api/updateUser", async (req, res) => {
  const { status, response } = await userController.updateUser(
    req.body.address,
    req.body.signature,
    req.body.displayName,
    req.body.email
  );

  res.status(status).send(response);
});

app.get("/api/getAllNFTs", async (req, res) => {
  const { status, response } = await nftController.getAllNFTs();

  res.status(status).send(response);
});

app.get("/api/getNFT", async (req, res) => {
  const { status, response } = await nftController.getNFT(
    req.query.artistName,
    req.query.nftName,
    req.query.edition
  );

  res.status(status).send(response);
});

app.get("/api/getFeaturedNFT", async (req, res) => {
  const { status, response } = await nftController.getFeaturedNFT();

  res.status(status).send(response);
});

app.get("/api/getNFTsForUser", async (req, res) => {
  const { status, response } = await nftController.getNFTsForUser(
    req.query.address
  );

  res.status(status).send(response);
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve("./dist/index.html"));
});

app.listen(process.env.PORT || 8081, () =>
  console.log(`Listening on port ${process.env.PORT || 8081}!`)
);
