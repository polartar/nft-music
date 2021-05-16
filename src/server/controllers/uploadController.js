const AWS = require("aws-sdk");
const md5 = require("md5");
const Bottleneck = require("bottleneck/es5");
const config = require("../config.json");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const AWS_ENDPOINT = "sfo2.digitaloceanspaces.com";
const limiter = new Bottleneck({
  minTime: 10,
});

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

module.exports = {
  commitVideo,
  uploadFile,
  deleteFileWithURL,
};
