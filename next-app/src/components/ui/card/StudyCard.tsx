import React from "react";
import { formatRelativeTime, getToday } from "@/lib/date";
import { Study, User } from "@prisma/client";

import Image from "next/image";
import { FaBookmark } from "react-icons/fa";
import Link from "next/link";

type StudyType = Study & {
  author: Pick<User, "id" | "nickname" | "profileImage">;
  _count: {
    comments: number;
  };
};

interface Props {
  study: StudyType;
}

const StudyCard = React.memo(({ study }: Props) => {
  // 오늘 날짜를 매번 렌더링 하지말고 useMemo로 메모제이션
  const today = getToday();

  // 모집 상태로 useMemo로 계산 (바뀔때만 다시 계산하게)
  const recruitmentStatus = React.useMemo(() => {
    if (!study.startDate)
      return { text: "모집중", className: "bg-green-200 text-gray-800" };

    const isExpired = new Date(study.startDate) < today;
    return isExpired
      ? { text: "모집 마감", className: "bg-gray-300 text-gray-800" }
      : { text: "모집중", className: "bg-green-200 text-gray-800" };
  }, [study.startDate, today]);

  // 내용 미리보기를 useMemo로 처리
  const contentPreview = React.useMemo(() => {
    return study.content.replace(/[#_*~`>[\]()\-!\n]/g, "").slice(0, 100);
  }, [study.content]);

  // 상대시간을 useMemo로 처리
  const relativeTime = React.useMemo(() => {
    return formatRelativeTime(new Date(study.createdAt));
  }, [study.createdAt]);

  return (
    <Link href={`/study/${study.id}`} key={study.id}>
      <div
        className=" min-h-[200px] group bg-white rounded shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200">
              {study.category}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${recruitmentStatus.className}`}
            >
              {recruitmentStatus.text}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900  transition-colors line-clamp-1">
              {study.title}
            </h3>
            <p
              className="text-sm text-gray-600 line-clamp-2 leading-relaxed
                  min-h-[48px]"
            >
              {contentPreview}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{relativeTime}</span>
            <span>•</span>
            <span>{study._count.comments}개의 댓글</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div>
                <div className="w-8 h-8 rounded-full overflow-hidden relative">
                  <Image
                    src={study.author.profileImage ?? "/default-avatar.png"}
                    alt="프로필"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="text-sm text-gray-700 font-medium ">
                {study.author.nickname}
              </span>
            </div>
            <div className="flex items-center gap-1 text-red-500">
              <FaBookmark className="text-sm" />

              <span className="text-sm font-medium">{study.scrap}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

StudyCard.displayName = "StudyCard";
// 디버깅 시 컴포넌트 이름을 명확하게 보여주기 위해
// 안하면 Memo || Anonymous
// 하면 Memo(StudyCard)

export default StudyCard;