// const cloudinary = require("cloudinary").v2;

// exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
//   const options = { folder };

//   if (height) options.height = height;
//   if (quality) options.quality = quality;

//   options.resource_type = "auto";

//   return await cloudinary.uploader.upload(file.tempFilePath, options);
// };

// utils/uploadImage.js

// utils/uploadImage.js

const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = { folder };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    options.resource_type = "auto";

    // Normalize the file path to use forward slashes
    // This is crucial for cross-platform compatibility, especially for Cloudinary
    const normalizedTempFilePath = file.tempFilePath.replace(/\\/g, '/'); // Replaces all backslashes with forward slashes

    try {
        // Use the normalized path
        return await cloudinary.uploader.upload(normalizedTempFilePath, options);
    } catch (error) {
        console.error("Error uploading to Cloudinary in uploadImageToCloudinary utility:", error);
        // Add more specific error logging if needed, e.g., error.response for network issues
        // It's good to re-throw the error so the controller knows it failed
        throw error;
    }
};