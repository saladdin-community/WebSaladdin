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
    <div className="bg-[#1f1f1f] rounded-xl p-6 border border-[rgba(255,255,255,0.1)] hover:border-[rgba(212,175,53,0.3)] transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Thumbnail */}
        <div className="relative md:w-64 md:flex-shrink-0">
          <div className="aspect-video rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <PlayCircle className="h-12 w-12 text-[#d4af35]" />
              </div>
            )}
            {progress !== undefined && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div className="h-2 bg-[#404040] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#d4af35] to-[#fde047] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#262626] text-[#d4d4d4] font-medium">
              Continue Learning
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
          <p className="text-[#d4af35] mb-2">{subtitle}</p>
          <p className="text-[#737373] mb-4">By {instructor}</p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
            <div className="text-sm text-[#a3a3a3]">
              <span className="font-semibold text-white">{timeRemaining}</span>{" "}
              remaining
            </div>

            <div className="flex gap-3">
              <Link
                href={href}
                className="px-6 py-2.5 bg-gradient-gold text-black font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <PlayCircle className="h-5 w-5" />
                Resume Learning
              </Link>
              <Link
                href={`${href}/details`}
                className="px-6 py-2.5 bg-[#262626] text-white font-semibold rounded-lg hover:bg-[#2d2d2d] transition-colors"
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
