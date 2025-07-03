import { formatRelativeTime } from "@/lib/date";
import Link from "next/link";
import { FaBookmark } from "react-icons/fa";

type Props = {
  post: {
    id: number;
    title: string;
    content: string;
    category: string;
    scrap: number;
    createdAt: Date;
    authorId?: number;
    startDate?: Date | null;
  };
};

export default function PostCard({ post }: Props) {
  const plainText = post.content
    .replace(/[#_*~`>[\]()\-!\n]/g, "")
    .slice(0, 100);

  return (
    <Link href={`/study/${post.id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.01] p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 ">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mt-2">{plainText}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {post.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              {formatRelativeTime(new Date(post.createdAt))}
            </div>
            {post.startDate && (
              <div className="flex items-center gap-1 text-xs text-orange-600">
                시작: {new Date(post.startDate).toLocaleDateString("ko-KR")}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <div className="font-medium flex gap-1 items-center">
              {" "}
              <FaBookmark />
              {post.scrap}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
