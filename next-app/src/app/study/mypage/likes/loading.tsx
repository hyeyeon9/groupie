"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center -mt-20 bg-white gap-4">
      <div className="w-40 h-40 rounded-full overflow-hidden relative animate-bounce-slow">
        <Image
          src="/Groupie.webp"
          alt="로딩 중..."
          width={160}
          height={160}
          priority
          className="object-contain"
        />
      </div>
      <p className="text-gray-600 text-sm animate-pulse mt-2">
        잠시만 기다려주세요...
      </p>
    </div>
  );
}
