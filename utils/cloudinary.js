const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const credential = require('../config');
cloudinary.config({
    cloud_name:credential.cloudinaryCloudName,
    api_key:credential.cloudinaryApiKey,
    api_secret:credential.cloudinaryApiSecret,
});
const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params: async (req,file)=>{
        let folderName = 'productImages';
        if(file.fieldname === 'storeLogo'){
            folderName = 'seller/storeLogo';
        }else if(file.fieldname === 'headerLogoForPdf' || file.fieldname === 'footerLogoForPdf'){
            folderName = 'seller/banner';
        }
        return {
            folder : folderName,
            allowed_formats: ["jpg", "jpeg", "png"],
            public_id: `${file.fieldname}-${Date.now()}-${file.originalname.replace(/\s+/g, '_').split('.')[0]}-pid`
        }
    } 
});

const upload= multer({storage});
module.exports = {upload,cloudinary};