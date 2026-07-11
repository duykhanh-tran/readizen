import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

/**
 * Upload a file buffer to Cloudinary using upload_stream.
 * @param {Buffer} fileBuffer - Multer memory buffer
 * @param {string} originalName - Name of the file with extension
 * @param {string} mimeType - File mime type
 * @param {string} folder - Target folder path on Cloudinary
 * @returns {Promise<string>} Uploaded file secure URL
 */
export const uploadToCloudinary = (fileBuffer, originalName, mimeType, folder = 'readizen') => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary is configured
    const isMock = !process.env.CLOUDINARY_CLOUD_NAME || 
                   process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name';
    
    // BẮT BUỘC phân loại resource_type
    const isPdf = mimeType === 'application/pdf' || 
                  (originalName && originalName.toLowerCase().endsWith('.pdf'));
    const isAudio = mimeType.startsWith('audio/') || 
                    (originalName && (originalName.toLowerCase().endsWith('.mp3') || originalName.toLowerCase().endsWith('.wav') || originalName.toLowerCase().endsWith('.webm')));
    const isVideo = mimeType.startsWith('video/') ||
                    (originalName && (originalName.toLowerCase().endsWith('.mp4') || originalName.toLowerCase().endsWith('.mov') || originalName.toLowerCase().endsWith('.avi')));
    const resourceType = isPdf ? 'raw' : ((isAudio || isVideo) ? 'video' : 'image');

    if (isMock) {
      console.warn(`⚠️ Cloudinary is not configured. Using fallback mock URL for resource type: ${resourceType}.`);
      const timestamp = Date.now();
      const mockFileName = `mock_${timestamp}`;
      if (isPdf) {
        resolve(`https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf?mock_upload=${mockFileName}`);
      } else if (isAudio) {
        resolve(`https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3?mock_upload=${mockFileName}`);
      } else if (isVideo) {
        resolve(`https://www.w3schools.com/html/mov_bbb.mp4?mock_upload=${mockFileName}`);
      } else {
        resolve(`https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?mock_upload=${mockFileName}`);
      }
      return;
    }

    const options = {
      folder,
      resource_type: resourceType,
    };

    if (isPdf) {
      const cleanName = originalName 
        ? originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_")
        : "document";
      options.public_id = `${cleanName}_${Date.now()}.pdf`;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          // In log chi tiết mã lỗi từ Cloudinary
          console.error('[Cloudinary Stream Upload Error Detail]:', JSON.stringify(error, null, 2));
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
