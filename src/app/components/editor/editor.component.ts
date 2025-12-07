import { Component, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { TextStatsService, TextStats } from '../../services/text-stats.service';
import { NotificationService } from '../../services/notification.service';
import { EditorCommunicationService } from '../../services/editor-communication.service';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="editor-section" aria-label="Text editor">
      <div class="editor-wrapper">
        <label for="text-editor" class="visually-hidden">Text editor input</label>
        <textarea
          id="text-editor"
          class="text-editor"
          [(ngModel)]="content"
          (ngModelChange)="onContentChange($event)"
          placeholder="Start typing your notes here..."
          aria-label="Text editor"
          rows="8"
          spellcheck="true"
        ></textarea>
        <div class="editor-actions">
          <div class="text-stats" role="status" [attr.aria-live]="'polite'">
            <span class="stat-item">
              <span class="stat-label">Words:</span>
              <span class="stat-value">{{ stats().words }}</span>
            </span>
            <span class="stat-item">
              <span class="stat-label">Characters:</span>
              <span class="stat-value">{{ stats().characters }}</span>
            </span>
          </div>
          <div class="action-buttons">
            <button
              class="btn btn-secondary"
              (click)="onClear()"
              aria-label="Clear all text"
              title="Clear all"
              type="button"
            >
              Clear
            </button>
            <button
              class="btn btn-primary"
              (click)="onExport()"
              aria-label="Export text as file"
              title="Export as .txt"
              type="button"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .editor-section {
      width: 100%;
    }

    .editor-wrapper {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: var(--space-xl);
    }

    .text-editor {
      width: 100%;
      min-height: 280px;
      padding: var(--space-lg);
      font-family: var(--font-sans);
      font-size: var(--fs-base);
      line-height: 1.7;
      color: var(--color-text);
      background: transparent;
      border: none;
      border-radius: 0;
      resize: vertical;
      transition: all var(--transition);
      text-align: left;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .text-editor::placeholder {
      color: var(--color-text-secondary);
    }

    .text-editor:focus {
      outline: none;
    }

    .editor-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--space-md);
      gap: var(--space-md);
      flex-wrap: wrap;
    }

    .text-stats {
      display: flex;
      gap: var(--space-lg);
      font-size: var(--fs-sm);
      color: var(--color-text-secondary);
    }

    .stat-item {
      display: flex;
      gap: var(--space-xs);
    }

    .stat-label {
      font-weight: 400;
    }

    .stat-value {
      font-weight: 600;
      color: var(--color-text);
      min-width: 2ch;
      text-align: right;
    }

    .action-buttons {
      display: flex;
      gap: var(--space-sm);
    }

    .btn {
      padding: var(--space-sm) var(--space-lg);
      font-family: var(--font-sans);
      font-size: var(--fs-sm);
      font-weight: 500;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      cursor: pointer;
      transition: all var(--transition);
      min-width: 44px;
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      background: var(--color-surface);
      color: var(--color-text);
    }

    .btn:focus-visible {
      outline: 2px solid var(--color-text);
      outline-offset: 2px;
    }

    .btn-primary {
      background: var(--color-primary);
      color: var(--color-key-text-active);
      border-color: var(--color-primary);
    }

    .btn-primary:hover {
      background: var(--color-primary-hover);
      border-color: var(--color-primary-hover);
    }

    .btn:active {
      transform: scale(0.95);
    }

    .btn-secondary:hover {
      background: var(--color-key-bg-hover);
      border-color: var(--color-text);
    }

    @media (max-width: 768px) {
      .editor-wrapper {
        padding: var(--space-md);
      }

      .text-editor {
        min-height: 150px;
        font-size: var(--fs-sm);
      }

      .editor-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .text-stats {
        justify-content: space-between;
        width: 100%;
      }

      .action-buttons {
        width: 100%;
      }

      .btn {
        flex: 1;
      }
    }

    @media (max-width: 480px) {
      .text-stats {
        font-size: var(--fs-xs);
        gap: var(--space-md);
      }
    }
  `]
})
export class EditorComponent implements OnInit, OnDestroy {
  content = signal<string>('');
  stats = signal<TextStats>({ words: 0, characters: 0 });
  
  private autoSaveTimeout?: number;
  private insertTextSubscription?: Subscription;

  constructor(
    private storageService: StorageService,
    private textStatsService: TextStatsService,
    private notificationService: NotificationService,
    private editorCommunication: EditorCommunicationService
  ) {
    // Update stats when content changes
    effect(() => {
      const stats = this.textStatsService.calculateStats(this.content());
      this.stats.set(stats);
    });

    // Listen for text insertions from keyboard
    this.insertTextSubscription = this.editorCommunication.insertText$.subscribe((text) => {
      this.insertText(text);
    });
  }

  ngOnInit(): void {
    // Load saved content
    const saved = this.storageService.load();
    if (saved) {
      this.content.set(saved);
    }
  }

  ngOnDestroy(): void {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    this.insertTextSubscription?.unsubscribe();
  }

  onContentChange(newContent: string): void {
    this.content.set(newContent);
    
    // Auto-save with debounce
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    
    this.autoSaveTimeout = window.setTimeout(() => {
      this.storageService.save(newContent);
    }, 500);
  }

  onClear(): void {
    if (this.content().trim()) {
      if (confirm('Are you sure you want to clear all text?')) {
        this.content.set('');
        this.storageService.clear();
        this.notificationService.success('Text cleared');
      }
    }
  }

  onExport(): void {
    const text = this.content();
    if (!text.trim()) {
      this.notificationService.error('No text to export');
      return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quick-notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.notificationService.success('Text exported successfully');
  }

  // Method for keyboard component to update content
  private insertText(text: string): void {
    const textarea = document.getElementById('text-editor') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = this.content();
      const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
      
      this.content.set(newValue);
      
      // Focus and restore cursor position
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + text.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  }
}

