import { Bookmark } from "lucide-react";
import { articles } from "../../data/articles.js";
import { getReadTime } from "../../utils/articleMeta.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

/** Simple Meta details row – always single line, truncates with … if overflow */
function MetaRow({ article }) {
  return (
    <div className="article-metaRow">
      <div className="mt-1 flex items-center gap-x-1 overflow-hidden whitespace-nowrap truncate">
        {article.cat && (
          <>
            <span className="font-semibold text-[#e48d0b]">{article.cat}</span>
            <span className="opacity-50">•</span>
          </>
        )}
        <span>{article.time}</span>
        <span className="opacity-50">•</span>
        <span className="truncate">{getReadTime(article)}</span>
      </div>
    </div>
  );
}

/** Large Image Card */
function ImageCard({ article }) {
  const { openNews } = useNewsDetail();
  const { isSaved, toggleSave } = useSavedNews();
  const isBookmarked = isSaved(article.id);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(article);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openNews(article)}
      onKeyDown={(e) => e.key === "Enter" && openNews(article)}
      className="group flex h-full flex-col justify-between cursor-pointer p-0 transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      <div className="flex flex-col flex-1">
        <div className="relative w-full aspect-[18/12] overflow-hidden rounded-[7px]">
          {article.img ? (
            <img
              src={article.img}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="h-full w-full" />
          )}

          <button
            type="button"
            aria-label="સેવ કરો"
            onClick={handleBookmark}
            title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
            className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
              isBookmarked
                ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
                : "bg-black/40 text-white hover:bg-black/60"
            }`}
          >
            <Bookmark
              size={16}
              className={`${isBookmarked ? "fill-current" : ""}`}
            />
          </button>
        </div>

        {/* No forced 3-line height – MetaRow sits right after actual headline */}
        <p
          className="mt-2 font-gu font-normal leading-[1.25]
                     text-[20px]
                     text-ink dark:text-ink-dark line-clamp-3
                     transition-colors duration-200"
        >
          {article.headline}
        </p>
      </div>

      <div className="md:mt-auto">
        <MetaRow article={article} />
      </div>
    </div>
  );
}

/** Right column — text-only at every width (ONE desktop structure from 768px+) */
function TextCard({ article, className = "" }) {
  const { openNews } = useNewsDetail();
  const { isSaved, toggleSave } = useSavedNews();
  const isBookmarked = isSaved(article.id);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(article);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openNews(article)}
      onKeyDown={(e) => e.key === "Enter" && openNews(article)}
      className={`group relative flex w-full h-full cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]
        flex-col justify-between
        md:min-h-[102px]
        ${className}`}
    >
      {/* Content wrapper – relative with pr-8 so headline/meta leaves room for absolute bookmark */}
      <div className="relative pr-8 flex-1 min-w-0 flex flex-col">
        {/* Headline – no forced 3-line height */}
        <p
          className="font-gu font-normal leading-[1.25]
                     text-[20px]
                     text-ink dark:text-ink-dark line-clamp-3
                     transition-colors duration-200"
        >
          {article.headline}
        </p>

        {/* MetaRow */}
        <div className="md:mt-auto">
          <MetaRow article={article} />
        </div>

        {/* Bookmark – absolute bottom-right, aligned with MetaRow */}
        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className="absolute bottom-0 right-0 flex p-1 text-ink/40 dark:text-ink-dark/40 hover:text-[#e48d0b] dark:hover:text-[#e6c27a] transition-colors cursor-pointer z-10 shrink-0"
        >
          <Bookmark
            size={16}
            className={`${
              isBookmarked
                ? "fill-current text-[#e48d0b] dark:text-[#e6c27a]"
                : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}

export default function TopNewsSection() {
  const list = articles.gujarat || [];
  if (!list.length) return null;

  const nonHeroItems = list.filter((article) => article.type !== "hero");

  const imageCards = nonHeroItems.slice(0, 2);
  const textCards = nonHeroItems.slice(2, 5);

  if (!imageCards.length && !textCards.length) return null;

  return (
    <section className="mt-10 
    lg:items-stretch shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-7 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl
    ">
      <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3 md:items-stretch">
        {imageCards.map((article) => (
          <ImageCard key={article.id} article={article} />
        ))}

        {/* On desktop (768px+) this list is the 3rd column. */}
        <div className="flex flex-col justify-between gap-4">
          {textCards.map((article) => (
            <TextCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}