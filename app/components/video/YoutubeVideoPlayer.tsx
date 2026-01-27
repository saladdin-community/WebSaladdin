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
  Settings,
  SkipBack,
  SkipForward,
} from "lucide-react";
import YouTube, { YouTubeProps, YouTubePlayer } from "react-youtube";

interface YouTubeVideoPlayerProps {
  videoId?: string; // YouTube video ID (from URL)
  youtubeUrl?: string; // Full YouTube URL
  title: string;
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
  startTime?: number; // Start time in seconds
  endTime?: number; // End time in seconds
  showControls?: boolean;
  autoplay?: boolean;
}

export default function YouTubeVideoPlayer({
  videoId: propVideoId,
  youtubeUrl,
  title,
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
  startTime = 0,
  endTime,
  showControls = true,
  autoplay = false,
}: YouTubeVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [videoId, setVideoId] = useState<string | undefined>(propVideoId);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract video ID from YouTube URL if provided
  useEffect(() => {
    if (youtubeUrl && !propVideoId) {
      const extractedId = extractYouTubeId(youtubeUrl);
      setVideoId(extractedId);
    }
  }, [youtubeUrl, propVideoId]);

  const extractYouTubeId = (url: string): string | undefined => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/user\/\S+\/videos\/\S+\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        return match[1];
      }
    }
    return undefined;
  };

  // YouTube Player Options
  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: autoplay ? 1 : 0,
      controls: 0, // Hide default controls
      rel: 0, // Don't show related videos
      showinfo: 0,
      modestbranding: 1,
      start: Math.floor(startTime),
      end: endTime ? Math.floor(endTime) : undefined,
      iv_load_policy: 3, // Hide annotations
    },
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    const player = event.target;
    setPlayer(player);
    setIsReady(true);

    // Get initial duration
    const dur = player.getDuration();
    setDuration(dur);

    // Set initial volume
    player.setVolume(volume);

    // Set playback rate
    player.setPlaybackRate(playbackRate);

    // Start progress tracking
    setInterval(() => {
      if (player && player.getCurrentTime) {
        const current = player.getCurrentTime();
        setCurrentTime(current);

        const progressPercent = (current / dur) * 100;
        setProgress(progressPercent);
        onProgressChange?.(progressPercent);

        // Check if reached end time
        if (endTime && current >= endTime) {
          player.pauseVideo();
          setIsPlaying(false);
          onPlayPause?.(false);
        }
      }
    }, 1000);
  };

  const onPlayerStateChange: YouTubeProps["onStateChange"] = (event) => {
    const playerState = event.data;

    switch (playerState) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        onPlayPause?.(true);
        break;
      case window.YT.PlayerState.PAUSED:
      case window.YT.PlayerState.ENDED:
        setIsPlaying(false);
        onPlayPause?.(false);
        break;
    }
  };

  // Control functions
  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
      onPlayPause?.(!isPlaying);
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

      if (!canSkip && newTime > currentTime) {
        // Prevent skipping forward if not allowed
        return;
      }

      setProgress(newProgress);
      player.seekTo(newTime, true);
      onProgressChange?.(newProgress);

      if (!isPlaying) {
        player.playVideo();
        setIsPlaying(true);
        onPlayPause?.(true);

        // Pause after 100ms to show frame
        setTimeout(() => {
          player.pauseVideo();
          setIsPlaying(false);
          onPlayPause?.(false);
        }, 100);
      }
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
        newRate = 0.5; // Start from 0.5x
      }
      if (newRate > maxPlaybackRate) {
        newRate = 1;
      }
      setPlaybackRate(newRate);
      player.setPlaybackRate(newRate);
    }
  };

  const handleSeek = (seconds: number) => {
    if (player && duration) {
      const newTime = Math.max(0, Math.min(currentTime + seconds, duration));

      if (!canSkip && seconds > 0) {
        // Prevent seeking forward if not allowed
        return;
      }

      player.seekTo(newTime, true);
      setCurrentTime(newTime);

      if (!isPlaying) {
        player.playVideo();
        setTimeout(() => player.pauseVideo(), 100);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // If no video ID, show placeholder
  if (!videoId) {
    return (
      <div className="bg-[#0a0a0a] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)]">
        <div className="relative aspect-video">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#121212] flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                <Settings className="h-10 w-10 text-gray-600" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                Video Not Available
              </h3>
              <p className="text-[#737373] max-w-md">
                The video content is currently being prepared. Please check back
                later.
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
            className="h-full w-full"
            iframeClassName="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Custom Controls Overlay */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

                {/* Seek Backward (always allowed) */}
                <button
                  onClick={() => handleSeek(-10)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
                  title="Rewind 10 seconds"
                >
                  <SkipBack className="h-6 w-6 text-white" />
                </button>

                {/* Seek Forward (only if canSkip) */}
                {canSkip && (
                  <button
                    onClick={() => handleSeek(10)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
                    title="Forward 10 seconds"
                  >
                    <SkipForward className="h-6 w-6 text-white" />
                  </button>
                )}

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

                {/* Playback Rate */}
                <button
                  onClick={handlePlaybackRate}
                  className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-md transition-colors duration-300"
                  title={`Playback speed: ${playbackRate}x`}
                >
                  {playbackRate}x
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* Previous Lesson */}
                {onPrevious && (
                  <button
                    onClick={onPrevious}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-md transition-colors duration-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </button>
                )}

                {/* Next Lesson */}
                {onNext && (
                  <button
                    onClick={onNext}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-md transition-colors duration-300"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}

                {/* Download */}
                {onDownload && (
                  <button
                    onClick={onDownload}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300 text-[#d4d4d4]"
                    title="Download resources"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                )}

                {/* Share */}
                {onShare && (
                  <button
                    onClick={onShare}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300 text-[#d4d4d4]"
                    title="Share lesson"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                )}

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300 text-[#d4d4d4]"
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
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
        )}

        {/* Title Overlay */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 max-w-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-white font-semibold text-sm truncate">
              {title}
            </h3>
            {!isReady && (
              <p className="text-xs text-[#737373] mt-1">
                Loading YouTube player...
              </p>
            )}
          </div>
        </div>

        {/* Play/Pause Center Button */}
        {!isPlaying && (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all duration-300">
              <Play className="h-10 w-10 text-white ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Loading State */}
      {!isReady && (
        <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-[#d4af35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#d4d4d4]">Loading YouTube video...</p>
          </div>
        </div>
      )}
    </div>
  );
}
