import config from "../../config";
import Seller from "../../models/seller.model";
import { ISeller } from "../../types/seller";
import { ERRORS } from "../../utils/errors";
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({ keyFilename: "paysfr-6bb701121333.json" });
const bucket = storage.bucket(config.get("gcpSellerBucket"));

const UploadService = async (files, sellerData: ISeller) => {
  console.log('sellerData',sellerData)
  console.log('filesfilesfiles',files)
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
    files.forEach((file) => {  
      fileUploadPromises.push(() => fileUpload(file)); 
    });

    try {
      fileUploadObjData = await Promise.all(
        fileUploadPromises.map((promise) => promise())
      );
      sellerData.uploads = fileUploadObjData;
      try {
        const newUser = new Seller(sellerData);
        let createNewSeller = await newUser.save();
        return [null, createNewSeller];
      } catch (e) {
        return [
          {
            [ERRORS.BAD_REQUEST]: `Error Occured in creating seller, check validations`,
          },
        ];
      }
    } catch (err) {
      return [
        { [ERRORS.INTERNAL]: `Error occured while resolving all the promises` },
      ];
    }
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

const fileUpload = async (fileObj) => {
  console.log('fileObjfileObj',fileObj)
  return new Promise(async (resolve, reject) => {
    try {
      const blob = bucket.file(fileObj.originalname + Date.now());
      console.log('blobblobblob',blob)

      blob
        .createWriteStream({
          resumable: false,
        })
        .on("finish", () => {
          console.log('raissss',`${bucket.name}/${blob.name}`)

          const publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          );
          console.log('raissss',publicUrl)
          resolve({ url: publicUrl });
        })
        .on("error", (err) => {
          console.log('errorerrorerror',err)

          reject({ "upload error": err });
        })
        .end(fileObj.buffer);
    } catch (err) {
      reject({ message: "error occured on blob create stream" });
    }
  });
};

export default UploadService;
