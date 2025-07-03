// app/api/studies/route.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursorParam = searchParams.get("cursor");
    const cursor = cursorParam ? Number(cursorParam) : null;

    const category = searchParams.get("category"); // 코딩
    const studyType = searchParams.get("studyType"); // 온라인
    const status = searchParams.get("status"); // open
    const query = searchParams.get("query");

    const take = 6;

    // where 조건 구성 - TypeScript가 Prisma가 기대하는 필드만 허용
    const andConditions: Prisma.StudyWhereInput[] = [];

    if (category && category !== "전체" && category !== "null") {
      andConditions.push({ category });
    }

    if (studyType && studyType !== "전체" && studyType !== "null") {
      andConditions.push({ studyType: studyType.trim() });
    }

    if (status === "open") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      andConditions.push({ startDate: { gte: today } });
      andConditions.push({ startDate: { not: null } });
    }

    if (query && query !== "null") {
      andConditions.push({
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      });
    }

    const where: Prisma.StudyWhereInput = andConditions.length
      ? { AND: andConditions }
      : {};

    const studies = await prisma.study.findMany({
      where,
      select: {
        id: true,
        title: true,
        category: true,
        startDate: true,
        createdAt: true,
        scrap: true,
        content: true,
        author: {
          select: {
            id: true,
            nickname: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            comments: true, // 댓글 개수만 필요하면 이렇게
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // cursor 제외
      }),
      take,
    });

    const nextCursor =
      studies.length === take ? studies[studies.length - 1].id : null;

    return NextResponse.json({
      posts: studies,
      nextCursor,
      hasMore: !!nextCursor,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to fetch studies:", error);
    }

    return NextResponse.json(
      { error: "Failed to fetch studies" },
      { status: 500 }
    );
  }
}
