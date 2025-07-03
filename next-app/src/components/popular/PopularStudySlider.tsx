
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import Slider from "react-slick";

type TopStudyCardType = {
  id: number;
  title: string;
  category: string;
  scrap: number;
  views: number;
  startDate: Date | null;
};

export default function PopularStudySlider({
  posts,
}: {
  posts: TopStudyCardType[];
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [today, setToday] = useState<Date | null>(null);

  const router = useRouter();

  useEffect(() => {
    setToday(() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    });
    setIsMounted(true);
  }, []);

  if (!isMounted || !today) return null; // SSR 방지

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true, // 자동 슬라이드
    autoplaySpeed: 3000, // 3초 간격
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // 모바일 기준
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024, // 태블릿
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {posts.map((item) => (
        <div
          key={item.id}
          className=" flex flex-col justify-between w-[311px] h-[125px] px-1 md:px-2 "
        >
          <div className=" rounded-xl p-5 hover:shadow-lg transition-all duration-300  bg-white">
            <div className="space-y-3">
              <div className="flex gap-2 -ml-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {item.category}
                </span>
                <p
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    item.startDate && new Date(item.startDate) < today
                      ? "bg-gray-300 text-gray-800"
                      : "bg-green-200 text-gray-800"
                  }`}
                >
                  {" "}
                  {item.startDate && new Date(item.startDate) < today
                    ? "모집 마감"
                    : "모집중"}
                </p>
              </div>
              <h3
                onClick={() => router.push(`/study/${item.id}`)}
                className="font-semibold text-gray-900 line-clamp-1 hover:cursor-pointer hover:text-blue-500 transition-colors duration-200"
              >
                {item.title}
              </h3>
            </div>
            <div className="flex justify-end mt-2 gap-2 text-sm">
              <span>👀 {item.views}</span>
              <div className="flex items-center gap-1 text-red-500">
                <span>
                  <FaBookmark />
                </span>
                <span className="text-sm font-medium">{item.scrap}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
}
