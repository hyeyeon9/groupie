import { Lucia } from "lucia";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

// 타입 선언도 꼭 해주기
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      userId: string;
      nickname: string;
    };
    UserId: number;
  }
}

// 세션 생성하기
export async function createAuthSession(userId: number) {
  const session = await lucia.createSession(userId, {});
  const sessionCookies = lucia.createSessionCookie(session.id);

  // 쿠키 설정
  (
    await // 쿠키 설정
    cookies()
  ).set(sessionCookies.name, sessionCookies.value, sessionCookies.attributes);
}

// 쿠키가 유효한지 검사
export async function verifyAuth() {
  const sessionCookie = (await cookies()).get(lucia.sessionCookieName);

  if (!sessionCookie) {
    return {
      user: null,
      session: null,
    };
  }

  // 쿠키가 있다면 쿠키안의 세션 아이디를 가져오자.
  const sessionId = sessionCookie.value;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  // 데이터베이스에 해당 ID를 가진 세션을 찾아 세션이 유효한지 확인함
  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    // 세션이 없는 경우에는 삭제
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}

  return result;
}

// 세션 지우기 (로그아웃)
export async function destroySession() {
  // 해당 사용자에 대한 세션과 세션쿠키를 종료하는 작업
  const { session } = await verifyAuth();
  if (!session) {
    return {
      error: "Unauthorised!",
    };
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
