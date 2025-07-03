"use client";

import { useStudyFilterStore } from "@/store/studyFilterStore";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateOptimisticFilter = useStudyFilterStore(
    (state) => state.updateOptimisticFilter
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // 새로고침 막고
    const params = new URLSearchParams(searchParams.toString());
    if (keyword.trim()) {
      params.set("query", keyword);
      updateOptimisticFilter("query", keyword);
    } else {
      params.delete("query");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative flex items-center">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          type="text"
          placeholder="검색어를 입력하세요."
          className="w-full pl-4 pr-12 py-3 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
        />
        <button
          type="submit"
          className="absolute right-2 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:text-gray-600"
        >
          <span className="text-lg">🔍</span>
        </button>
      </div>
    </form>
  );
}
