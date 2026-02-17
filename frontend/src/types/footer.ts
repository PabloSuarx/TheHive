export interface Link {
  id: number;
  label: string;
  url: string;
  column: string;
  order: number;
}
export interface Social {
  id: number;
  platform: string;
  url: string;
  icon: string;
}
export interface LinksByColumn {
  [key: string]: Link[];
}