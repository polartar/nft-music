const express = require("express");
const bodyParser = require("body-parser");
const robots = require("express-robots-txt");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const upload = multer();
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("*.js", function(req, res, next) {
  req.url = req.url + ".gz";
  res.set("Content-Encoding", "gzip");
  res.set("Content-Type", "text/javascript");
  next();
});

app.get("*.css", function(req, res, next) {
  req.url = req.url + ".gz";
  res.set("Content-Encoding", "gzip");
  res.set("Content-Type", "text/css");
  next();
});

app.use(robots({ UserAgent: "*", Allow: "/" }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static("dist"));
app.use(express.static("public"));

app.use("/public", express.static("public"));

app.enable("trust proxy");

const nftController = require("./controllers/nftController");
const userController = require("./controllers/userController");
const uploadController = require("./controllers/uploadController");

app.get("/api/metadata/:id", async (req, res) => {
  res.status(200).json({
    description:
      "Friendly OpenSea Creature that enjoys long swims in the ocean.",
    external_url: "https://openseacreatures.io/3",
    image:
      "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
    name: "Dave Starbelly"
  });
});

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

app.post("/api/addEmail", async (req, res) => {
  const { status, response } = await userController.addEmail(req.body.email);

  res.status(status).send(response);
});

app.post("/api/upload", upload.single("video"), async (req, res) => {
  uploadController.commitVideo(req.file);
  console.log(req.file);
});

app.post("/api/exportRecording", upload.single("video"), async (req, res) => {
  await uploadController.exportRecording(
    res,
    req.file,
    req.body.artistName,
    req.body.nftName,
    req.body.edition
  );
});

app.post("/api/saveMix", async (req, res) => {
  const { status, response } = await uploadController.saveMix(
    req.body.address,
    req.body.signature,
    req.body.tokenId,
    req.body.padRecording
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

app.get("/api/getOrdersForNFT", async (req, res) => {
  const { status, response } = await nftController.getOrdersForNFT(
    req.query.nftID,
    req.query.useTestnet === "true"
  );

  res.status(status).send(response);
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve("./dist/index.html"));
});

app.listen(process.env.PORT || 8081, () =>
  console.log(`Listening on port ${process.env.PORT || 8081}!`)
);
