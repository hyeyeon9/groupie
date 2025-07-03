"use client";

import { useEffect, useState } from "react";

export function useResponsiveGrid() {
  const [grid, setGrid] = useState({
    columnCount: 3,
    cardWidth: 387,
    cardHeight: 270,
    gridWidth: (387 + 24) * 3,
  });

  useEffect(() => {
    function updateGrid() {
      const width = window.innerWidth;
      if (width < 640) {
        // 모바일
        setGrid({
          columnCount: 1,
          cardWidth: width - 40, // 패딩값 빼고 가득
          cardHeight: 265, // 모바일 카드 높이
          gridWidth: width ,
        });
      } else {
        // PC
        setGrid({
          columnCount: 3,
          cardWidth: 387,
          cardHeight: 270,
          gridWidth: (387 + 24) * 3,
        });
      }
    }

    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  return grid;
}
