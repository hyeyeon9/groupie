import { prisma } from "@/lib/prisma";
import PostCard from "../ui/card/PostCard";

export default async function StudyListForMyPage({
  userId,
}: {
  userId: number;
}) {
  const posts = await prisma.study.findMany({
    where: { authorId: userId },
    select: {
      id: true,
      title: true,
      content: true,
      category: true,
      createdAt: true,
      startDate: true,
      scrap: true,
    },
    orderBy: { createdAt: "desc" },
  });

  if (posts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <p className="text-gray-500 text-center">
            아직 작성한 글이 없습니다.
          </p>
          <p className="text-sm text-gray-400 text-center mt-2">
            첫 번째 스터디 글을 작성해보세요!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          내가 작성한 글 ({posts.length})
        </h2>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
