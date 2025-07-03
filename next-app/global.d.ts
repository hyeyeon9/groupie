// ./global.d.ts
import React from "react";
import { PrismaClient } from "@prisma/client";

declare global {
  // ✅ JSX 타입 오류 해결
  namespace JSX {
    type Element = React.ReactElement;
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  // ✅ Prisma 싱글톤 타입 선언
  let prisma: PrismaClient | undefined;
}
