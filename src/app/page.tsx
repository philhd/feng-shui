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

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [activeItem, setActiveItem] = useState<Furniture | null>(null);
  const [mouseOffsetX, setMouseOffsetX] = useState(0);
  const [mouseOffsetY, setMouseOffsetY] = useState(0);

  // Calculate visual appeal
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

        if (distance < 100) {
          appeal -= 1;
        }

        // Color similarity
        const colorDiff = Math.abs(
          parseInt(piece1.color.replace("#", ""), 16) -
            parseInt(piece2.color.replace("#", ""), 16),
        );

        if (colorDiff < 50) {
          appeal += 1;
        }
      }
    }

    setVisualAppeal(Math.max(0, Math.min(100, appeal)));
  }, [furniture]);

  // Drag and drop handlers
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, id: string) => {
      event.preventDefault();

      const piece = furniture.find((item) => item.id === id);
      if (!piece) return;

      const rect = event.currentTarget.getBoundingClientRect();
      setMouseOffsetX(event.clientX - rect.left - piece.x);
      setMouseOffsetY(event.clientY - rect.top - piece.y);
      setIsDragging(true);
      setActiveItem(piece);
    },
    [furniture],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      const newFurniture = furniture.map((item) => {
        if (activeItem?.id === item.id) {
          return {
            ...item,
            x: event.clientX - mouseOffsetX,
            y: event.clientY - mouseOffsetY,
          };
        }
        return item;
      });

      setFurniture(newFurniture);
      calculateVisualAppeal();
    },
    [isDragging, activeItem?.id, mouseOffsetX, mouseOffsetY],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setActiveItem(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Left side: Furniture arrangement area */}
        <div
          className="flex-1 p-8 relative"
          style={{ width: "70%" }}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {furniture.map((piece) => (
            <div
              key={piece.id}
              className="absolute cursor-Grab active:cursor-grabbing hover:bg-opacity-80"
              style={{
                width: `${piece.width}px`,
                height: `${piece.height}px`,
                backgroundColor: piece.color,
                borderRadius: piece.type === "circle" ? "50%" : "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onMouseDown={(e) => handleMouseDown(e, piece.id)}
              onMouseMove={handleMouseMove}
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
