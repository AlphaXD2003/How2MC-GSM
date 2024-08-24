const { v2 : cloudinary } = require('cloudinary');
const {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = process.env;
const fs = require('fs');
const uploadCloudinary  = async (localpath) => {
try {
  
      // Configuration
      cloudinary.config({ 
          cloud_name: `${CLOUDINARY_CLOUD_NAME}`,
          api_key: `${CLOUDINARY_API_KEY}`,
          api_secret: `${CLOUDINARY_API_SECRET}` // Click 'View API Keys' above to copy your API secret
      });
      
      // Upload an image
       const uploadResult = await cloudinary.uploader
         .upload(
             localpath, {
              resource_type: 'auto'
             }
         )
         .catch((error) => {
             //console.log(error);
         });
      
      return uploadResult.secure_url
      
      // // Optimize delivery by resizing and applying auto-format and auto-quality
      // const optimizeUrl = cloudinary.url('shoes', {
      //     fetch_format: 'auto',
      //     quality: 'auto'
      // });
      
      // //console.log(optimizeUrl);
      
      // // Transform the image: auto-crop to square aspect_ratio
      // const autoCropUrl = cloudinary.url('shoes', {
      //     crop: 'auto',
      //     gravity: 'auto',
      //     width: 500,
      //     height: 500,
      // });
      
      // //console.log(autoCropUrl);   
      
} catch (error) {
    //console.log(error.message)
    fs.unlinkSync(localpath)
} 
};

module.exports = {
  uploadCloudinary
}