"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  Minimize,
  Download,
  Share2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface VideoPlayerProps {
  src?: string;
  title: string;
  duration?: string;
  currentTime?: string;
  onPlayPause?: (isPlaying: boolean) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onProgressChange?: (progress: number) => void;
  onVolumeChange?: (volume: number) => void;
  onDownload?: () => void;
  onShare?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  canSkip?: boolean;
  maxPlaybackRate?: number;
}

export default function VideoPlayer({
  src = "",
  title,
  duration = "22:45",
  currentTime = "0:00",
  onPlayPause,
  onFullscreenChange,
  onProgressChange,
  onVolumeChange,
  onDownload,
  onShare,
  onNext,
  onPrevious,
  canSkip = false,
  maxPlaybackRate = 2,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize video element
  useEffect(() => {
    if (videoRef.current) {
      // Set max playback rate
      videoRef.current.playbackRate = playbackRate;

      // Handle time update for progress
      videoRef.current.ontimeupdate = () => {
        if (videoRef.current) {
          const current = videoRef.current.currentTime;
          const duration = videoRef.current.duration;
          const progressPercent = (current / duration) * 100;
          setProgress(progressPercent);
        }
      };

      // Handle fullscreen change
      document.onfullscreenchange = () => {
        const fullscreen = !!document.fullscreenElement;
        setIsFullscreen(fullscreen);
        onFullscreenChange?.(fullscreen);
      };
    }

    return () => {
      document.onfullscreenchange = null;
    };
  }, [onFullscreenChange, playbackRate]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      onPlayPause?.(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    onVolumeChange?.(newVolume);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value);

    if (canSkip) {
      setProgress(newProgress);
      if (videoRef.current) {
        videoRef.current.currentTime =
          (newProgress / 100) * videoRef.current.duration;
      }
      onProgressChange?.(newProgress);
    } else {
      // Prevent skipping forward - only allow going back
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const newTime = (newProgress / 100) * videoRef.current.duration;

        if (newTime < currentTime) {
          // Allow going back
          setProgress(newProgress);
          videoRef.current.currentTime = newTime;
          onProgressChange?.(newProgress);
        } else {
          // Revert to current progress if trying to skip forward
          const currentProgress =
            (currentTime / videoRef.current.duration) * 100;
          setProgress(currentProgress);
        }
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
      onFullscreenChange?.(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      onFullscreenChange?.(false);
    }
  };

  const handlePlaybackRate = () => {
    if (videoRef.current) {
      let newRate = playbackRate + 0.5;
      if (newRate > maxPlaybackRate) {
        newRate = 1;
      }
      setPlaybackRate(newRate);
      videoRef.current.playbackRate = newRate;
    }
  };

  const handleSeekBackward = () => {
    if (videoRef.current) {
      const newTime = Math.max(0, videoRef.current.currentTime - 10); // 10 seconds back
      videoRef.current.currentTime = newTime;
    }
  };

  const handleSeekForward = () => {
    if (videoRef.current && canSkip) {
      const newTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10,
      ); // 10 seconds forward
      videoRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)]">
      <div className="relative aspect-video">
        {/* Video Element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          onClick={handlePlayPause}
        />

        {/* Video Placeholder (if no video src) */}
        {!src && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#121212] flex items-center justify-center">
            <div className="text-center">
              <button
                onClick={handlePlayPause}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-gold flex items-center justify-center hover:shadow-glow transition-all duration-300"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-black" />
                ) : (
                  <Play className="h-8 w-8 text-black ml-1" />
                )}
              </button>
              <p className="text-[#737373]">Click play to start the video</p>
            </div>
          </div>
        )}

        {/* Custom Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-1.5 bg-[#404040] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-gold"
            />
            <div className="flex justify-between text-sm text-[#a3a3a3] mt-1.5">
              <span>{currentTime}</span>
              <span>{duration}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-white" />
                ) : (
                  <Play className="h-6 w-6 text-white" />
                )}
              </button>

              {/* Previous/Next (only if canSkip) */}
              {canSkip && (
                <>
                  <button
                    onClick={onPrevious || handleSeekBackward}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={onNext || handleSeekForward}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </>
              )}

              {/* Volume */}
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-[#d4d4d4]" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1.5 bg-[#404040] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-gold"
                />
              </div>

              {/* Playback Rate */}
              <button
                onClick={handlePlaybackRate}
                className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-md transition-colors duration-300"
              >
                {playbackRate}x
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Download */}
              <button
                onClick={onDownload}
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300 text-[#d4d4d4]"
              >
                <Download className="h-5 w-5" />
              </button>

              {/* Share */}
              <button
                onClick={onShare}
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300 text-[#d4d4d4]"
              >
                <Share2 className="h-5 w-5" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300 text-[#d4d4d4]"
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Video Title Overlay */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 max-w-md">
            <h3 className="text-white font-semibold text-sm truncate">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
