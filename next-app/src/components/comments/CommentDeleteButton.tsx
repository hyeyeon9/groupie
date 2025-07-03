"use client";

import { useTransition } from "react";

export default function CommentDeleteButton({
  commentId,
  onDelete,
}: {
  commentId: number;
  onDelete: (commentId: number) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      onDelete(commentId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-gray-400 hover:cursor-pointer"
    >
      {isPending ? "삭제 중.." : "삭제"}
    </button>
  );
}
