import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header" role="banner">
      <div class="header-content">
        <h1 class="app-title">Quick Notes Editor</h1>
        <p class="app-subtitle">Accessible writing with virtual keyboard</p>
      </div>
      <button
        class="theme-toggle"
        (click)="onToggleTheme()"
        [attr.aria-label]="'Toggle ' + (themeService.currentTheme() === 'light' ? 'dark' : 'light') + ' mode'"
        title="Toggle theme"
        type="button"
      >
        <span class="theme-icon" aria-hidden="true">
          {{ themeService.currentTheme() === 'light' ? '🌙' : '☀️' }}
        </span>
      </button>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3xl);
      padding-bottom: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .header-content {
      flex: 1;
    }

    .app-title {
      font-family: var(--font-display);
      font-size: var(--fs-2xl);
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: var(--space-xs);
      line-height: 1.2;
      letter-spacing: -0.03em;
    }

    .app-subtitle {
      font-size: var(--fs-sm);
      color: var(--color-text-secondary);
      font-weight: 400;
    }

    .theme-toggle {
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: var(--space-sm);
      cursor: pointer;
      font-size: var(--fs-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      transition: all var(--transition);
    }

    .theme-toggle:hover {
      background: var(--color-key-bg-hover);
      border-color: var(--color-text);
    }

    .theme-toggle:focus-visible {
      outline: 2px solid var(--color-text);
      outline-offset: 2px;
    }

    .theme-toggle:active {
      transform: scale(0.95);
    }

    .theme-icon {
      font-size: 1.2rem;
      line-height: 1;
    }

    @media (max-width: 768px) {
      .app-header {
        flex-direction: column;
        gap: var(--space-md);
        align-items: flex-start;
      }

      .app-title {
        font-size: var(--fs-xl);
      }
    }

    @media (max-width: 480px) {
      .app-title {
        font-size: var(--fs-lg);
      }

      .app-subtitle {
        font-size: var(--fs-xs);
      }
    }
  `]
})
export class HeaderComponent {
  constructor(public themeService: ThemeService) {}

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

