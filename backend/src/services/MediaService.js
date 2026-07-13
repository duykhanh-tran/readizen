import { uploadToCloudinary } from '../lib/cloudinary.js';

class MediaService {
    async upload(file, folder = 'videos') {
        if (!file) {
            throw new Error('Không tìm thấy tệp tin tải lên.');
        }
        return await uploadToCloudinary(
            file.buffer,
            file.originalname,
            file.mimetype,
            folder
        );
    }
}

export default new MediaService();
