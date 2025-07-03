"use client";

import { useState } from "react";

type Comment = {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    id: number;
    nickname: string;
    profileImage: string | null;
  };
};

type CommentFormProps = {
  postId: number;
  onCommentAdd: (comment: Comment) => void;
};

export default function CommentForm({
  postId,
  onCommentAdd,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);

    // 서버에 새 댓글 POST
    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ postId, content }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);

    if (data.comment) {
      // 부모에게 새 댓글 전달
      onCommentAdd(data.comment);
      setContent("");
    } else {
      // 에러 처리
      alert(data.error || "댓글 등록 실패!");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input hidden name="postId" value={postId} readOnly />
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 작성하세요."
          rows={3}
          className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:cursor-pointer"
        >
          {loading ? "작성 중..." : "댓글 작성"}
        </button>
      </div>
    </form>
  );
}
