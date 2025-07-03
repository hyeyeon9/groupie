import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { content } = await req.json();

  const updated = await prisma.comment.update({
    where: { id: Number(id) },
    data: { content },
    include: { author: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 댓글 존재 여부 확인
  const comment = await prisma.comment.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!comment) {
    return NextResponse.json({ error: "댓글 없음" }, { status: 404 });
  }

  // 삭제
  await prisma.comment.delete({ where: { id: Number(id) } });

  return NextResponse.json({ success: true });
}
