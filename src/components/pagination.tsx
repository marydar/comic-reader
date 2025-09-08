"use client";

import { useState } from "react";
import { MdNavigateBefore } from "react-icons/md";
import { MdNavigateNext } from "react-icons/md";

interface PaginationProps {
  totalPages: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  totalPages,
  initialPage = 1,
  onPageChange,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [inputPage, setInputPage] = useState("");

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handleGoToPage = () => {
    const page = parseInt(inputPage);
    if (!isNaN(page)) {
      handlePageChange(page);
      setInputPage("");
    }
  };

  const getPageNumbers = () => {
    const delta = 2; // how many pages to show around current
    const pages: number[] = [];

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
      {/* Prev / Next */}
      <div className=" items-center gap-2 flex">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg border-1 border-primary text-foreground  disabled:opacity-50 hidden md:flex"
        >
          <MdNavigateBefore className="text-2xl" />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded-lg ${
              page === currentPage
                ? "bg-primary text-primary-foreground"
                : "border-1 border-primary text-foreground"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg border-1 border-primary text-foreground disabled:opacity-50 hidden md:flex"
        >
          <MdNavigateNext className="text-2xl" />
        </button>
      </div>
      <div className=" items-center gap-2  md:hidden flex">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg border-1 border-primary text-foreground  disabled:opacity-50 "
        >
          <MdNavigateBefore className="text-2xl" />
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg border-1 border-primary text-foreground disabled:opacity-50 "
        >
          <MdNavigateNext className="text-2xl" />
        </button>
      </div>

      {/* Go to input */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          placeholder="Page #"
          className="w-20 px-2 py-1  rounded-lg border-1 border-primary text-foreground"
        />
        <button
          onClick={handleGoToPage}
          className="px-3 py-1 bg-primary text-primary-foreground rounded-lg"
        >
          Go
        </button>
      </div>
    </div>
  );
}
