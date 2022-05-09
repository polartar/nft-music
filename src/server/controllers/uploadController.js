const AWS = require("aws-sdk");
const md5 = require("md5");
const Bottleneck = require("bottleneck/es5");
const config = require("../config.json");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const { MongoClient, ObjectId } = require("mongodb");
const { Readable, PassThrough } = require("stream");
const { response } = require("express");
const { ethers, utils } = require("ethers");

const { fetchOwnerNfts } = require("../utility/moralisApi");

const AWS_ENDPOINT = "sfo2.digitaloceanspaces.com";
const limiter = new Bottleneck({
  minTime: 10,
});

// connect to our mongodb database
async function connectToDatabase() {
  let params = {};

  if (process.env.DATABASE_URL) {
    params = {
      useNewurlParser: true,
      useUnifiedTopology: true,
      tls: true,
      tlsCAFile: "./ca-certificate.crt",
    };
  }
  const client = await MongoClient.connect(
    process.env.DATABASE_URL
      ? process.env.DATABASE_URL
      : "mongodb://localhost:27017",
    params
  );

  db = client.db("secretgarden");
  console.log("UploadController connected successfully to MongoDB");
}

setTimeout(() => {
  connectToDatabase();
}, 100);

// Takes a video blob, merges in audio, then uploads it and reassigns our smart contract link
async function commitVideo(video, soundPaths) {
  fs.writeFileSync(`${video.originalname}.webm`, video.buffer, () =>
    console.log("video saved!")
  );

  ffmpeg()
    .addInput("./public/artists/oksami/garden/Garden Sounds 2.mp3")
    .addInput("./public/artists/oksami/garden/Garden Sounds 3.mp3")
    .addInput("./public/artists/oksami/garden/Garden Sounds 4.mp3")
    .addInput("./public/artists/oksami/garden/Garden Bass 4.mp3")
    .addInput("./public/artists/oksami/garden/Garden Drums 4.mp3")
    .complexFilter("amix=inputs=5")
    .save("output.mp3")
    .on("end", () => {
      ffmpeg()
        .addInput(`output.mp3`)
        .addInput(`${video.originalname}.webm`)
        .save("output.mp4");
    });
}

