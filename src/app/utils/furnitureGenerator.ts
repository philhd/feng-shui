export function generateFurniture(count: number): Furniture[] {
  const types = ["square", "circle", "rectangle"];
  return Array.from({ length: count }, (_, i) => ({
    id: `furniture-${i}`,
    x: Math.random() * window.innerWidth * 0.6,
    y: Math.random() * window.innerHeight * 0.8,
    width: Math.random() * 30 + 50,
    height: Math.random() * (Math.random() < 0.5 ? 30 : 60) + 40,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    type: types[i % types.length],
  }));
}
