const User = require("../models/user");
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");
const { isEmpty } = require("../helpers");

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// END OF CLOUDINARY CONFIG

exports.uploadLicense = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (error, fields, files) => {
    if (error)
      return res.status(400).json({ error: "Image could not be uploaded" });
    if (!isEmpty(files)) {
      if (files.photo.size > 1000000) {
        return res
          .status(400)
          .json({ error: "Image should not be more than 1mb" });
      }

      const photo = files.photo.path;

      cloudinary.uploader.upload(photo, (error, result) => {
        if (error)
          return res.status(400).json({ error: "Image cloudinary error" });

        return User.findByIdAndUpdate(
          req.profile._id,
          { $set: { "driver.driversLicense": result.secure_url } },
          (error, success) => {
            if (error) return res.status(400).json({ error: "Image db error" });

            return res.status(200).json({ success: "success" });
          }
        );
      });
    } else {
      return res.status(400).json({ error: "image not detected" });
    }
  });
};