async function exportRecording(response, recording, artistName, name, edition) {
  try {
    let nft = await db.collection("NFTs").findOne({
      artistName,
      name,
      edition: parseFloat(edition),
    });

    console.log(recording);

    const stream = Readable.from(recording.buffer);

    const uuid = md5(recording.buffer);

    ffmpeg()
      .addInput(nft.localImageURL)
      .inputOption("-stream_loop -1")
      .addInput(stream)
      .outputOptions(
        "-preset",
        "ultrafast",
        "-tune",
        "zerolatency",
        "-crf",
        "28",
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-shortest",
        "-fflags",
        "shortest",
        "-max_interleave_delta",
        "100M"
      )
      .videoFilters([
        {
          filter: "drawtext",
          options: {
            fontfile: "Bentham-Regular.ttf",
            text: name,
            fontsize: 48,
            fontcolor: "white",
            x: "10",
            y: "h-th-40",
          },
        },
        {
          filter: "drawtext",
          options: {
            fontfile: "Manrope-SemiBold.ttf",
            text: `by ${nft.artistName} ${
              nft.visualArtistName ? `& ${nft.visualArtistName}` : ""
            }`,
            fontsize: 28,
            fontcolor: "white",
            x: "10",
            y: "h-th-10",
          },
        },
        {
          filter: "drawtext",
          options: {
            fontfile: "Bentham-Regular.ttf",
            text: "SECRET GARDEN",
            fontsize: 36,
            fontcolor: "white",
            x: "w-tw-10",
            y: "h-th-10",
          },
        },
      ])
      .on("error", (error) => console.log(`Encoding Error: ${error.message}`))
      .saveToFile(`${uuid}.mp4`)
      .on("end", () => {
        response.download(`./${uuid}.mp4`, "my recording.mp4", function(err) {
          if (err) {
            console.log("below is the error");
            console.log(err); // Check error if you want
          }
          fs.unlink(`./${uuid}.mp4`, function() {
            console.log("File was deleted"); // Callback
          });
        });
      });
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
}

async function uploadFile(file, folder, extension) {
  const spacesEndpoint = new AWS.Endpoint(`https://${AWS_ENDPOINT}/${folder}`);
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: config.spacesAccessKeyId,
    secretAccessKey: config.spacesSecretKey,
  });
  const uuid = md5(file.buffer);
  const params = {
    Body: file.buffer,
    Bucket: "properties",
    Key: `${uuid}.${extension}`,
    ACL: "public-read",
  };

  try {
    await limiter.schedule(() => s3.putObject(params).promise());

    const url = `https://properties.${AWS_ENDPOINT}/${folder}/${uuid}.${extension}`;

    return url;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function deleteFileWithURL(url) {
  const fileName = url.split("/").slice(-1)[0];
  const folder = url.split("/").slice(-2)[0];

  const spacesEndpoint = new AWS.Endpoint(`https://${AWS_ENDPOINT}/${folder}`);
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: config.spacesAccessKeyId,
    secretAccessKey: config.spacesSecretKey,
  });

  const params = {
    Bucket: "properties",
    Key: fileName,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function saveMix(
  ownerAddress,
  signature,
  tokenAddress,
  tokenId,
  padRecording
) {
  console.log("inside uploadController, saving mix...", {
    ownerAddress,
    tokenAddress,
    tokenId,
  });
  const ownerNfts = await fetchOwnerNfts(ownerAddress, tokenAddress);

  // const address = "0x518e354ca7419b5c9b4d13090321fc9a03e036d5";

  if (ownerNfts.length > 0) {
    try {
      const verifiedAddress = utils.verifyMessage(ownerAddress, signature);

      console.log({ verifiedAddress, ownerAddress });
      if (verifiedAddress && verifiedAddress === ownerAddress) {
        const existingTokenMix = await db.collection("mixes").findOne({
          tokenAddress: tokenAddress,
          tokenId: tokenId,
        });

        if (!existingTokenMix) {
          console.log("mix doesn't exist, saving it");
          await db.collection("mixes").insertOne({
            tokenAddress: tokenAddress,
            tokenId: tokenId,
            padRecording: padRecording,
          });

          return {
            status: 200,
            response: "Successfully saved mix!",
          };
        } else {
          console.log("mix already exists, updating it");
          await db.collection("mixes").updateOne(
            {
              tokenAddress: tokenAddress,
              tokenId: tokenId,
            },
            {
              $set: {
                padRecording: padRecording,
              },
            },
            { upsert: true }
          );

          return {
            status: 200,
            response: "Successfully updated mix!",
          };
        }
      }
    } catch (error) {
      console.log(error);
      return { status: 400, response: error.toString() };
    }
  }

  return { status: 400, response: "User does not own this token." };
}

async function getMix(tokenAddress, tokenId) {
  console.log({ tokenAddress, tokenId });
  // if (!ownerAddress) {
  //   return { status: 400, response: "User has not connected a wallet" };
  // }
  // const tokenOwners = await fetchTokenOwners(tokenAddress, tokenId);

  // const address = "0x518e354ca7419b5c9b4d13090321fc9a03e036d5";
  // const ownedTokens = tokenOwners.filter(
  //   // token => token.owner_of === ownerAddress.toLowerCase()
  //   token => token.owner_of === address.toLowerCase()
  // );

  // if (ownedTokens.length > 0) {
  try {
    const userMix = await db.collection("mixes").findOne({
      // address: ownerAddress.toLowerCase(),
      tokenAddress,
      tokenId,
    });
    console.log("userMix: ", userMix);

    return {
      status: 200,
      response: userMix,
    };
  } catch (error) {
    console.log(error);
    return { status: 400, response: error.toString() };
  }
  // }

  // return { status: 400, response: "User does not own this token." };
}

module.exports = {
  commitVideo,
  uploadFile,
  deleteFileWithURL,
  exportRecording,
  saveMix,
  getMix,
};
