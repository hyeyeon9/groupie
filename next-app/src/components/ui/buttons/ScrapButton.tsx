"use client";
import { toggleLike } from "@/actions/study-actions";
import { useModalStore } from "@/store/modalStore";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { FaBookmark } from "react-icons/fa";

export default function ScrapButton({
  studyId,
  initialScrapCount,
  initiallyScraped,
  isLoggedIn,
}: {
  studyId: number;
  initialScrapCount: number;
  initiallyScraped: boolean;
  isLoggedIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [liked, setLiked] = useState(initiallyScraped ?? false);
  const [scrapCount, setScrapCount] = useState(initialScrapCount);
  const { open } = useModalStore(); // 모달 열기

  const handleClick = () => {
    if (!isLoggedIn) {
      open("login");
      return;
    }

    // Optimistic UI로 일단 먼저 바꿔줌
    const optimisticLiked = !liked;
    setLiked(optimisticLiked);
    setScrapCount((prev) => prev + (optimisticLiked ? 1 : -1));
    toast.success(optimisticLiked ? "스크랩 완료!" : "스크랩 제거!");

    // 실제 서버 연동
    startTransition(async () => {
      try {
        const res = await toggleLike(studyId);
        setLiked(!!res.liked);
      } catch (e) {
        // 개발 환경에서만 에러 로그 출력
        if (process.env.NODE_ENV === "development") {
          console.log(e);
        }
        // 에러시 원복
        setLiked(liked);
        setScrapCount((prev) => prev + (liked ? 1 : -1));
        toast.error("스크랩 처리 실패! 잠시 후 다시 시도해 주세요.");
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-1 px-3 py-1 rounded-full hover:cursor-pointer ${
        liked ? "text-red-500" : "text-gray-400"
      }`}
    >
      <span>
        {" "}
        <FaBookmark />
      </span>
      <span>{scrapCount}</span>
    </button>
  );
}
