import { prisma } from "@/lib/prisma";
import PostCard from "../ui/card/PostCard";
import LikedCalendar from "./LikedCalendar";
import type { Scrap, Study } from "@prisma/client";

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

export default async function LikedPostList({ userId }: { userId: number }) {
  const likedPosts: ScrapedWithStudy[] = await prisma.scrap.findMany({
    where: { userId },
    include: {
      study: {
        select: {
          id: true,
          title: true,
          content: true,
          category: true,
          createdAt: true,
          startDate: true,
          scrap: true,
          authorId: true,
        },
      },
    },
  });

  if (likedPosts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <p className="text-gray-500 text-center">
            아직 스크랩한 글이 없습니다.
          </p>
          <p className="text-sm text-gray-400 text-center mt-2">
            마음에 드는 스터디를 스크랩 해보세요!
          </p>
        </div>
      </div>
    );
  }

  const filteredPosts = likedPosts.filter(
    (like) => like.study.authorId !== userId
  );

  if (filteredPosts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <p className="text-gray-500 text-center">
            다른 사람의 글을 스크랩한 내역이 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <LikedCalendar posts={filteredPosts} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            스크랩한 글 ({filteredPosts.length})
          </h2>
        </div>
        <div className="space-y-4">
          {filteredPosts.map((scrap) => (
            <PostCard key={scrap.study.id} post={scrap.study} />
          ))}
        </div>
      </div>
    </div>
  );
}
