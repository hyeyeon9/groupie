import { format, formatDistanceToNowStrict } from "date-fns";
import { ko } from "date-fns/locale";

export function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSec = diffInMs / 1000; // 1000ms 여서
  const diffInDay = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInSec < 60) {
    return "방금 전";
  }

  if (diffInDay < 3) {
    return formatDistanceToNowStrict(date, { locale: ko, addSuffix: true });
  }

  return format(date, "yyyy.MM.dd");
}

export const getToday = (() => {
  let cachedToday: Date | null = null;
  let lastCheck = 0;

  return () => {
    const now = Date.now();
    // 5분마다만 새로 계산 (캐싱)
    if (!cachedToday || now - lastCheck > 5 * 60 * 1000) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      cachedToday = date;
      lastCheck = now;
    }
    return cachedToday;
  };
})();
