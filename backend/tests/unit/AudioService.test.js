import AudioService from '../../src/services/AudioService.js';

describe('AudioService Unit Tests', () => {
    beforeAll(() => {
        // Force mock mode
        process.env.ASSEMBLYAI_API_KEY = 'your_assemblyai_key';
    });

    it('should return mock evaluation successfully for valid inputs', async () => {
        const mockFile = {
            buffer: Buffer.from('dummy audio content'),
            size: 3000,
            mimetype: 'audio/webm'
        };
        const result = await AudioService.evaluateSpeech('hello world', mockFile);
        
        expect(result).toHaveProperty('score');
        expect(result).toHaveProperty('transcript');
        expect(result).toHaveProperty('wordsFeedback');
        expect(result.score).toBeGreaterThan(0);
        expect(result.transcript).toBe('hello world');
        expect(result.wordsFeedback).toHaveLength(2);
    });

    it('should return 0 score and empty transcript if audio size is too small', async () => {
        const mockFile = {
            buffer: Buffer.from(''),
            size: 500,
            mimetype: 'audio/webm'
        };
        const result = await AudioService.evaluateSpeech('hello world', mockFile);
        
        expect(result.score).toBe(0);
        expect(result.transcript).toBe('');
        expect(result.reason).toBe('No speech detected');
    });

    it('should throw error if file and url are missing', async () => {
        await expect(AudioService.evaluateSpeech('hello world', null, null))
            .rejects
            .toThrow('Vui lòng gửi file ghi âm hoặc đường dẫn âm thanh để chấm điểm.');
    });

    it('should throw error if textToRead is missing', async () => {
        const mockFile = {
            buffer: Buffer.from('dummy audio content'),
            size: 3000,
            mimetype: 'audio/webm'
        };
        await expect(AudioService.evaluateSpeech('', mockFile))
            .rejects
            .toThrow('Thiếu nội dung câu đọc mẫu (textToRead).');
    });
});
