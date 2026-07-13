import { useState, useRef, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/axios.js';
import { uploadDirectToCloudinary } from '../utils/cloudinaryUpload.js';

// Global reference to handle overlap across hook instances
if (typeof window !== 'undefined') {
  window.playingAudioInstance = null;
}

export default function useAudioRecorder() {
  const [recordingIndex, setRecordingIndex] = useState(null);
  const [evaluatingIndex, setEvaluatingIndex] = useState(null);
  const [evaluationStep, setEvaluationStep] = useState(null); // 'compressing' | 'uploading' | 'analyzing'
  const [detailedFeedback, setDetailedFeedback] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimeoutRef = useRef(null);
  const onAutoStopRef = useRef(null);
  const mimeTypeRef = useRef('audio/webm');

  // Warm up Web Speech Synthesis voices to prevent delayed first play
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Robust cleanup to prevent hardware/memory leaks on unmount
  useEffect(() => {
    return () => {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
      if (mediaRecorderRef.current) {
        const stream = mediaRecorderRef.current.stream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, []);

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
      toast.error('Không thể phát âm thanh mẫu. Vui lòng thử lại.');
    });
  }, [stopAllMedia]);

  // Utility to synthesize text-to-speech natively without serverside storage
  const playSpeechText = useCallback((text) => {
    stopAllMedia();
    if (!text) return;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // kid-friendly rate

      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = voices.find(v => /Google US English/i.test(v.name));
        if (!selectedVoice) {
          selectedVoice = voices.find(v => /en-US/i.test(v.lang) || /en_US/i.test(v.lang));
        }
        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.startsWith('en'));
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
        } else {
          utterance.lang = 'en-US';
        }
        window.speechSynthesis.speak(utterance);
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setVoiceAndSpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          setVoiceAndSpeak();
          window.speechSynthesis.onvoiceschanged = null;
        };
      }
    } else {
      toast.error('Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản (TTS).');
    }
  }, [stopAllMedia]);

  const startRecording = useCallback(async (index = 0, onAutoStop = null) => {
    setError(null);
    stopAllMedia(); // Prevent overlap

    if (recordingIndex !== null || evaluatingIndex !== null) return; // Debounce / Avoid parallel recording

    onAutoStopRef.current = onAutoStop;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: { ideal: 1 },
          sampleRate: { ideal: 16000 },
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      let selectedMimeType = 'audio/webm';
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        selectedMimeType = 'audio/webm;codecs=opus';
        options = { mimeType: selectedMimeType, audioBitsPerSecond: 16000 };
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        selectedMimeType = 'audio/mp4';
        options = { mimeType: selectedMimeType, audioBitsPerSecond: 16000 };
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        selectedMimeType = 'audio/webm';
        options = { mimeType: selectedMimeType, audioBitsPerSecond: 16000 };
      }

      mimeTypeRef.current = selectedMimeType;
      const mediaRecorder = new MediaRecorder(stream, options);
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
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        toast.error('Vui lòng cấp quyền Micro trên thanh địa chỉ trình duyệt để bé bắt đầu đọc nhé!');
      } else {
        toast.error('Không thể truy cập Microphone. Vui lòng cài đặt và thử lại.');
      }
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
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current });
          
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
    setEvaluationStep('compressing');
    setError(null);

    try {
      // Simulate client side compression stage
      await new Promise(resolve => setTimeout(resolve, 600));
      setEvaluationStep('uploading');

      // Upload directly to Cloudinary
      const audioUrl = await uploadDirectToCloudinary(audioBlob, 'speech');

      setEvaluationStep('analyzing');

      const response = await api.post('/lessons/evaluate-audio', {
        audioUrl,
        textToRead
      });

      const data = response.data; // expects { score, transcript, wordsFeedback }
      
      setDetailedFeedback(data);
      toast.success('Chấm điểm phát âm thành công!');
      return data;
    } catch (err) {
      console.error('AI Speech Evaluation Error:', err);
      setError('SpeechEvaluationFailed');
      toast.error('Lỗi chấm điểm phát âm. Vui lòng kiểm tra kết nối mạng và thử lại.');
      throw err;
    } finally {
      setEvaluatingIndex(null);
      setEvaluationStep(null);
    }
  }, []);

  const clearFeedback = useCallback(() => {
    setDetailedFeedback(null);
  }, []);

  return {
    recordingIndex,
    evaluatingIndex,
    evaluationStep,
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
