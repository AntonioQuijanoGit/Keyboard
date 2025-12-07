import { KeyboardKey, KeyboardLayout } from '../models/keyboard-key.model';

export const KEYBOARD_LAYOUT: KeyboardLayout = [
  [
    { normal: '1', shifted: '!', type: 'normal' },
    { normal: '2', shifted: '@', type: 'normal' },
    { normal: '3', shifted: '#', type: 'normal' },
    { normal: '4', shifted: '$', type: 'normal' },
    { normal: '5', shifted: '%', type: 'normal' },
    { normal: '6', shifted: '&', type: 'normal' },
    { normal: '7', shifted: '/', type: 'normal' },
    { normal: '8', shifted: '(', type: 'normal' },
    { normal: '9', shifted: ')', type: 'normal' },
    { normal: '0', shifted: '=', type: 'normal' },
    { normal: "'", shifted: '?', type: 'normal' },
    { normal: '¡', shifted: '¿', type: 'normal' },
    { normal: '', shifted: '', type: 'empty' }
  ],
  [
    { normal: '', shifted: '', type: 'empty' },
    { normal: 'q', shifted: 'Q', type: 'normal' },
    { normal: 'w', shifted: 'W', type: 'normal' },
    { normal: 'e', shifted: 'E', type: 'normal' },
    { normal: 'r', shifted: 'R', type: 'normal' },
    { normal: 't', shifted: 'T', type: 'normal' },
    { normal: 'y', shifted: 'Y', type: 'normal' },
    { normal: 'u', shifted: 'U', type: 'normal' },
    { normal: 'i', shifted: 'I', type: 'normal' },
    { normal: 'o', shifted: 'O', type: 'normal' },
    { normal: 'p', shifted: 'P', type: 'normal' },
    { normal: '`', shifted: '^', type: 'normal' },
    { normal: '+', shifted: '*', type: 'normal' }
  ],
  [
    { normal: 'CAPS', shifted: 'CAPS', type: 'caps' },
    { normal: 'a', shifted: 'A', type: 'normal' },
    { normal: 's', shifted: 'S', type: 'normal' },
    { normal: 'd', shifted: 'D', type: 'normal' },
    { normal: 'f', shifted: 'F', type: 'normal' },
    { normal: 'g', shifted: 'G', type: 'normal' },
    { normal: 'h', shifted: 'H', type: 'normal' },
    { normal: 'j', shifted: 'J', type: 'normal' },
    { normal: 'k', shifted: 'K', type: 'normal' },
    { normal: 'l', shifted: 'L', type: 'normal' },
    { normal: 'ñ', shifted: 'Ñ', type: 'normal' },
    { normal: '¨', shifted: '{', type: 'normal' },
    { normal: 'Ç', shifted: '}', type: 'normal' }
  ],
  [
    { normal: 'SHIFT', shifted: 'SHIFT', type: 'shift' },
    { normal: '<', shifted: '>', type: 'normal' },
    { normal: 'z', shifted: 'Z', type: 'normal' },
    { normal: 'x', shifted: 'X', type: 'normal' },
    { normal: 'c', shifted: 'C', type: 'normal' },
    { normal: 'v', shifted: 'V', type: 'normal' },
    { normal: 'b', shifted: 'B', type: 'normal' },
    { normal: 'n', shifted: 'N', type: 'normal' },
    { normal: 'm', shifted: 'M', type: 'normal' },
    { normal: ',', shifted: ';', type: 'normal' },
    { normal: '.', shifted: ':', type: 'normal' },
    { normal: '-', shifted: '_', type: 'normal' }
  ],
  [{ normal: 'SPACE', shifted: 'SPACE', type: 'space' }]
];

