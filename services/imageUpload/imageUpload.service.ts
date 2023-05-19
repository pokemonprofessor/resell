import { async } from "validate.js";
import config from "../../config";
import Seller from "../../models/seller.model";
import { ISeller } from "../../types/seller";
import { ERRORS } from "../../utils/errors";
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({ keyFilename: "paysfr-02f956593b9b.json",projectId: "paysfr" });
const bucket = storage.bucket(config.get("gcpSellerBucket"));

const UploadImageService = async (files, data: any) => {
console.log('dataataaaa',files)
  try {
    if (files.length === 0) {
      return [
        {
          [ERRORS.BAD_REQUEST]: "Please upload a file!",
        },
        null,
      ];
    }

    const fileUploadPromises = [];
    let fileUploadObjData = [];
    files.forEach(async(file) => {
      fileUploadPromises.push(async() =>     fileUpload(file)
      );
    });

    try {
        fileUploadObjData = await Promise.all(
          fileUploadPromises.map((promise) => promise())
        );
    }catch (err) {
            return [
              { [ERRORS.INTERNAL]: `Error occured while resolving all the promises` },
            ];
          }
    return [null, fileUploadObjData];
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return [
        {
          [ERRORS.INTERNAL]: `File size cannot be larger than 2MB!`,
        },
        null,
      ];
    }

    return [
      {
        [ERRORS.INTERNAL]: `Could not upload the file: ${files.originalname}. ${err}`,
      },
      null,
    ];
  }
};

const fileUpload = (fileObj) => {
    console.log('fileObj')
  return new Promise(async (resolve, reject) => {
    try {
      const blob = bucket.file(fileObj.originalname);
      blob
        .createWriteStream({
          resumable: false,
        })
        .on("finish", () => {
          const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          );
          console.log('publicUrlpublicUrl',publicUrl)
          resolve({ url: publicUrl });
        })
        .on("error", (err) => {
          reject({ "upload error": err });
        })
        .end(fileObj.buffer);
    } catch (err) {
      reject({ message: "error occured on blob create stream" });
    }
  });
};

export default UploadImageService;
