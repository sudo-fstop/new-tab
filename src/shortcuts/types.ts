export interface Shortcut {
  key: string;
  ctrl?: boolean;
  description: string;
  handler: (e: KeyboardEvent) => void;
}
