"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  Minimize,
  SkipBack,
  ChevronRight,
} from "lucide-react";
import YouTube, { YouTubeProps } from "react-youtube";

interface PrivateYouTubePlayerProps {
  youtubeUrl?: string;
  videoId?: string;
  title: string;
  onPlayPause?: (isPlaying: boolean) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onProgressChange?: (progress: number) => void;
  onVolumeChange?: (volume: number) => void;
  maxPlaybackRate?: number;
  showControls?: boolean;
  startTime?: number;
}

export default function PrivateYouTubePlayer({
  youtubeUrl,
  videoId: propVideoId,
  title,
  onPlayPause,
  onFullscreenChange,
  onProgressChange,
  onVolumeChange,
  maxPlaybackRate = 2,
  showControls = true,
  startTime = 0,
}: PrivateYouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [player, setPlayer] = useState<any>(null);
  const [videoId, setVideoId] = useState<string | undefined>(propVideoId);
  const [isRestricted, setIsRestricted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract video ID
  useEffect(() => {
    if (youtubeUrl && !propVideoId) {
      const extractedId = extractYouTubeId(youtubeUrl);
      setVideoId(extractedId);
    }
  }, [youtubeUrl, propVideoId]);

  const extractYouTubeId = (url: string): string | undefined => {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match?.[1];
  };

  // YouTube Player Options - HIDING all default controls
  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0, // No default controls
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      disablekb: 1, // Disable keyboard controls
      fs: 0, // Disable fullscreen button
      start: Math.floor(startTime),
      playsinline: 1, // Play inline on iOS
      enablejsapi: 1,
      origin: typeof window !== "undefined" ? window.location.origin : "",
    },
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    const player = event.target;
    setPlayer(player);

    // Get duration
    const dur = player.getDuration();
    setDuration(dur);

    // Set initial volume and playback rate
    player.setVolume(volume);
    player.setPlaybackRate(playbackRate);

    // Disable right-click on video (SAFER METHOD)
    try {
      const iframe = player.getIframe();
      if (iframe) {
        iframe.addEventListener("contextmenu", (e: Event) =>
          e.preventDefault(),
        );
      }
    } catch (err) {
      console.warn("Could not attach contextmenu listener to iframe", err);
    }

    return () => {};
  };

  // Timer logic to fix duration bug
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && player) {
      interval = setInterval(() => {
        try {
          const current = player.getCurrentTime();
          setCurrentTime(current);

          const dur = player.getDuration();
          if (dur > 0) {
            setDuration(dur);
            const progressPercent = (current / dur) * 100;
            setProgress(progressPercent);
            onProgressChange?.(progressPercent);
          }
        } catch (error) {
          console.error("Error updating time:", error);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, player, onProgressChange]);

  const onPlayerStateChange: YouTubeProps["onStateChange"] = (event) => {
    const playerState = event.data;

    // 0 = ENDED, 1 = PLAYING, 2 = PAUSED
    if (playerState === 0) {
      setIsEnded(true);
      setIsPlaying(false);
      onPlayPause?.(false);
    } else if (playerState === 1) {
      setIsEnded(false);
      setIsPlaying(true);
      onPlayPause?.(true);
    } else if (playerState === 2) {
      setIsPlaying(false);
      onPlayPause?.(false);
    }
  };

  const onPlayerError: YouTubeProps["onError"] = (event) => {
    console.error("YouTube Player Error:", event.data);
    if (event.data === 150 || event.data === 101 || event.data === 100) {
      setIsRestricted(true);
    }
  };

  // Control functions
  const handlePlayPause = () => {
    if (player) {
      try {
        if (isPlaying) {
          player.pauseVideo();
        } else {
          if (isEnded) {
            player.seekTo(0);
            setIsEnded(false);
          }
          player.playVideo();
        }
        setIsPlaying(!isPlaying);
        onPlayPause?.(!isPlaying);
      } catch (error) {
        console.error("Error controlling video:", error);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
    }
    onVolumeChange?.(newVolume / 100);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value);

    if (player && duration) {
      const newTime = (newProgress / 100) * duration;

      // ONLY ALLOW GOING BACKWARD, NOT FORWARD
      if (newTime > currentTime) {
        // If trying to skip forward, revert to current time
        const currentProgress = (currentTime / duration) * 100;
        setProgress(currentProgress);
        return;
      }

      // Allow going backward
      setProgress(newProgress);
      player.seekTo(newTime, true);
      onProgressChange?.(newProgress);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
      onFullscreenChange?.(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      onFullscreenChange?.(false);
    }
  };

  const handlePlaybackRate = () => {
    if (player) {
      let newRate = playbackRate + 0.5;
      if (newRate > maxPlaybackRate) {
        newRate = 0.5; // Cycle back to 0.5x
      }
      setPlaybackRate(newRate);
      player.setPlaybackRate(newRate);
    }
  };

  const handleSeekBackward = () => {
    if (player) {
      const newTime = Math.max(0, currentTime - 10);
      player.seekTo(newTime, true);
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // If video is restricted
  if (isRestricted) {
    return (
      <div className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)]">
        <div className="relative aspect-video">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#121212] flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg
                  className="h-10 w-10 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Video Restricted
              </h3>
              <p className="text-[#d4d4d4] mb-4">
                This video is only available through authorized access on this
                website.
              </p>
              <p className="text-sm text-[#737373]">
                Please contact the course administrator if you believe this is
                an error.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no video ID
  if (!videoId) {
    return (
      <div className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)]">
        <div className="relative aspect-video">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#121212] flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                <Play className="h-10 w-10 text-gray-600 ml-1" />
              </div>
              <p className="text-[#737373]">
                Video content will be available soon
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] relative group"
    >
      <div className="relative aspect-video">
        {/* YouTube Player */}
        <div className="absolute inset-0">
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            onError={onPlayerError}
            className="h-full w-full"
            iframeClassName="absolute inset-0 w-full h-full"
          />
        </div>

        {/* SIMPLIFIED Custom Controls - Only essential controls */}
        {showControls && (
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
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Essential Control Buttons Only */}
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

                {/* Rewind 10s */}
                <button
                  onClick={handleSeekBackward}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
                  title="Rewind 10 seconds"
                >
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
                    />
                  </svg>
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-[#d4d4d4]" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1.5 bg-[#404040] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-gold"
                  />
                </div>

                {/* Playback Speed */}
                <button
                  onClick={handlePlaybackRate}
                  className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-md transition-colors duration-300"
                  title={`Speed: ${playbackRate}x`}
                >
                  {playbackRate}x
                </button>
              </div>

              {/* Fullscreen Only */}
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
        )}

        {/* Title Overlay - Minimal */}
        <div className="absolute top-4 left-4 max-w-md">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
            <h3 className="text-white font-semibold text-sm truncate">
              {title}
            </h3>
          </div>
        </div>

        {/* Big Play Button Overlay */}
        {!isPlaying && (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-24 h-24 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all duration-300 group-hover:scale-110">
              <Play className="h-12 w-12 text-white ml-2" />
            </div>
          </button>
        )}
      </div>

      {/* Loading Indicator */}
      {!player && (
        <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-[#d4af35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#d4d4d4]">Loading video...</p>
          </div>
        </div>
      )}

      {/* Custom End Screen Overlay */}
      {isEnded && (
        <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <h3 className="text-xl font-bold text-white mb-2">
            Lesson Completed!
          </h3>
          <p className="text-[#a3a3a3] mb-8 max-w-md">
            You have finished "{title}".
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => {
                if (player) {
                  player.seekTo(0);
                  player.playVideo();
                  setIsEnded(false);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 font-medium"
            >
              <SkipBack className="h-5 w-5" />
              Replay Lesson
            </button>
            {/* Private player usually has no next button props, but we keep the structure consistent if needed */}
          </div>
        </div>
      )}
    </div>
  );
}
