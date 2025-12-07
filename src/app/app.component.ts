import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { EditorComponent } from './components/editor/editor.component';
import { VirtualKeyboardComponent } from './components/virtual-keyboard/virtual-keyboard.component';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    EditorComponent,
    VirtualKeyboardComponent,
    NotificationComponent
  ],
  template: `
    <div class="app-container">
      <app-header />
      <main class="app-main" role="main">
        <app-editor />
        <app-virtual-keyboard />
      </main>
      <app-notification />
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .app-main {
      display: flex;
      flex-direction: column;
      gap: var(--space-2xl);
    }

    @media (max-width: 768px) {
      .app-main {
        gap: var(--space-xl);
      }
    }
  `]
})
export class AppComponent {
  title = 'Quick Notes Editor';
}

