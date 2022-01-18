export interface WeatehrData {
  precipitation: number[];
  time: string[];
  temperature_2m: number[];
}

export interface ChartTrace {
  name: string;
  type: string;
  x: string[] | number[];
  y: number[];
  mode: string;
}
