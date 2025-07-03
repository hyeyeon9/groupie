"use client";
import type { Scrap, Study } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ScrapedWithStudy = Scrap & {
  study: Pick<
    Study,
    | "id"
    | "title"
    | "content"
    | "category"
    | "createdAt"
    | "startDate"
    | "scrap"
    | "authorId"
  >;
};
// react-calendar는 단일 날짜나 날짜 번위를 선택할 수 있기에 아래와 같이 정의
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function LikedCalendar({
  posts,
}: {
  posts: ScrapedWithStudy[];
}) {
  const [value, setValue] = useState<Value>(new Date()); // 선택된 날짜
  const [selectedDatePosts, setSelectedDatePosts] = useState<
    ScrapedWithStudy[]
  >([]); // 선택된 날짜에 해당하는 게시물 목록 (여러개일 수 있어서 배열)
  const [isMounted, setIsMounted] = useState(false); // SSR 오류 방지용 (하이드레이션 오류 방지)

  const formatDate = (date: Date) => date.toISOString().split("T")[0]; // "2025-05-27" 이런 형태로 변환해서 날짜 비교에 사용
  const router = useRouter();

  useEffect(() => {
    setValue(new Date()); // 시작시 오늘 날짜로 선택
    setIsMounted(true); // 시작시 클라이언트 마운트 여부 트루
  }, []);

  // 선택된 날짜의 스터디 필터링
  useEffect(() => {
    if (value instanceof Date) {
      const dateStr = formatDate(value); // 오늘 날짜
      const postsForDate = posts.filter(
        (post) =>
          post.study.startDate && //  마감일이 오늘 날짜랑 같은 애들만 필터링해서
          formatDate(new Date(post.study.startDate)) === dateStr
      );
      setSelectedDatePosts(postsForDate); // 넣어주기
    }
  }, [value, posts]);

  // 스터디 글 클릭시 상세페이지로 이동하도록
  const handleStudyClick = (studyId: number) => {
    router.push(`/study/${studyId}`);
  };

  if (!isMounted) return null; // 클라이언트 마운트 안됐으면 null (SSR 오류 방지)

  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-8">
      {/* 캘린더 */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              스터디 시작일 캘린더
            </h3>
          </div>
          <div className="p-6">
            <div className="calendar-container">
              <Calendar
                className="w-full border-none shadow-none"
                onChange={setValue}
                value={value}
                tileContent={({ date, view }) => {
                  if (view !== "month") return null;

                  const dateStr = formatDate(date);
                  const match = posts.filter(
                    (post) =>
                      post.study.startDate &&
                      formatDate(new Date(post.study.startDate)) === dateStr
                  );

                  return match.length > 0 ? (
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto"></div>
                      <div className="text-[8px] text-blue-600 font-medium text-center">
                        {match.length}개
                      </div>
                    </div>
                  ) : null;
                }}
                tileClassName={({ date, view }) => {
                  if (view !== "month") return "";

                  const dateStr = formatDate(date);
                  const hasPost = posts.some(
                    (post) =>
                      post.study.startDate &&
                      formatDate(new Date(post.study.startDate)) === dateStr
                  );

                  return hasPost ? "has-post" : "";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 선택된 날짜의 스터디 */}
      <div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {value instanceof Date ? (
                <>
                  {value.getMonth() + 1}월 {value.getDate()}일
                </>
              ) : (
                "선택된 날짜"
              )}
            </h3>
          </div>
          <div className="p-6">
            {selectedDatePosts.length > 0 ? (
              <div className="space-y-3">
                {selectedDatePosts.map((post) => (
                  <div
                    key={post.study.id}
                    onClick={() => handleStudyClick(post.study.id)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <h4 className="font-semibold text-sm line-clamp-2 mb-2">
                      {post.study.title}
                    </h4>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {post.study.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        ♥︎ {post.study.scrap}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                이 날짜에 시작하는 스터디가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
