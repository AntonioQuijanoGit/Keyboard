import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardKeyComponent } from '../keyboard-key/keyboard-key.component';
import { KEYBOARD_LAYOUT } from '../../constants/keyboard-layout';
import { KeyboardKey } from '../../models/keyboard-key.model';
import { EditorCommunicationService } from '../../services/editor-communication.service';

@Component({
  selector: 'app-virtual-keyboard',
  standalone: true,
  imports: [CommonModule, KeyboardKeyComponent],
  template: `
    <section
      class="keyboard-section"
      aria-label="Virtual keyboard"
      [attr.aria-hidden]="!isVisible()"
    >
      <div class="keyboard-header">
        <h2 class="keyboard-title">Virtual Keyboard</h2>
        <button
          class="keyboard-toggle"
          (click)="toggleVisibility()"
          [attr.aria-label]="'Toggle keyboard visibility'"
          [attr.aria-expanded]="isVisible()"
          [title]="isVisible() ? 'Hide keyboard' : 'Show keyboard'"
          type="button"
        >
          <span class="toggle-icon" aria-hidden="true">⌨️</span>
          <span class="toggle-text">{{ isVisible() ? 'Hide' : 'Show' }}</span>
        </button>
      </div>
      <div
        *ngIf="isVisible()"
        id="keyboard-container"
        class="keyboard-container"
        role="group"
        aria-label="Virtual keyboard"
      >
        <div
          *ngFor="let layer of layout; let layerIndex = index"
          class="layer"
          [attr.data-layer]="layerIndex"
        >
          <app-keyboard-key
            *ngFor="let key of layer; let keyIndex = index"
            [key]="key"
            [isShiftActive]="isShiftActive()"
            [isCapsActive]="isCapsActive()"
            [isActivated]="
              (key.type === 'shift' && isShiftActive()) ||
              (key.type === 'caps' && isCapsActive())
            "
            [displayText]="getDisplayText(key)"
            (click)="handleKeyClick(key)"
          />
        </div>
      </div>
    </section>
  `,
  styles: [`
    .keyboard-section {
      width: 100%;
    }

    .keyboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
      padding-bottom: var(--space-md);
      border-bottom: 1px solid var(--color-border);
    }

    .keyboard-title {
      font-family: var(--font-display);
      font-size: var(--fs-lg);
      font-weight: 600;
      color: var(--color-text);
    }

    .keyboard-toggle {
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: var(--space-sm) var(--space-md);
      cursor: pointer;
      font-size: var(--fs-sm);
      font-weight: 500;
      color: var(--color-text);
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      transition: all var(--transition);
      min-width: 44px;
      min-height: 44px;
    }

    .keyboard-toggle:hover {
      background: var(--color-key-bg-hover);
      border-color: var(--color-text);
    }

    .keyboard-toggle:focus-visible {
      outline: 2px solid var(--color-text);
      outline-offset: 2px;
    }

    .keyboard-toggle:active {
      transform: scale(0.95);
    }

    .toggle-icon {
      font-size: 1rem;
    }

    .keyboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      max-width: 900px;
      margin: 0 auto;
      padding: var(--space-xl);
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
    }

    .layer {
      display: flex;
      gap: var(--space-sm);
      justify-content: center;
      width: 100%;
      flex-wrap: wrap;
    }

    @media (max-width: 1024px) {
      .keyboard-container {
        padding: var(--space-md);
      }
    }

    @media (max-width: 768px) {
      .keyboard-title {
        font-size: var(--fs-base);
      }

      .keyboard-container {
        padding: var(--space-sm);
        gap: var(--space-xs);
      }

      .layer {
        gap: var(--space-xs);
      }
    }
  `]
})
export class VirtualKeyboardComponent implements OnInit {
  layout = KEYBOARD_LAYOUT;
  isShiftActive = signal<boolean>(false);
  isCapsActive = signal<boolean>(false);
  isVisible = signal<boolean>(true);

  constructor(private editorCommunication: EditorCommunicationService) {}

  ngOnInit(): void {
    // Component initialized
  }

  toggleVisibility(): void {
    this.isVisible.update(v => !v);
  }

  getDisplayText(key: KeyboardKey): string {
    if (key.type === 'shift') return 'SHIFT';
    if (key.type === 'caps') return 'CAPS';
    if (key.type === 'space') return '';
    if (key.type === 'empty') return '';

    if (this.isShiftActive() || (this.isCapsActive() && this.isLetter(key.normal))) {
      return key.shifted;
    }

    return key.normal;
  }

  handleKeyClick(key: KeyboardKey): void {
    if (key.type === 'shift') {
      this.isShiftActive.update(v => !v);
      return;
    }

    if (key.type === 'caps') {
      this.isCapsActive.update(v => !v);
      return;
    }

    if (key.type === 'space') {
      this.insertText(' ');
      return;
    }

    if (key.type === 'normal' || key.type === 'empty') {
      const text = this.getDisplayText(key);
      if (text) {
        this.insertText(text);
        
        // Auto-release shift after typing
        if (this.isShiftActive()) {
          this.isShiftActive.set(false);
        }
      }
    }
  }

  private insertText(text: string): void {
    this.editorCommunication.insertText(text);
  }

  private isLetter(char: string): boolean {
    if (!char) return false;
    const code = char.toLowerCase().charCodeAt(0);
    return code >= 97 && code <= 122;
  }
}

