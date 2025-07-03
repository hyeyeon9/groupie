"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MyPageTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <Link href="/study/mypage" className="group ">
            <button
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors hover:cursor-pointer ${
                pathname === "/study/mypage"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              내가 쓴 글
            </button>
          </Link>
          <Link href="/study/mypage/likes" className="group ">
            <button
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors hover:cursor-pointer ${
                pathname === "/study/mypage/likes"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              스크랩한 글
            </button>
          </Link>
        </nav>
      </div>
    </div>
  );
}
