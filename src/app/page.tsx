"use client";

import { useState, useCallback } from "react";
import { generateFurniture } from "./utils/furnitureGenerator";

interface Furniture {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: "square" | "circle" | "rectangle";
}

export default function Home() {
  const [furniture, setFurniture] = useState<Furniture[]>(
    generateFurniture(10),
  );
  const [visualAppeal, setVisualAppeal] = useState<number>(50);
  const [activePiece, setActivePiece] = useState<string | null>(null);
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  // Store the initial mouse position relative to the piece
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  // Event handlers for drag-and-drop functionality
  const handleMouseDown = (e: React.MouseEvent, pieceId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (mouseDown) return;

    setMouseDown(true);
    setActivePiece(pieceId);

    // Calculate offset to keep the drag point consistent
    const rect = e.currentTarget.getBoundingClientRect();
    setOffsetX(e.clientX - rect.left);
    setOffsetY(e.clientY - rect.top);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!mouseDown || !activePiece) return;

      // Calculate new position based on mouse coordinates
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      setFurniture(
        furniture.map((piece) => {
          if (piece.id === activePiece) {
            return { ...piece, x: newX, y: newY };
          }
          return piece;
        }),
      );
    },
    [mouseDown, activePiece, offsetX, offsetY, furniture],
  );

  const handleMouseUp = () => {
    setMouseDown(false);
    setActivePiece(null);
    calculateVisualAppeal();
  };

  // Calculate visual appeal based on furniture arrangement
  const calculateVisualAppeal = useCallback(() => {
    let appeal = 50;

    for (let i = 0; i < furniture.length; i++) {
      const piece1 = furniture[i];
      for (let j = i + 1; j < furniture.length; j++) {
        const piece2 = furniture[j];

        // Calculate distance between pieces
        const dx = piece1.x - piece2.x;
        const dy = piece1.y - piece2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Penalize if pieces are too close
        if (distance < 50) {
          appeal -= 2;
        }

        // Reward for color similarity
        const colorDiff = Math.abs(
          parseInt(piece1.color.replace("#", ""), 16) -
            parseInt(piece2.color.replace("#", ""), 16),
        );

        if (colorDiff < 50) {
          appeal += 1;
        }
      }
    }

    // Keep appeal within bounds
    appeal = Math.max(0, Math.min(100, appeal));
    setVisualAppeal(appeal);
  }, [furniture]);

  return (
    <div className="min-h-screen bg-Gray-100">
      <div className="flex h-screen">
        {/* Left side: Furniture arrangement area */}
        <div className="flex-1 p-8 relative" style={{ width: "70%" }}>
          {furniture.map((piece) => (
            <div
              key={piece.id}
              className="absolute cursor-grab"
              onMouseDown={(e) => handleMouseDown(e, piece.id)}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                width: `${piece.width}px`,
                height: `${piece.height}px`,
                backgroundColor: piece.color,
                borderRadius: piece.type === "circle" ? "50%" : "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transform: `translate(${piece.x}px, ${piece.y}px)`,
              }}
            >
              {piece.type}
            </div>
          ))}
        </div>

        {/* Right side: Feng Shui meter */}
        <div className="w-32 p-8 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-4 w-full">
            <h2 className="text-2xl font-bold mb-4">Feng Shui Meter</h2>
            <div className="h-[16rem] bg-gray-200 rounded relative overflow-hidden">
              <div
                className="w-full bg-blue-500 transition-all duration-300"
                style={{ height: `${visualAppeal}%` }}
              ></div>
            </div>
            <div className="text-center mt-4">{visualAppeal.toFixed(0)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
