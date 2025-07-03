// ClientPopularStudy.tsx
"use client";

import dynamic from "next/dynamic";
import PopularCardSkeleton from "./PopularCardSkeleton";

type TopStudyCardType = {
  id: number;
  title: string;
  category: string;
  scrap: number;
  views: number;
  startDate: Date | null;
};

const PopularStudySlider = dynamic(() => import("./PopularStudySlider"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-3  ">
      {Array.from({ length: 1 }).map((_, i) => (
        <PopularCardSkeleton key={i} />
      ))}
    </div>
  ),
});

export default function ClientPopularStudy({
  posts,
}: {
  posts: TopStudyCardType[];
}) {
  return <PopularStudySlider posts={posts} />;
}
