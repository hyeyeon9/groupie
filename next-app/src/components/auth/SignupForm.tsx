"use client";
import { type FormState, signup } from "@/actions/auth-actions";
import { useActionState, useEffect } from "react";
import { User, Lock, UserPlus, Hash } from "lucide-react";
import { useModalStore } from "@/store/modalStore";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [formState, formAction] = useActionState<FormState, FormData>(signup, {
    errors: {},
  });

  const { close } = useModalStore();
  const router = useRouter();

  useEffect(() => {
    if (formState.success) {
      close(); // 모달 닫고
      toast.success("회원가입 완료! 로그인을 해주세요.");
      router.refresh(); // 현재 페이지를 서버에서 다시 fetch해서 새로고침
    }
  }, [formState, close, router]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">새 계정을 만들어 스터디에 참여하세요</p>
        </div>

        {/* 폼 */}
        <form action={formAction} className="space-y-6">
          {/* 아이디 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700"
            >
              아이디
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="id"
                id="id"
                placeholder="아이디를 입력하세요"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  formState?.errors?.id
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            {formState?.errors?.id && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-4 h-4">⚠️</span>
                {formState.errors.id}
              </p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="비밀번호를 입력하세요"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  formState?.errors?.password
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            {formState?.errors?.password && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-4 h-4">⚠️</span>
                {formState.errors.password}
              </p>
            )}
          </div>

          {/* 닉네임 입력 */}
          <div className="space-y-2">
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700"
            >
              닉네임
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="nickname"
                id="nickname"
                placeholder="닉네임을 입력하세요"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                  formState?.errors?.nickname
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            {formState?.errors?.nickname && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="w-4 h-4">⚠️</span>
                {formState.errors.nickname}
              </p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
