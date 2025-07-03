"use client";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

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

type CommentListProps = {
  postId: number;
  initialComments: Comment[];
  currentUserId?: number;
};

export default function CommentList({
  postId,
  initialComments,
  currentUserId,
}: CommentListProps) {
  const [comments, setComments] = useState(initialComments);

  const handleCommentAdd = (comment: Comment) => {
    setComments((prev) => [comment, ...prev]);
  };

  const handleCommentUpdate = (comment: Comment) => {
    setComments((prev) => prev.map((c) => (c.id === comment.id ? comment : c)));
  };

  const handleCommentDelete = (commentId: number) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* 댓글 헤더 */}
      <div className="px-2 pb-2">
        <h3 className="text-lg font-semibold text-gray-900">
          댓글 {comments.length}개
        </h3>
      </div>

      {/* 댓글 작성 폼 */}
      <div className="px-2 py-3 border-b border-gray-200 pb-6">
        <CommentForm postId={postId} onCommentAdd={handleCommentAdd} />
      </div>

      {/* 댓글 목록 */}
      <div className="px-2 md:mb-10 -mb-5">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              onUpdate={handleCommentUpdate}
              onDelete={handleCommentDelete}
              key={comment.id}
              currentUserId={currentUserId}
              comment={comment}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <div className="text-gray-400 text-4xl mb-3">💬</div>
            <p className="text-gray-500">첫 번째 댓글을 작성해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}
