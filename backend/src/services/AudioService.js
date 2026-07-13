import { AssemblyAI } from 'assemblyai';

// Helper: Chuẩn hóa chuỗi tiếng Anh
const normalizeText = (text) => {
    return (text || '')
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
        .replace(/\s+/g, " ")
        .trim();
};

// Helper: Tính khoảng cách Levenshtein giữa 2 chuỗi
const getLevenshteinDistance = (a, b) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Thay thế
                    matrix[i][j - 1] + 1,     // Chèn
                    matrix[i - 1][j] + 1      // Xóa
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

// Helper: Tính tỷ lệ tương đồng
const getStringSimilarity = (s1, s2) => {
    const a = normalizeText(s1);
    const b = normalizeText(s2);
    if (a.length === 0 && b.length === 0) return 1.0;
    if (a.length === 0 || b.length === 0) return 0.0;
    const maxLen = Math.max(a.length, b.length);
    const dist = getLevenshteinDistance(a, b);
    return (maxLen - dist) / maxLen;
};

class AudioService {
    async evaluateSpeech(textToRead, file, audioUrlFromClient = null) {
        if (!file && !audioUrlFromClient) {
            throw new Error('Vui lòng gửi file ghi âm hoặc đường dẫn âm thanh để chấm điểm.');
        }
        if (!textToRead) {
            throw new Error('Thiếu nội dung câu đọc mẫu (textToRead).');
        }

        const targetWords = textToRead.trim().split(/\s+/);
        console.log('--- AUDIO EVALUATION REPORT (SERVICE) ---');
        console.log('Target Text:', textToRead);
        if (file) {
            console.log('Received File Size:', file.size, 'bytes');
        } else {
            console.log('Received Audio URL:', audioUrlFromClient);
        }

        const isMock = !process.env.ASSEMBLYAI_API_KEY || 
                       process.env.ASSEMBLYAI_API_KEY === 'your_assemblyai_key';

        console.log('Mode:', isMock ? 'MOCK' : 'PRODUCTION (AssemblyAI)');

        if (isMock) {
            console.log('⚠️ AssemblyAI is not configured. Simulating speech transcription & Levenshtein similarity...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (file && file.size < 2000) {
                console.log('Evaluation Result: 0 points (Mock: Audio size too small < 2KB)');
                return {
                    score: 0,
                    transcript: "",
                    wordsFeedback: targetWords.map(w => ({
                        word: w,
                        cleanWord: normalizeText(w),
                        confidence: 0,
                        correct: false
                    })),
                    reason: "No speech detected"
                };
            }

            const similarity = 0.95;
            const avgConfidence = 0.92;
            const finalScore = Math.round((similarity * 0.6 + avgConfidence * 0.4) * 100);

            console.log('Evaluation Result: MOCK SUCCESS (Score:', finalScore, ')');
            return {
                score: Math.min(100, Math.max(0, finalScore)),
                transcript: textToRead,
                wordsFeedback: targetWords.map(word => ({
                    word,
                    cleanWord: normalizeText(word),
                    confidence: 0.90 + Math.random() * 0.10,
                    correct: true
                }))
            };
        }

        const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });
        
        let transcript;
        try {
            let uploadUrl;
            if (audioUrlFromClient) {
                uploadUrl = audioUrlFromClient;
            } else {
                const uploadResponse = await client.files.upload(file.buffer);
                uploadUrl = uploadResponse.upload_url || uploadResponse;
            }

            const pollTranscript = async () => {
                let response = await client.transcripts.create({
                    audio_url: uploadUrl,
                    word_boost: targetWords,
                    boost_param: 'high'
                });
                const transcriptId = response.id;
                
                const startTime = Date.now();
                while (response.status === 'queued' || response.status === 'processing') {
                    if (Date.now() - startTime > 10000) {
                        console.warn('Background polling loop auto-terminated (10s safety limit reached)');
                        break;
                    }
                    await new Promise(resolve => setTimeout(resolve, 500));
                    response = await client.transcripts.get(transcriptId);
                }
                return response;
            };

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('AssemblyAI transcription timed out (8s limit reached)'));
                }, 8000);
            });

            transcript = await Promise.race([
                pollTranscript(),
                timeoutPromise
            ]);
        } catch (pollErr) {
            console.warn('AssemblyAI polling or timeout error:', pollErr.message);
            return {
                score: 0,
                transcript: "",
                wordsFeedback: targetWords.map(w => ({
                    word: w,
                    cleanWord: normalizeText(w),
                    confidence: 0,
                    correct: false
                })),
                reason: `AssemblyAI error or timeout: ${pollErr.message}`
            };
        }

        if (transcript.status === 'error') {
            console.warn('AssemblyAI transcription error:', transcript.error);
            return {
                score: 0,
                transcript: "",
                wordsFeedback: targetWords.map(w => ({
                    word: w,
                    cleanWord: normalizeText(w),
                    confidence: 0,
                    correct: false
                })),
                reason: `AssemblyAI error: ${transcript.error}`
            };
        }

        const recognizedText = transcript.text || '';
        const recognizedWords = transcript.words || [];

        console.log('AssemblyAI Recognized Text:', recognizedText);
        console.log('AssemblyAI Recognized Words Count:', recognizedWords.length);

        if (!recognizedText.trim() || recognizedWords.length === 0) {
            console.log('Evaluation Result: 0 points (No speech detected by AssemblyAI)');
            return {
                score: 0,
                transcript: "",
                wordsFeedback: targetWords.map(w => ({
                    word: w,
                    cleanWord: normalizeText(w),
                    confidence: 0,
                    correct: false
                })),
                reason: "No speech detected"
            };
        }

        const similarity = getStringSimilarity(textToRead, recognizedText);
        console.log('Similarity score (Levenshtein):', similarity.toFixed(4));

        if (similarity < 0.2) {
            console.log('Evaluation Result: 0 points (Completely mismatched, similarity < 0.2)');
            return {
                score: 0,
                transcript: recognizedText,
                wordsFeedback: targetWords.map(w => ({
                    word: w,
                    cleanWord: normalizeText(w),
                    confidence: 0,
                    correct: false
                })),
                reason: "Completely mismatched"
            };
        }

        let matchedCount = 0;
        let totalConfidence = 0;

        const wordsFeedback = targetWords.map(targetWord => {
            const cleanTarget = normalizeText(targetWord);
            
            const matchedWord = recognizedWords.find(recWord => {
                const cleanRec = normalizeText(recWord.text);
                return cleanRec === cleanTarget;
            });

            if (matchedWord) {
                matchedCount++;
                totalConfidence += matchedWord.confidence;
                return {
                    word: targetWord,
                    cleanWord: cleanTarget,
                    confidence: matchedWord.confidence,
                    correct: matchedWord.confidence >= 0.6
                };
            } else {
                return {
                    word: targetWord,
                    cleanWord: cleanTarget,
                    confidence: 0,
                    correct: false
                };
            }
        });

        const averageConfidence = matchedCount > 0 ? (totalConfidence / matchedCount) : 0;
        const finalScore = Math.round((similarity * 0.6 + averageConfidence * 0.4) * 100);

        console.log('Average Confidence:', averageConfidence.toFixed(4));
        console.log('Final Score:', finalScore);

        return {
            score: Math.max(0, Math.min(100, finalScore)),
            transcript: recognizedText,
            wordsFeedback
        };
    }
}

export default new AudioService();
