import { useState, useRef, useCallback } from 'react';
import api from '../services/axios.js';

// Global reference to handle overlap across hook instances
if (typeof window !== 'undefined') {
  window.playingAudioInstance = null;
}

export default function useAudioRecorder() {
  const [recordingIndex, setRecordingIndex] = useState(null);
  const [evaluatingIndex, setEvaluatingIndex] = useState(null);
  const [detailedFeedback, setDetailedFeedback] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimeoutRef = useRef(null);
  const onAutoStopRef = useRef(null);

  // Stops any playing HTML5 Audio and Web SpeechSynthesis to prevent overlap
  const stopAllMedia = useCallback(() => {
    if (typeof window !== 'undefined') {
      if (window.playingAudioInstance) {
        try {
          window.playingAudioInstance.pause();
          window.playingAudioInstance = null;
        } catch (e) {
          console.error('Error stopping playing audio:', e);
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, []);

  // Utility to play native audio file with conflict prevention
  const playSampleAudio = useCallback((audioUrl) => {
    stopAllMedia();
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    window.playingAudioInstance = audio;
    
    audio.play().catch(err => {
      console.error('Audio play failed:', err);
    });
  }, [stopAllMedia]);

  // Utility to synthesize text-to-speech natively without serverside storage
  const playSpeechText = useCallback((text) => {
    stopAllMedia();
    if (!text) return;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85; // kid-friendly rate
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Web SpeechSynthesis not supported in this browser.');
    }
  }, [stopAllMedia]);

  const startRecording = useCallback(async (index = 0, onAutoStop = null) => {
    setError(null);
    stopAllMedia(); // Prevent overlap

    if (recordingIndex !== null || evaluatingIndex !== null) return; // Debounce / Avoid parallel recording

    onAutoStopRef.current = onAutoStop;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setRecordingIndex(index);

      // Auto stop after 10 seconds
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      recordingTimeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          console.log('Limit of 10s reached. Automatically stopping...');
          if (onAutoStopRef.current) {
            onAutoStopRef.current();
          }
        }
      }, 10000);

    } catch (err) {
      console.error('Microphone access error:', err);
      setError('MicrophonePermissionDenied');
      alert('Không thể truy cập Microphone. Vui lòng cấp quyền trong cài đặt trình duyệt.');
    }
  }, [recordingIndex, evaluatingIndex, stopAllMedia]);

  const stopRecording = useCallback(() => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Clean up stream tracks
          if (mediaRecorder.stream) {
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
          }
          
          setRecordingIndex(null);
          resolve(audioBlob);
        };
        mediaRecorder.stop();
      } else {
        resolve(null);
      }
    });
  }, []);

  const evaluateAudio = useCallback(async (textToRead, audioBlob, index = 0) => {
    if (!audioBlob) return null;
    
    setEvaluatingIndex(index);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, `recording_${index}.webm`);
      formData.append('textToRead', textToRead);

      const response = await api.post('/lessons/evaluate-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = response.data; // expects { score, transcript, wordsFeedback }
      setDetailedFeedback(data);
      setEvaluatingIndex(null);
      return data;
    } catch (err) {
      console.error('AI Speech Evaluation Error:', err);
      setError('SpeechEvaluationFailed');
      setEvaluatingIndex(null);
      alert('Lỗi chấm điểm phát âm. Vui lòng thử lại.');
      throw err;
    }
  }, []);

  const clearFeedback = useCallback(() => {
    setDetailedFeedback(null);
  }, []);

  return {
    recordingIndex,
    evaluatingIndex,
    detailedFeedback,
    error,
    startRecording,
    stopRecording,
    evaluateAudio,
    playSampleAudio,
    playSpeechText,
    clearFeedback,
    isRecording: recordingIndex !== null,
    isEvaluating: evaluatingIndex !== null
  };
}
