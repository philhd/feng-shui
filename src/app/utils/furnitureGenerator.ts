export function generateFurniture(count: number): Furniture[] {
  const types = ["square", "circle", "rectangle"] as const;

  return Array.from({ length: count }, (_, i) => ({
    id: `furniture-${i}`,
    x: Math.random() * window.innerWidth * 0.6,
    y: Math.random() * window.innerHeight * 0.8,
    width: Math.random() * 50 + 50,
    height:
      Math.random() * (types[i % types.length] === "circle" ? 50 : 100) + 50,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    type: types[i % types.length],
  }));
}
