import { Worker } from 'bullmq';
import { connection } from '../lib/queue.js';
import AudioService from '../services/AudioService.js';
import { getIO } from '../utils/socketIO.js';

export const startSpeechEvaluationWorker = () => {
  const worker = new Worker(
    'speech-evaluation',
    async (job) => {
      const { textToRead, audioUrl, socketId } = job.data;
      console.log(`[Worker] processing job ${job.id} for socket ${socketId}`);

      try {
        // Call AssemblyAI & Levenshtein score service
        const result = await AudioService.evaluateSpeech(textToRead, null, audioUrl);

        // Retrieve Socket.io instance and emit success
        const io = getIO();
        if (io) {
          console.log(`[Worker] Job ${job.id} success, sending score to client`);
          io.to(socketId).emit('speech_evaluated', {
            jobId: job.id,
            status: 'success',
            result,
          });
        } else {
          console.warn('[Worker] Socket.io instance not ready, cannot send result to client');
        }
        return result;
      } catch (err) {
        console.error(`[Worker] Job ${job.id} failed:`, err);
        const io = getIO();
        if (io) {
          io.to(socketId).emit('speech_evaluated', {
            jobId: job.id,
            status: 'error',
            error: err.message || 'Lỗi chấm điểm giọng nói từ AI',
          });
        }
        throw err;
      }
    },
    { connection }
  );

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed with error:`, err);
  });

  console.log('🤖 Speech Evaluation Worker initialized and listening to queue...');
  return worker;
};
