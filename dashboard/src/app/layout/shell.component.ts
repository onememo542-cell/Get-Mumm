import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';
import { ToastComponent } from '../shared/components/toast.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, ToastComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <app-sidebar [open]="sidebarOpen()" (close)="sidebarOpen.set(false)" />
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <app-navbar (menuOpen)="sidebarOpen.set(true)" />
        <main class="flex-1 overflow-y-auto p-4 md:p-6">
          <router-outlet />
        </main>
      </div>
    </div>
    <app-toast />
  `
})
export class ShellComponent {
  sidebarOpen = signal(false);
}
