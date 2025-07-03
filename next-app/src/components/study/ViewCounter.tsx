"use client";
import { useEffect } from "react";

export default function ViewCounter({ id }: { id: number }) {
  useEffect(() => {
    fetch(`/api/studies/${id}/view`, {
      method: "PATCH",
    });
  }, [id]);

  return null;
}
