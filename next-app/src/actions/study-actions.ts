"use server";

import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type FormState = {
  error?: string | null;
};

export async function createStudy(prevState: FormState, formData: FormData) {
  const { user } = await verifyAuth(); // 로그인 사용자 가져오기

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const category = formData.get("category") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const studyType = formData.get("studyType") as string;
  const maxParticipants = Number(formData.get("maxParticipants")) as number;
  const startDateStr = formData.get("startDate") as string;
  const startDate = startDateStr ? new Date(startDateStr) : undefined;
  const contactMethod = formData.get("contactMethod") as string;
  const contactLink = formData.get("contactLink") as string;
  const image = formData.get("image") as string;

  if (!title || !content) {
    return {
      error: "제목과 내용을 입력해주세요.",
    };
  }

  await prisma.study.create({
    data: {
      category,
      title,
      content,
      authorId: user.id,
      studyType,
      maxParticipants,
      startDate,
      contactMethod,
      contactLink,
      image,
    },
  });

  redirect("/study");
  return { error: null };
}

export async function updateStudy(prevState: FormState, formData: FormData) {
  const { user } = await verifyAuth(); // 로그인 사용자 가져오기


  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const id = Number(formData.get("id"));
  const category = formData.get("category") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const studyType = formData.get("studyType") as string;
  const maxParticipants = Number(formData.get("maxParticipants")) as number;
  const startDateStr = formData.get("startDate") as string;
  const startDate = startDateStr ? new Date(startDateStr) : undefined;
  const contactMethod = formData.get("contactMethod") as string;
  const contactLink = formData.get("contactLink") as string;
  const image = formData.get("image") as string;

  if (!title || !content) {
    return {
      error: "제목과 내용을 입력해주세요.",
    };
  }

  await prisma.study.update({
    where: { id },
    data: {
      category,
      title,
      content,
      studyType,
      maxParticipants,
      startDate,
      contactMethod,
      contactLink,
      image,
    },
  });

  redirect(`/study/${id}`); //  수정후 상세페이지로 돌아가기
  return { error: null };
}

export async function deleteStudy(id: number) {
  const { user } = await verifyAuth(); // 로그인 사용자 가져오기

  const post = await prisma.study.findUnique({ where: { id } });

  if (!user || !post || post.authorId !== user.id) {
    return { error: "삭제 권한 없음" };
  }

  await prisma.study.delete({ where: { id } });

  redirect(`/study`); //  수정후 상세페이지로 돌아가기
}

export async function toggleLike(studyId: number) {
  const { user } = await verifyAuth();

  if (!user) {
    return {
      error: "로그인이 필요합니다.",
    };
  }

  const existing = await prisma.scrap.findUnique({
    where: {
      userId_studyId: {
        userId: user.id,
        studyId,
      },
    },
  });

  if (existing) {
    // 좋아요가 있는 경우
    await prisma.scrap.delete({
      where: {
        userId_studyId: {
          userId: user.id,
          studyId,
        },
      },
    });

    await prisma.study.update({
      where: {
        id: studyId,
      },
      data: { scrap: { decrement: 1 } },
    });
    return { liked: false };
  } else {
    await prisma.scrap.create({
      data: {
        userId: user.id,
        studyId,
      },
    });

    await prisma.study.update({
      where: { id: studyId },
      data: { scrap: { increment: 1 } },
    });

    return { liked: true };
  }
}
