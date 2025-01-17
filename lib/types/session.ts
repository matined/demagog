interface SessionData {
  isRecording: boolean;
  config: SessionConfig;
}

interface SessionConfig {
  context: string;
  language: string;
  speakerCount: number;
  chunkSize: number;
  sensitivity: number;
}

interface Segment {
  start: number;
  end: number;
  text: string;
}

export type { SessionData, Segment, SessionConfig };
