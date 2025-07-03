"use client";

import { useModalStore } from "@/store/modalStore";
import { useRouter } from "next/navigation";

export default function NewStudyButton({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const { open } = useModalStore();
  const router = useRouter();
  const handleAdd = () => {
    if (!isLoggedIn) {
      open("login");
      return;
    }

    router.push("/newStudy");
  };
  return (
    <button
      onClick={handleAdd}
      className="inline-flex items-center px-6 py-3 text-base font-medium text-white
               bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap hover:cursor-pointer"
    >
      + 스터디 모집
    </button>
  );
}
