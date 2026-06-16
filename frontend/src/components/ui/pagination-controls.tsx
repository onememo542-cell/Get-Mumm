import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isRtl?: boolean;
}

export function PaginationControls({ currentPage, totalPages, onPageChange, isRtl }: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const Prev = isRtl ? ChevronRight : ChevronLeft;
  const Next = isRtl ? ChevronLeft : ChevronRight;

  return (
    <nav className="flex items-center justify-center gap-1 mt-10" aria-label="Pagination" data-testid="pagination-controls">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 rounded-full border border-border hover:border-primary hover:text-primary disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
        data-testid="button-page-prev"
      >
        <Prev className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
              currentPage === p
                ? "bg-primary text-primary-foreground shadow-sm font-bold"
                : "border border-border hover:border-primary hover:text-primary"
            }`}
            aria-label={`Page ${p}`}
            aria-current={currentPage === p ? "page" : undefined}
            data-testid={`button-page-${p}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-9 h-9 rounded-full border border-border hover:border-primary hover:text-primary disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
        data-testid="button-page-next"
      >
        <Next className="h-4 w-4" />
      </button>
    </nav>
  );
}
