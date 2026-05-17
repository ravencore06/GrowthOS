"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const platforms = [
  { id: "instagram", letter: "IG" },
  { id: "twitter", letter: "X" },
  { id: "youtube", letter: "YT" },
  { id: "snapchat", letter: "SC" },
  { id: "pinterest", letter: "PI" },
  { id: "whatsapp", letter: "WA" },
];

function GridTile({ letter, className }: { letter: string; className?: string }) {
  return (
    <div className={`relative rounded-2xl bg-zinc-900/40 border border-white/[0.03] flex items-center justify-center ${className}`}>
      <span className="text-xs font-bold text-zinc-600 tracking-wider">{letter}</span>
    </div>
  );
}

export function StaggeredGridBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(7);

  useEffect(() => {
    const updateCols = () => {
      setCols(window.innerWidth < 640 ? 3 : window.innerWidth < 1024 ? 5 : 7);
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const speeds = [-0.3, 0.2, -0.4, 0.3, -0.2, 0.4, -0.3];
  const columnTransforms = speeds.map((s) => useTransform(scrollYProgress, [0, 1], [0, s * 200]));

  const tiles: { col: number; row: number }[] = [];
  for (let c = 0; c < cols; c++) {
    const count = 10;
    for (let r = 0; r < count; r++) {
      tiles.push({ col: c, row: r });
    }
  }

  const columns: { col: number; tiles: { row: number; platformIdx: number }[] }[] = [];
  for (let c = 0; c < cols; c++) {
    const colTiles = tiles.filter((t) => t.col === c);
    columns.push({
      col: c,
      tiles: colTiles.map((t) => ({
        row: t.row,
        platformIdx: (c + t.row) % platforms.length,
      })),
    });
  }

  const heights = ["h-32", "h-36", "h-28", "h-40", "h-32"];

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <div className="grid gap-3 px-3 pb-40 pt-20" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {columns.map((column, ci) => (
          <motion.div key={ci} style={{ y: columnTransforms[ci] }} className="flex flex-col gap-3">
            {column.tiles.map((tile, ti) => {
              const { letter } = platforms[tile.platformIdx];
              return (
                <GridTile
                  key={`${ci}-${ti}`}
                  letter={letter}
                  className={heights[(ci + ti) % heights.length]}
                />
              );
            })}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
