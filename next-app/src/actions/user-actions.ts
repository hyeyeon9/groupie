// /actions/user-actions.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function updateUserProfileImage(userId: number, url: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { profileImage: url },
  });
}
