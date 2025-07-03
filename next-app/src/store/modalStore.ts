import { create } from "zustand";

type ModalType = "login" | "signup" | null;

// zustand로 전역 모달 스토어 만들기
interface ModalStore {
  openModal: ModalType;
  open: (type: ModalType) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  openModal: null,
  open: (type) => set({ openModal: type }), 
  close: () => set({ openModal: null }),
}));
