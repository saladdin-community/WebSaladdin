import { Bookmark } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  id: number;
  title: string;
  slug?: string;
  thumbnail: string;
  instructor: string;
  price: number;
  price_formatted: string;
  description?: string;
  level?: string;
  category?: string;
  isFree?: boolean;
  progress?: number;
  isBookmarked?: boolean;
  duration?: string;
  rating?: number;
  students?: number;
  variant?: "default" | "compact" | "featured";
  onBookmarkToggle?: (id: number) => void;
  href?: string;
}

export default function CourseCard({
  id,
  title,
  slug,
  thumbnail,
  instructor,
  price,
  price_formatted,
  description,
  level = "All Levels",
  isFree = false,
  progress,
  isBookmarked = false,
  variant = "default",
  onBookmarkToggle,
  href = `/courses/${slug || id}`,
}: CourseCardProps) {
  const Content = () => (
    <div className="card card-hover group cursor-pointer flex flex-col h-full overflow-hidden">
      {/* Course Thumbnail */}
      <div className="relative w-full aspect-[16/9] overflow-hidden shrink-0">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = "/images/default-course.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute top-3 right-3">
          <button
            className="p-2 bg-black/50 rounded-full hover:bg-[rgba(212,175,53,0.2)] transition-colors duration-300"
            onClick={(e) => {
              e.preventDefault();
              onBookmarkToggle?.(id);
            }}
          >
            <Bookmark
              className={`h-4 w-4 ${
                isBookmarked ? "fill-[#d4af35] text-[#d4af35]" : "text-white"
              }`}
            />
          </button>
        </div>
        {/* Progress Bar (if applicable and strictly in Bottom of Image) */}
        {progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-medium text-white/90 uppercase tracking-wider">
                Progress
              </span>
              <span className="text-[10px] font-bold text-gradient-gold">
                {progress}%
              </span>
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#d4af35] to-[#fde047] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Course Content - Flex Grow pushes footer down */}
      <div className="flex flex-col flex-grow p-5 pb-6">
        <div className="mb-3">
          <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-md bg-[rgba(212,175,53,0.1)] text-[#d4af35] border border-[rgba(212,175,53,0.2)] mb-2.5">
            {level}
          </span>
          <h3 className="text-[1.125rem] leading-snug font-bold text-white group-hover:text-[#d4af35] transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
        </div>

        {description && (
          <p className="text-[#a3a3a3] text-sm line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>
        )}

        {/* Footer - Pushed to bottom */}
        <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-end justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide text-[#737373] font-medium">
              Instructor
            </span>
            <span className="text-sm text-[#d4d4d4] line-clamp-1">
              {instructor}
            </span>
          </div>

          <div className="shrink-0 text-right">
            {isFree ? (
              <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#22c55e]/10 text-[#22c55e] rounded-lg text-sm font-bold border border-[#22c55e]/20">
                Free
              </span>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-[11px] uppercase tracking-wide text-[#737373] font-medium mb-0.5">
                  Price
                </span>
                <span className="text-lg font-bold text-gradient-gold leading-none">
                  {price_formatted}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <Content />
      </Link>
    );
  }

  return <Content />;
}
