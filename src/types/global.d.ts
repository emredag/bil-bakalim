// Global type definitions for the application

// Browser API extensions
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// Framer Motion variant types
export type AnimationVariant = {
  [key: string]: {
    opacity?: number;
    scale?: number;
    x?: number;
    y?: number;
    rotate?: number;
    transition?: {
      duration?: number;
      delay?: number;
      ease?: string | number[];
      type?: string;
      stiffness?: number;
      damping?: number;
    };
  };
};

// Form event types
export type FormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;

// Error types
export interface AppError {
  message: string;
  code?: string;
  stack?: string;
}
