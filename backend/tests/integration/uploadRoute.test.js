import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../src/server.js';

describe('Upload Route Integration Tests', () => {
    let token;

    beforeAll(() => {
        // Set environment variables for tests
        process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
        process.env.CLOUDINARY_API_KEY = 'mock_key';
        process.env.CLOUDINARY_CLOUD_NAME = 'mock_cloud';
        
        // Generate valid JWT token
        token = jwt.sign(
            { id: 'user_123', role: 'client' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    it('should block requests without a token', async () => {
        const response = await request(app)
            .get('/api/upload/signature');
        
        expect(response.status).toBe(401);
        expect(response.body.message).toContain('Truy cập bị từ chối');
    });

    it('should return signature details for authenticated requests', async () => {
        const response = await request(app)
            .get('/api/upload/signature?folder=speech')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('signature');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('apiKey', 'mock_key');
        expect(response.body).toHaveProperty('cloudName', 'mock_cloud');
        expect(response.body.folder).toBe('speech');
    });
});
