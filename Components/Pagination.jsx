"use client";

import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-between items-center p-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 cursor-pointer disabled:cursor-not-allowed bg-red-200 rounded-md disabled:bg-red-100 text-xs hover:bg-red-300"
      >
        Previous
      </button>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 cursor-pointer disabled:cursor-not-allowed rounded-md disabled:bg-red-100 text-xs bg-red-200 hover:bg-red-300"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
