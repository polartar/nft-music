const AWS = require("aws-sdk");
const md5 = require("md5");
const Bottleneck = require("bottleneck/es5");
const config = require("../config.json");

const AWS_ENDPOINT = "sfo2.digitaloceanspaces.com";
const limiter = new Bottleneck({
  minTime: 10,
});

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
  uploadFile,
  deleteFileWithURL,
};
