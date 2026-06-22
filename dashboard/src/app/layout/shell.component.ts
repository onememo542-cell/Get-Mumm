import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';
import { ToastComponent } from '../shared/components/toast.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, ToastComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <app-sidebar [open]="sidebarOpen()" (close)="sidebarOpen.set(false)" />
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <app-navbar (menuOpen)="sidebarOpen.set(true)" />
        <main class="flex-1 overflow-y-auto">
          <div class="max-w-screen-2xl mx-auto px-4 py-5 md:px-8 md:py-7">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
    <app-toast />
  `
})
export class ShellComponent {
  sidebarOpen = signal(false);
}
