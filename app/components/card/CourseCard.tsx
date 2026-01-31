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
    <div className="card card-hover group cursor-pointer h-full">
      {/* Course Thumbnail */}
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = "/images/default-course.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute top-4 right-4">
          <button
            className="p-2 bg-black/50 rounded-full hover:bg-[rgba(212,175,53,0.2)] transition-colors duration-300"
            onClick={(e) => {
              e.preventDefault();
              onBookmarkToggle?.(id);
            }}
          >
            <Bookmark
              className={`h-5 w-5 ${
                isBookmarked ? "fill-[#d4af35] text-[#d4af35]" : "text-white"
              }`}
            />
          </button>
        </div>
        {progress && progress > 0 && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="h-1.5 bg-[#404040] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#d4af35] to-[#fde047] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1.5 text-[#d4d4d4]">
              {progress}% Complete
            </p>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3 min-h-28 max-h-28">
          <div>
            <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#262626] text-[#d4d4d4] mb-2 font-medium">
              {level}
            </span>
            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#d4af35] transition-colors duration-300 line-clamp-2">
              {title}
            </h3>
          </div>
        </div>

        <p className="text-[#a3a3a3] mb-4 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.1)]">
          <div className="text-sm text-[#737373]">By {instructor}</div>
          {isFree ? (
            <span className="px-3 py-1 bg-[rgba(34,197,94,0.2)] text-[#22c55e] rounded-full text-sm font-semibold border border-[rgba(34,197,94,0.3)]">
              FREE
            </span>
          ) : (
            <div className="text-right">
              <div className="text-2xl font-bold text-gradient-gold">
                {price_formatted}
              </div>
            </div>
          )}
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
