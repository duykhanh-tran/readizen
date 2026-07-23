import { uploadToCloudinary, default as cloudinary } from '../lib/cloudinary.js';

class MediaStorageService {
  /**
   * Upload a file buffer to storage via the active provider (Cloudinary currently).
   * @param {Object} file - Multer file object (file.buffer, file.originalname, file.mimetype, file.size)
   * @param {string} category - Category/type of asset ('thumbnail' | 'cover' | 'audio' | 'video')
   * @param {string} folder - Target folder inside storage (default: 'readizen/podcasts')
   * @returns {Promise<Object>} Standard AssetObject metadata
   */
  async uploadAsset(file, category = 'thumbnail', folder = 'readizen/podcasts') {
    if (!file || !file.buffer) {
      throw new Error('Không tìm thấy tệp tin hợp lệ để tải lên.');
    }

    const fileSize = file.size || file.buffer.length;
    const originalName = file.originalname || 'file';
    const mimeType = (file.mimetype || '').toLowerCase();
    const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
    const format = extMatch ? extMatch[1].toLowerCase() : (mimeType.split('/')[1] || 'bin');

    // Strict file size and MIME type validation according to product requirements
    if (category === 'thumbnail' || category === 'cover') {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      const allowedExts = ['jpg', 'jpeg', 'png', 'webp'];

      if (!allowedMimes.includes(mimeType) && !allowedExts.includes(format)) {
        throw new Error('Định dạng ảnh không hợp lệ. Vui lòng chỉ chọn tệp ảnh JPG, PNG hoặc WEBP.');
      }

      if (fileSize > 3 * 1024 * 1024) {
        throw new Error('Ảnh bìa/đại diện không được vượt quá 3MB. Vui lòng chọn ảnh JPG, PNG hoặc WEBP có dung lượng nhỏ hơn.');
      }
    }

    if (category === 'audio' && fileSize > 20 * 1024 * 1024) {
      throw new Error('Dung lượng tệp âm thanh audio không được vượt quá 20MB.');
    }
    if (category === 'video' && fileSize > 50 * 1024 * 1024) {
      throw new Error('Dung lượng tệp video tải trực tiếp không được vượt quá 50MB. Vui lòng ưu tiên dùng liên kết YouTube hoặc TikTok.');
    }

    // Direct stream upload to Cloudinary using helper
    const secureUrl = await uploadToCloudinary(
      file.buffer,
      originalName,
      mimeType,
      folder
    );

    // Extract resource type
    const isPdf = mimeType === 'application/pdf' || format === 'pdf';
    const isAudio = mimeType.startsWith('audio/') || ['mp3', 'wav', 'webm'].includes(format);
    const isVideo = mimeType.startsWith('video/') || ['mp4', 'mov', 'avi'].includes(format);
    const resourceType = isPdf ? 'raw' : ((isAudio || isVideo) ? 'video' : 'image');

    // Derive publicId / assetKey from secureUrl or fallback
    let assetKey = originalName;
    try {
      if (secureUrl.includes('cloudinary.com')) {
        const urlParts = secureUrl.split('/');
        const uploadIdx = urlParts.indexOf('upload');
        if (uploadIdx !== -1) {
          const pathParts = urlParts.slice(uploadIdx + 2);
          assetKey = pathParts.join('/').replace(/\.[^/.]+$/, '');
        }
      }
    } catch (err) {
      console.warn('Could not parse publicId from secureUrl:', err);
    }

    return {
      storageProvider: 'cloudinary',
      assetUrl: secureUrl,
      assetKey,
      resourceType,
      format,
      bytes: fileSize
    };
  }

  /**
   * Delete an asset from storage provider.
   * @param {Object} assetObject - Asset metadata object
   */
  async deleteAsset(assetObject) {
    if (!assetObject || !assetObject.assetKey) return;

    if (assetObject.storageProvider === 'cloudinary') {
      try {
        const resType = assetObject.resourceType || 'image';
        await cloudinary.uploader.destroy(assetObject.assetKey, { resource_type: resType });
      } catch (error) {
        console.error('Lỗi khi xóa tệp trên Cloudinary:', error);
      }
    } else if (assetObject.storageProvider === 'r2') {
      console.log('R2 deletion handler placeholder for assetKey:', assetObject.assetKey);
    }
  }
}

export default new MediaStorageService();
