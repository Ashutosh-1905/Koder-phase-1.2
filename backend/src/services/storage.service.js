const ImageKit = require("imagekit");
const utils = require("../utils/utils");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT
});

const uploadFile = async (fileBuffer) => { // Change parameter name to fileBuffer for clarity
    try {
        // Convert the file buffer to a Base64 string
        const base64File = fileBuffer.toString('base64');
        
        const result = await imagekit.upload({
            file: base64File,
            fileName: utils.createId(),
            folder: "MarketPlace"
        }); 

        return result;
    } catch (error) {
        console.error("ImageKit upload error:", error);
        throw new Error("Failed to upload image to ImageKit");
    }
};

module.exports = { uploadFile };