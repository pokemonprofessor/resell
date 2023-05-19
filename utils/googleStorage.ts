// import { Storage, } from '@google-cloud/storage'
// import axios from 'axios'

// const CONFIG = require('../getConfig')();

// const storage = new Storage({
//   credentials: CONFIG.FIREBASE.SERVICE_ACCOUNT,
//   projectId: CONFIG.CLOUD_BUCKET.PROJECT_ID,
// });

// const BUCKET_FOLDER = {
//   profilePictures : 'images/profile-pictures',
//   governmentId : 'images/governmentId',
//   products : 'images/product'
// }

/**
 * Get bucket path configuration
 *
 * @param {String} folderPath folder path
 * @returns {Object} Configuration of bucket url and path
 */
// const getBucketPathCofiguration = (folderPath) => {
//   let bucketName = CONFIG.CLOUD_BUCKET.BUCKET_NAME;

//   if (folderPath === BUCKET_FOLDER.signatures) {
//     bucketName = CONFIG.CLOUD_BUCKET.PRIVATE_BUCKET_NAME;
//   }

//   return {
//     bucket: storage.bucket(bucketName),
//     bucketURLPath: `https://storage.googleapis.com/${bucketName}`
//   };
// }

/**
 * Save a file on the bucket
 *
 * @param {String} name File name with extension
 * @param {Binary} buffer Buffer stream of the file
 * @param {Object} metadata Metadata of the file. Ex: contentType: 'application/pdf'
 * @param {String} folderPath (Optional) Folder name path of bucket
 * @returns {Promise<{url: string}>}
 */
// const saveFile = async (name, buffer, metadata, folderPath = '') => {
//   try {
//     const filePath = (folderPath) ? `${folderPath}/${name}` : name;
//     const { bucket, bucketURLPath } = getBucketPathCofiguration(folderPath);

//     const file = bucket.file(filePath);
//     await file.save(buffer, {
//       metadata,
//     });

//     return {
//       url: `${bucketURLPath}/${filePath}`,
//     }
//   } catch (error) {
//     throw error;
//   }
// };

/**
 * Get a svg file data using the file url
 *
 * @param {String} fileUrl URL of stored file in google cloud
 * @returns {Promise<string>}
 */
// const getBucketSvgFileContent = async (fileUrl) => {
//   try {
//     const response = await axios.get(fileUrl);
//     const base64String = response.data.toString('base64');
//     const base64Image = Buffer.from(base64String).toString('base64');
//     return `data:image/svg+xml;base64,${base64Image}`;
//   } catch(error) {
//     throw error
//   }
// };

/**
 * Get a signedURL of a file from private bucket
 *
 * @param {String} fileUrl URL of stored file in google cloud
 * @returns {Promise<url:string>}
 */
// const getSignedURL = async (fileUrl) => {
//   // The below two operations will work properly in following type of links:
//   // Case-1: With folder path: https://storage.googleapis.com/dev-test-private/signatures/62bed1d0-71c9-11eb-a680-255591ea6160.svg
//   // Case-2: Without folder path: https://storage.googleapis.com/dev-test-private/62bed1d0-71c9-11eb-a680-255591ea6160.svg

//   const filePath = fileUrl.split("/").splice(4).join('/');
//   const bucketName = fileUrl.split("/").splice(3, 1).join('');

//   const options = {
//     version: 'v2',
//     action: 'read',
//     // signed link will be expired after five minutes
//     expires: Date.now() + 1000 * 60 * 5,
//   };

//   try {
//     const [url] = await storage
//     .bucket(bucketName)
//     .file(filePath)
//     .getSignedUrl(options);

//     return url;
//   } catch(error) {
//     throw error;
//   }
// }

// module.exports = {
//   saveFile,
//   storage,
//   BUCKET_FOLDER,
//   getSignedURL,
//   getBucketSvgFileContent
// };
