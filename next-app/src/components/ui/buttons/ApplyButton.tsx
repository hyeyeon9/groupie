"use client";
import { useModalStore } from "@/store/modalStore";
import { Study } from "@prisma/client";
import toast from "react-hot-toast";

export default function ApplyButton({
  post,
  isLoggedIn,
}: {
  post: Study;
  isLoggedIn: boolean;
}) {
  const { open } = useModalStore();

  const handleApply = () => {
    if (!isLoggedIn) {
      open("login");
      return;
    }

    if (post.contactMethod === "이메일") {
      navigator.clipboard.writeText(post.contactLink ?? "null");
      toast.success("클립보드에 이메일을 복사했어요!");
    } else {
      window.open(post.contactLink ?? "", "_blank");
      toast.success("링크로 이동했어요!");
    }
  };
  return (
    <div className="flex justify-end">
      <button
        className="hover:cursor-pointer bg-red-600 w-fit py-2 px-3 rounded mb-2 text-white"
        onClick={handleApply}
      >
        지원하기
      </button>
    </div>
  );
}
