// /components/UploadAvatar.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

export default function UploadAvatar({
  nickname,
  defaultImage,
  onUpload,
}: {
  nickname: string;
  defaultImage: string;
  onUpload: (url: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "avatars");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      onUpload(data.url); // → DB 저장 호출 등으로 연결
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-32 h-32 group">
        <div className="md:w-32 md:h-32 w-28 h-28 rounded-full overflow-hidden relative">
          <Image
            src={preview ?? defaultImage}
            alt="프로필"
            fill
            className="object-cover"
          />
        </div>

        {/* 이모지 오버레이 */}
        <label
          htmlFor="file-upload"
          className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-2xl rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
        >
          ✏️
        </label>

        {/* 실제 input은 숨김 */}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <div className="font-semibold md:text-2xl text-xl -mt-4 lg:-mt-0 -ml-2 lg:-ml-0">
        {nickname}
      </div>
    </div>
  );
}
