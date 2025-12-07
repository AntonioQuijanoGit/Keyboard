import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="notification"
      class="notification"
      [class.show]="isVisible"
      [class.success]="notification?.type === 'success'"
      [class.error]="notification?.type === 'error'"
      [class.info]="notification?.type === 'info'"
      role="alert"
      [attr.aria-live]="'assertive'"
      [attr.aria-atomic]="'true'"
    >
      <span class="notification-text">{{ notification?.message }}</span>
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      bottom: var(--space-lg);
      right: var(--space-lg);
      padding: var(--space-md) var(--space-lg);
      background: var(--color-surface-elevated);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      opacity: 0;
      transform: translateY(20px);
      transition: all var(--transition-base);
      pointer-events: none;
      z-index: 1000;
      max-width: 300px;
    }

    .notification.show {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .notification.success {
      border-color: var(--color-success);
      background: var(--color-success);
      color: #ffffff;
    }

    .notification.error {
      border-color: var(--color-error);
      background: var(--color-error);
      color: #ffffff;
    }

    .notification.info {
      border-color: var(--color-primary);
      background: var(--color-primary);
      color: #ffffff;
    }

    .notification-text {
      display: block;
      font-size: var(--fs-sm);
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .notification {
        bottom: var(--space-md);
        right: var(--space-md);
        left: var(--space-md);
        max-width: none;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification: { message: string; type: 'success' | 'error' | 'info' } | null = null;
  isVisible = false;
  private subscription?: Subscription;
  private timeoutId?: number;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe((notification) => {
      this.notification = notification;
      this.isVisible = true;

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      const duration = notification.duration || 3000;
      this.timeoutId = window.setTimeout(() => {
        this.isVisible = false;
        setTimeout(() => {
          this.notification = null;
        }, 300); // Wait for fade out animation
      }, duration);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}

