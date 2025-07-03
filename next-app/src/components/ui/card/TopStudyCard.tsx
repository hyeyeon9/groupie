
import ClientPopularStudy from "@/components/popular/ClientPopularStudy";
import { prisma } from "@/lib/prisma";

export default async function TopStudyCard() {
  const top3 = await prisma.study.findMany({
    select: {
      id: true,
      title: true,
      category: true,
      scrap: true,
      views: true,
      startDate: true,
    },
    orderBy: [{ scrap: "desc" }, { views: "desc" }, { createdAt: "desc" }], // 1순위 스크랩, 2순위 조회수
    take: 6,
  });

  return (
    <div className="bg-gray-100 rounded-xl shadow-sm  md:p-6 p-3">
      <div className="flex md:mb-6 mb-3">
        <h2 className="text-2xl font-bold text-gray-900 ">
          🔥 인기많은 스터디
        </h2>
      </div>
      <div>
        <ClientPopularStudy posts={top3} />
      </div>
    </div>
  );
}
