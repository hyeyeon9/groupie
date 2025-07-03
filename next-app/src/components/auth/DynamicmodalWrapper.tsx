"use client";
import dynamic from "next/dynamic";

// 모달 컴포넌트 동적 import, SSR 비활성화
const LoginSignupModal = dynamic(
  () => import("@/components/auth/LoginSignupModal"),
  { ssr: false }
);

export default function DynamicModalWrapper() {
  return <LoginSignupModal />;
}
