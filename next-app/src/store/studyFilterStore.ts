import { create } from "zustand";

interface StudyFilterState {
  category: string;
  studyType: string;
  status: string | null;
  query: string | null;

  optimisticCategory: string;
  optimisticStudyType: string;
  optimisticStatus: string | null;

  refreshTrigger: number;

  setFilters: (filters: {
    category?: string;
    studyType?: string;
    status?: string | null;
    query?: string | null;
  }) => void;

  updateOptimisticFilter: (key: string, value: string | null) => void;
  triggerRefresh: () => void;
  syncOptimisticState: () => void;
}

export const useStudyFilterStore = create<StudyFilterState>((set, get) => ({
  // 초기상태
  category: "전체",
  studyType: "전체",
  status: null,
  query: null,

  optimisticCategory: "전체",
  optimisticStudyType: "전체",
  optimisticStatus: null,

  refreshTrigger: 0,

  setFilters: (filters) => {
    set((state) => ({
      ...state,
      category: filters.category ?? state.category,
      studyType: filters.studyType ?? state.studyType,
      status: filters.status ?? state.status,
      query: filters.query ?? state.query,
    }));
    //get().syncOptimisticState();
  },

  updateOptimisticFilter: (key, value) => {
    set((state) => ({
      ...state,
      [`optimistic${key.charAt(0).toUpperCase() + key.slice(1)}`]: value,
    }));

    get().triggerRefresh();
  },

  // 리스트 새로고침 트리거
  triggerRefresh: () => {
    set((state) => ({
      ...state,
      refreshTrigger: state.refreshTrigger + 1,
    }));
  },

  // 낙관적 상태를 실제 상태와 동기화
  syncOptimisticState: () => {
    const { category, studyType, status } = get();
    set((state) => ({
      ...state,
      optimisticCategory: category,
      optimisticStudyType: studyType,
      optimisticStatus: status,
    }));
  },
}));
