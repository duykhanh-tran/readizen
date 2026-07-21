import request from 'supertest';
import { jest } from '@jest/globals';
import { app } from '../../src/server.js';
import SmartCodeRegistry from '../../src/models/SmartCodeRegistry.js';
import Lesson from '../../src/models/Lesson.js';

describe('Search Route Integration Tests', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return 400 for invalid code length/pattern', async () => {
        const response = await request(app)
            .get('/api/search/smart-code/123'); // 3 digits only
        
        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Mã Smart Code không hợp lệ');
    });

    it('should return 404 if code is not registered', async () => {
        jest.spyOn(SmartCodeRegistry, 'findOne').mockResolvedValue(null);

        const response = await request(app)
            .get('/api/search/smart-code/9999');
        
        expect(response.status).toBe(404);
        expect(response.body.message).toContain('Không tìm thấy nội dung');
    });

    it('should return redirectUrl and details for registered Lesson code', async () => {
        const mockRegistry = {
            code: '1234',
            resourceId: 'mock_lesson_id',
            resourceType: 'Lesson'
        };
        const mockLesson = {
            _id: 'mock_lesson_id',
            title: 'Mock Lesson Title',
            level: 'A'
        };

        jest.spyOn(SmartCodeRegistry, 'findOne').mockResolvedValue(mockRegistry);
        jest.spyOn(Lesson, 'findById').mockResolvedValue(mockLesson);

        const response = await request(app)
            .get('/api/search/smart-code/1234');
        
        expect(response.status).toBe(200);
        expect(response.body.redirectUrl).toBe('/lessons/mock_lesson_id');
        expect(response.body.details.title).toBe('Mock Lesson Title');
    });
});
