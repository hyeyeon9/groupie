"use client";

import { useStudyFilters } from "@/hooks/useStudyFilters";
import { useStudyFilterStore } from "@/store/studyFilterStore";
import { usePathname, useRouter } from "next/navigation";

const categories = ["전체", "코딩", "어학", "자격증"];
const types = ["전체", "온라인", "오프라인"];

export default function StudyFilterBar() {
  const router = useRouter();
  const pathname = usePathname(); // 현재 위치 URL  "/study"

  // URL 파라미터 동기화
  useStudyFilters();

  // 스토어에서 낙관적 상태 가져오기
  const {
    optimisticCategory,
    optimisticStudyType,
    optimisticStatus,
    updateOptimisticFilter,
  } = useStudyFilterStore();

  const updateParam = (key: string, value: string) => {
    // 낙관적 업데이트로 즉시 s즉시 UI 변경
    updateOptimisticFilter(key, value === "전체" ? null : value);

    const params = new URLSearchParams(window.location.search);
    if (value === "전체") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // 모집중 버튼 토글
  const toggleStatus = () => {
    // 낙관적 업데이트로 즉시 버튼 색 변경
    const newStatus = optimisticStatus === "open" ? null : "open";
    
    updateOptimisticFilter("status", newStatus);

    const params = new URLSearchParams(window.location.search);
    if (newStatus === null) {
      params.delete("status");
    } else {
      params.set("status", "open");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* 카테고리 셀렉트 */}
      <label htmlFor="study-category" className="sr-only">
        스터디 카테고리
      </label>
      <select
        id="study-category"
        value={optimisticCategory ?? "전체"}
        onChange={(e) => updateParam("category", e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 text-sm"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* 온라인/오프라인 셀렉트 */}
      <label htmlFor="study-type" className="sr-only">
        스터디 형식(온라인/오프라인)
      </label>
      <select
        id="study-type"
        value={optimisticStudyType ?? "전체"}
        onChange={(e) => updateParam("studyType", e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 text-sm"
      >
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* 모집중 필터 버튼 */}
      <button
        onClick={toggleStatus}
        className={`px-4 py-2 rounded text-sm ${
          optimisticStatus === "open"
            ? "bg-black text-white"
            : "bg-white text-gray-600 border"
        }`}
      >
        모집중만 보기
      </button>
    </div>
  );
}
