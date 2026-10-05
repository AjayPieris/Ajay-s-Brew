import { useState, useEffect, useRef } from 'react';
import loadingVideo from '../assets/Loading.mp4';

export function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [videoFinished, setVideoFinished] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hide body scrollbar while splash screen is active
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Ensure we also clean up if the component unmounts unexpectedly
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  // Fallback in case video completely fails to play
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (!videoFinished && progress === 0) setVideoFinished(true);
    }, 8000);
    return () => clearTimeout(fallbackTimeout);
  }, [videoFinished, progress]);

  // Fade out logic when video completes
  useEffect(() => {
    if (videoFinished) {
      const timeout1 = setTimeout(() => setIsFadingOut(true), 200);
      const timeout2 = setTimeout(() => setIsVisible(false), 1200); // 1000ms transition
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [videoFinished]);

  // Sync progress with actual video playback
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      // Calculate percentage, capping at 100
      const calcProgress = Math.min((current / total) * 100, 100);
      setProgress(calcProgress);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out bg-white ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* 
        Video wrapper - Made full screen (100vw/100vh)
        so it scales to be as absolutely large as possible without cropping.
      */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          src={loadingVideo}
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setProgress(100);
            setVideoFinished(true);
          }}
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Subtle gradient at the bottom to ensure text readability */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />

      {/* Redesigned Loading Style - Sleek Bottom Bar Overlay */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center w-full px-8 md:px-24 drop-shadow-md">
        
        {/* Loading text with percentage */}
        <div className="flex justify-between items-end w-full max-w-2xl mb-4">
          <span className="text-black font-sans font-medium text-[10px] md:text-xs tracking-[0.4em] uppercase">
            Initializing
          </span>
          <span className="text-black font-mono font-medium text-sm md:text-base tracking-widest tabular-nums">
            {Math.floor(progress).toString().padStart(3, '0')}%
          </span>
        </div>

        {/* Ultra-thin loading line that fills up */}
        <div className="w-full max-w-2xl h-[2px] bg-black/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black transition-all duration-150 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
