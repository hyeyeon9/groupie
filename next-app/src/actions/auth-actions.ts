"use server";

import { createAuthSession, destroySession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

export type FormState = {
  errors?: {
    id?: string;
    password?: string;
    nickname?: string;
  };
  success?: boolean;
};

export async function signup(prevState: FormState, formData: FormData) {
  const userId = formData.get("id") as string;
  const password = formData.get("password") as string;
  const nickname = formData.get("nickname") as string;

  // 데이터 검증하기
  const errors: FormState["errors"] = {};

  if (!userId) {
    errors.id = "아이디를 입력해주세요.";
  }

  if (!password || password.trim().length < 8) {
    errors.password = "비밀번호는 최소 8자리입니다.";
  }

  if (!nickname) {
    errors.nickname = "닉네임을 입력해주세요.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  // 해시처리해서 암호화하기
  const hashedPassword = hashUserPassword(password);
  try {
    // 아이디가 중복이 아니라면
    // 유저 테이블에 아이디/비밀번호/닉네임 저장하기
    await prisma.user.create({
      data: {
        userId,
        password: hashedPassword,
        nickname,
        profileImage:
          "https://avatarimage2.s3.ap-northeast-2.amazonaws.com/avatars/ChatGPTImage.png",
      },
    });

    return {
      success: true,
    };
  } catch (err: unknown) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return {
        errors: { id: "이미 사용 중인 아이디입니다." },
      };
    }
    throw err;
  }
}

export async function login(prevState: FormState, formData: FormData) {
  const userId = formData.get("id") as string;
  const password = formData.get("password") as string;

  const existingUser = await prisma.user.findUnique({
    where: { userId: userId }, // 입력된 userId로 데이터베이스에 해당 정보가 있는지 확인
  });

  if (!existingUser) {
    return {
      errors: {
        id: "아이디를 다시 확인해주세요.",
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);
  if (!isValidPassword) {
    return {
      errors: {
        password: "비밀번호를 다시 확인해주세요.",
      },
    };
  }

  // 루시아를 통해 세션 만들기
  await createAuthSession(existingUser.id);
  return {
    success: true,
  };
}

export async function logout() {
  await destroySession();
  redirect("/?mode=login");
}
