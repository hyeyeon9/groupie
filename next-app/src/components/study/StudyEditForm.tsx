"use client";
import { updateStudy } from "@/actions/study-actions";
import { Study } from "@prisma/client";
import { useActionState, useEffect, useState } from "react";
import PostEditor from "../markdown/MarkdownEditor";
import Image from "next/image";

export default function EditForm({ post }: { post: Study }) {
  const [formState, formAction] = useActionState(updateStudy, {
    error: null,
  });
  const [content, setContent] = useState("");

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState("");

  useEffect(() => {
    setContent(post.content);
  }, [post.content]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "posts");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setFile(data.url);
  };
  return (
    <>
      <form className="space-y-6" action={formAction}>
        <input type="hidden" name="id" value={post.id} />

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-y-3 gap-x-8">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              카테고리
            </label>
            <select
              id="category"
              name="category"
              defaultValue={post.category}
              className="w-full pr-2  px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="코딩">💻 코딩</option>
              <option value="어학">🌍 어학</option>
              <option value="자격증">📜 자격증</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="studyType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              온/오프라인
            </label>
            <select
              id="studyType"
              name="studyType"
              defaultValue={post.studyType ?? "온라인"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="온라인">온라인</option>
              <option value="오프라인">오프라인</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="maxParticipants"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              모집 인원 수
            </label>
            <select
              id="maxParticipants"
              name="maxParticipants"
              defaultValue={post.maxParticipants ?? 4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="1">1명</option>
              <option value="2">2명</option>
              <option value="3">3명</option>
              <option value="4">4명</option>
              <option value="5">5명 이상</option>
            </select>
          </div>

          {/* 5. 시작일 */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              모집 마감일
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={
                post.startDate
                  ? post.startDate.toISOString().split("T")[0]
                  : "2025-05-26"
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>

          {/* 6. 연락 방법 */}
          <div>
            <label
              htmlFor="contactMethod"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              연락 방법
            </label>
            <select
              id="contactMethod"
              name="contactMethod"
              defaultValue={post.contactMethod ?? "이메일"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="이메일">이메일</option>
              <option value="오픈톡">오픈톡</option>
              <option value="구글폼">구글폼</option>
            </select>
          </div>

          <div>
            <input
              name="contactLink"
              type="text"
              defaultValue={post.contactLink ?? ""}
              placeholder="연락 링크를 입력해주세요"
              className=" lg:mt-6 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            제목
          </label>
          <input
            id="title"
            name="title"
            placeholder="제목을 입력하세요."
            defaultValue={post.title}
            type="text"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="file">썸네일</label>

          {/* 커스텀 파일 업로드 버튼 */}
          <div className="flex gap-2">
            <label
              htmlFor="file"
              className="inline-block px-2 py-1 text-xs font-medium text-white bg-black rounded cursor-pointer w-fit"
            >
              파일 선택
            </label>

            <button
              type="button"
              onClick={() => {
                setFile(post.image || "");
                setPreview(post.image);
              }}
              className="inline-block px-2 py-1 text-xs font-medium text-white bg-black rounded cursor-pointer w-fit"
            >
              초기화
            </button>
          </div>

          {/* 실제 input은 숨김 */}
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* 미리보기 */}
          {(preview || post.image) && (
            <div className="relative w-48 h-48 mb-3">
              <Image
                src={preview ?? post.image!}
                alt="썸네일"
                fill
                className="object-cover rounded-lg border"
              />
            </div>
          )}

          {/* 서버 전송용 hidden input */}
          <input type="hidden" name="image" value={file} />
        </div>
        {/* 내용 작성 */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <PostEditor
            value={content}
            onChange={(val) => setContent(val || "")}
          />
        </div>

        {/* formData.get("content") 보내기 위해서 아래 코드 추가  */}
        <input type="hidden" name="content" value={content} />

        {/* 에러 메시지 */}
        {formState?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg
                className="w-5 h-5 text-red-400 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-700">{formState.error}</p>
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setContent(post.content);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              초기화
            </button>
            <button
              type="submit"
              className="hover:cursor-pointer inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              등록하기
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
