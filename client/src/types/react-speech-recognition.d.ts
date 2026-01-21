declare module 'react-speech-recognition' {
  export interface SpeechRecognitionOptions {
    continuous?: boolean;
    interimResults?: boolean;
    language?: string;
  }

  export interface SpeechRecognition {
    startListening(options?: SpeechRecognitionOptions): Promise<void>;
    stopListening(): Promise<void>;
    abortListening(): Promise<void>;
    browserSupportsSpeechRecognition(): boolean;
  }

  export function useSpeechRecognition(options?: {
    clearTranscriptOnListen?: boolean;
  }): {
    transcript: string;
    interimTranscript: string;
    finalTranscript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
  };

  const SpeechRecognition: SpeechRecognition;
  export default SpeechRecognition;
}
