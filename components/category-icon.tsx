import {
  Armchair,
  Box,
  CircuitBoard,
  Cpu,
  Fan,
  Gpu,
  HardDrive,
  Headphones,
  Keyboard,
  LampDesk,
  Lightbulb,
  MemoryStick,
  Mic,
  Monitor,
  Mouse,
  Plug,
  RectangleHorizontal,
  Snowflake,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  cpu: Cpu,
  gpu: Gpu,
  board: CircuitBoard,
  ram: MemoryStick,
  storage: HardDrive,
  power: Plug,
  case: Box,
  fan: Fan,
  cooler: Snowflake,
  pad: RectangleHorizontal,
  monitor: Monitor,
  mouse: Mouse,
  keyboard: Keyboard,
  headset: Headphones,
  mic: Mic,
  rgb: Lightbulb,
  desk: LampDesk,
  chair: Armchair,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = CATEGORY_ICONS[name] ?? Cpu;
  return <Icon className={className} aria-hidden />;
}
