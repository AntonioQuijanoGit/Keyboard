export interface KeyboardKey {
  normal: string;
  shifted: string;
  type: 'normal' | 'shift' | 'caps' | 'space' | 'empty';
}

export type KeyboardLayout = KeyboardKey[][];

