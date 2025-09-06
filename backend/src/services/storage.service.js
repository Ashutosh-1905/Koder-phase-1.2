const ImageKit = require("imagekit");
const utils = require("../utils/utils");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT
});


const uploadFile = async(file)=>{
    const result =await imagekit.upload({
        file: file,
        fileName:utils.createId(),
        folder:"Market-Place"
    });
    return result;
}

module.exports = {uploadFile};