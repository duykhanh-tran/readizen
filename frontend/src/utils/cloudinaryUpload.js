import axios from 'axios';
import axiosInstance from '../services/axios';

/**
 * Upload a file directly to Cloudinary using a signature from our backend
 * @param {Blob|File} file - The file/blob to upload
 * @param {string} folder - The target folder on Cloudinary
 * @returns {Promise<string>} The uploaded file's secure URL
 */
export const uploadDirectToCloudinary = async (file, folder = 'readizen') => {
    // 1. Fetch signature from backend
    const signatureRes = await axiosInstance.get(`/upload/signature?folder=${folder}`);
    const { signature, timestamp, apiKey, cloudName } = signatureRes.data;

    // If it's a mock environment (missing env variables on backend)
    if (signature === 'mock_signature') {
        const timestampMock = Date.now();
        const isPdf = file.type === 'application/pdf' || file.name?.endsWith('.pdf');
        const isAudio = file.type.startsWith('audio/') || file.name?.endsWith('.mp3') || file.name?.endsWith('.wav') || file.name?.endsWith('.webm');
        const isVideo = file.type.startsWith('video/') || file.name?.endsWith('.mp4');

        if (isPdf) {
            return `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf?mock_upload=mock_${timestampMock}`;
        } else if (isAudio) {
            return `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3?mock_upload=mock_${timestampMock}`;
        } else if (isVideo) {
            return `https://www.w3schools.com/html/mov_bbb.mp4?mock_upload=mock_${timestampMock}`;
        } else {
            return `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?mock_upload=mock_${timestampMock}`;
        }
    }

    // 2. Upload directly to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    // Make request directly to Cloudinary. We use default axios (not our instance)
    // to avoid attaching the application Authorization headers to Cloudinary API.
    const response = await axios.post(uploadUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });

    return response.data.secure_url;
};
