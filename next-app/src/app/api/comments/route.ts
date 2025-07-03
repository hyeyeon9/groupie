import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { user } = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "로그인 필요" }, { status: 401 });
  }

  const { postId, content } = await req.json();

  const comment = await prisma.comment.create({
    data: {
      content,
      studyId: Number(postId),
      authorId: user.id,
    },
    include: { author: true },
  });

  return NextResponse.json({ comment });
}
