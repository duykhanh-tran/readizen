import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const connection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  maxRetriesPerRequest: null, // REQUIRED for BullMQ
});

connection.on('connect', () => {
  console.log('✅ Connected to Redis successfully');
});

connection.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

export const speechEvaluationQueue = new Queue('speech-evaluation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export { connection };
