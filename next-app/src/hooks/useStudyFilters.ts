import { useStudyFilterStore } from "@/store/studyFilterStore";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const useStudyFilters = () => {
  const searchParams = useSearchParams();
  const setFilters = useStudyFilterStore((state) => state.setFilters);

  const category = searchParams.get("category") || "전체";
  const studyType = searchParams.get("studyType") || "전체";
  const status = searchParams.get("status");
  const query = searchParams.get("query");

  // URL 변경시 스토어 업데이트
  useEffect(() => {
    setFilters({
      category,
      studyType,
      status,
      query,
    });
  }, [category, studyType, status, query, setFilters]);

  return {
    category,
    studyType,
    status,
    query,
  };
};
