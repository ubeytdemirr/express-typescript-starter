import S3 from 'aws-sdk/clients/s3'

import multer from "multer"

import multerS3 from "multer-s3"

import {extname} from "path"

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-central-1",
});


const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'cdn.yourapp.com',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (_req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req:any, file, cb) {
      cb(null, req.params.id||Date.now().toString()+extname(file.originalname))
    }
  })
})

export default upload;
