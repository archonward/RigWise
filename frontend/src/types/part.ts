export interface Part {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  performanceScore: number;
  powerDraw: number | null;
  socket: string | null;
  chipset: string | null;
  memoryType: string | null;
  notes: string | null;
}
