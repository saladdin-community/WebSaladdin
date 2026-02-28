import { PlayCircle } from "lucide-react";
import Link from "next/link";

interface ContinueLearningCardProps {
  id: number;
  title: string;
  subtitle: string;
  instructor: string;
  thumbnail?: string;
  progress?: number;
  timeRemaining: string;
  href: string;
}

export default function ContinueLearningCard({
  title,
  subtitle,
  instructor,
  thumbnail,
  progress,
  timeRemaining,
  href,
}: ContinueLearningCardProps) {
  return (
    <div className="group relative bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500 shadow-2xl">
      <div className="flex flex-col lg:flex-row">
        {/* Thumbnail Section */}
        <div className="relative w-full lg:w-96 h-64 lg:h-auto overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#262626] to-[#121212] flex items-center justify-center">
              <PlayCircle className="h-16 w-16 text-[#d4af35]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <PlayCircle className="h-4 w-4 text-[#d4af35]" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              {timeRemaining} remaining
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#d4af35]">
              {subtitle}
            </span>
          </div>

          <h3 className="text-3xl font-black text-white mb-2 line-clamp-2 leading-tight">
            {title}
          </h3>
          <p className="text-[#737373] text-sm font-medium mb-8">
            By <span className="text-[#a3a3a3]">{instructor}</span>
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                <span className="text-[#737373]">Course Progress</span>
                <span className="text-[#d4af35]">{progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#262626] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d4af35] to-[#fde047] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(212,175,53,0.5)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href={href}
                className="px-8 py-3.5 bg-[#d4af35] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#fde047] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#d4af35]/20 hover:scale-105"
              >
                <PlayCircle className="h-4 w-4" />
                Resume Learning
              </Link>
              <Link
                href={`${href}/details`}
                className="px-8 py-3.5 bg-[#262626] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#333333] transition-all duration-300 border border-white/5"
              >
                Course Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
