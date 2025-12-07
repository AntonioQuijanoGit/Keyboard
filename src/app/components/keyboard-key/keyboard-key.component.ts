import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardKey } from '../../models/keyboard-key.model';

@Component({
  selector: 'app-keyboard-key',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      *ngIf="key.type !== 'empty'"
      class="key"
      [class.key-normal]="key.type === 'normal'"
      [class.key-shift]="key.type === 'shift'"
      [class.key-caps]="key.type === 'caps'"
      [class.key-space]="key.type === 'space'"
      [class.activated]="isActivated"
      (click)="onClick()"
      [attr.aria-label]="getAriaLabel()"
      [title]="getDisplayText()"
      type="button"
    >
      {{ getDisplayText() }}
    </button>
    <div *ngIf="key.type === 'empty'" class="key-empty" aria-hidden="true"></div>
  `,
  styles: [`
    .key {
      background: var(--color-key-bg);
      color: var(--color-key-text);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-family: var(--font-sans);
      font-weight: 500;
      font-size: var(--fs-sm);
      transition: all var(--transition);
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      min-width: 44px;
      min-height: 44px;
      touch-action: manipulation;
    }

    .key:focus-visible {
      outline: 2px solid var(--color-text);
      outline-offset: 2px;
      z-index: 1;
    }

    .key:hover:not(.key-empty) {
      background: var(--color-key-bg-hover);
    }

    .key:active:not(.key-empty) {
      transform: scale(0.95);
    }

    .key.activated {
      background: var(--color-key-bg-active);
      color: var(--color-key-text-active);
      border-color: var(--color-key-bg-active);
    }

    .key-normal {
      width: 50px;
      height: 50px;
    }

    .key-shift,
    .key-caps {
      width: 90px;
      height: 50px;
      font-size: var(--fs-xs);
    }

    .key-space {
      width: 400px;
      height: 50px;
      min-width: 200px;
      position: relative;
    }

    .key-space::after {
      content: 'SPACE';
      position: absolute;
      font-size: var(--fs-xs);
      opacity: 0.6;
      font-weight: 500;
    }

    .key-empty {
      width: 20px;
      height: 50px;
      background: transparent;
      border: none;
      box-shadow: none;
      cursor: default;
      pointer-events: none;
    }

    @media (max-width: 1024px) {
      .key-normal {
        width: 48px;
        height: 48px;
      }

      .key-shift,
      .key-caps {
        width: 85px;
        height: 48px;
      }

      .key-space {
        width: 350px;
        height: 48px;
      }
    }

    @media (max-width: 768px) {
      .key-normal {
        width: 44px;
        height: 44px;
        font-size: var(--fs-xs);
      }

      .key-shift,
      .key-caps {
        width: 75px;
        height: 44px;
        font-size: 10px;
      }

      .key-space {
        width: 100%;
        height: 44px;
        min-width: 100%;
      }

      .key-empty {
        width: 8px;
        height: 44px;
      }
    }

    @media (max-width: 480px) {
      .key-normal {
        width: 40px;
        height: 44px;
      }

      .key-shift,
      .key-caps {
        width: 65px;
        height: 44px;
      }
    }
  `]
})
export class KeyboardKeyComponent {
  @Input({ required: true }) key!: KeyboardKey;
  @Input() isShiftActive = false;
  @Input() isCapsActive = false;
  @Input() isActivated = false;
  @Input() displayText = '';

  onClick(): void {
    // Event will be handled by parent component
  }

  getDisplayText(): string {
    if (this.displayText) {
      return this.displayText;
    }
    
    if (this.key.type === 'shift') return 'SHIFT';
    if (this.key.type === 'caps') return 'CAPS';
    if (this.key.type === 'space') return '';
    
    if (this.isShiftActive || (this.isCapsActive && this.isLetter(this.key.normal))) {
      return this.key.shifted;
    }
    
    return this.key.normal;
  }

  getAriaLabel(): string {
    if (this.key.type === 'shift') return 'Shift key';
    if (this.key.type === 'caps') return 'Caps Lock key';
    if (this.key.type === 'space') return 'Space bar';
    return `Key: ${this.getDisplayText()}`;
  }

  private isLetter(char: string): boolean {
    const code = char.toLowerCase().charCodeAt(0);
    return code >= 97 && code <= 122;
  }
}

