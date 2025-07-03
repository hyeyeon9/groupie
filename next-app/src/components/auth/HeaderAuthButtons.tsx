"use client";
import { useModalStore } from "@/store/modalStore";

export default function HeaderAuthButtons() {
  const { open } = useModalStore();

  return (
    <>
      <button
        onClick={() => open("login")}
        className="hover:cursor-pointer text-sm lg:text-base text-gray-700 hover:text-gray-900 font-medium transition-colors"
      >
        로그인
      </button>
      <button
        onClick={() => open("signup")}
        className="hover:cursor-pointer text-sm lg:text-base text-gray-700 hover:text-gray-900 font-medium transition-colors"
      >
        회원가입
      </button>
    </>
  );
}
