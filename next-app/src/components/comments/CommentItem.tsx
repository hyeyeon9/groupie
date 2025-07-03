"use client";
import { useState, useTransition } from "react";
import { formatRelativeTime } from "@/lib/date";
import CommentDeleteButton from "./CommentDeleteButton";
import Image from "next/image";

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

export default function CommentItem({
  comment,
  currentUserId,
  onUpdate,
  onDelete,
}: {
  comment: Comment;
  currentUserId?: number;
  onUpdate: (Comment: Comment) => void;
  onDelete: (commentId: number) => void;
}) {
  const isMyComment = currentUserId === comment.author.id;
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    startTransition(async () => {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });
      const updatedComment = await res.json();
      onUpdate(updatedComment);
      setIsEditing(false);
    });
  };

  return (
    <div className="py-6 lg:py-7 border-b border-gray-200 last:border-b-0 ">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="w-8 h-8 rounded-full overflow-hidden relative">
              <Image
                src={comment.author.profileImage ?? "/default-avatar.png"}
                alt="프로필"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {comment.author.nickname}
            </p>
            <p className="text-sm text-gray-500">
              {formatRelativeTime(new Date(comment.createdAt))}
            </p>
          </div>
        </div>

        {isMyComment && (
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:cursor-pointer"
              >
                수정
              </button>
            )}
            <CommentDeleteButton
              commentId={comment.id}
              onDelete={() => onDelete(comment.id)}
            />
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedContent(comment.content);
              }}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              취소
            </button>
            <button
              onClick={handleUpdate}
              disabled={isPending}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors duration-200"
            >
              {isPending ? "수정 중..." : "수정"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </div>
      )}
    </div>
  );
}
