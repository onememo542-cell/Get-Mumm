import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white min-w-[280px] max-w-xs animate-slide-up"
             [class]="bgClass(toast.type)"
             (click)="toastService.dismiss(toast.id)">
          <span>{{ icon(toast.type) }}</span>
          <span>{{ toast.message }}</span>
          <button class="ml-auto opacity-70 hover:opacity-100">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-up {
      from { transform: translateY(20px); opacity: 0; }
      to   { transform: translateY(0);   opacity: 1; }
    }
    .animate-slide-up { animation: slide-up .2s ease-out; }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  bgClass(type: string): string {
    return { success: 'bg-green-600', error: 'bg-red-600', warning: 'bg-amber-600', info: 'bg-blue-600' }[type] ?? 'bg-gray-700';
  }

  icon(type: string): string {
    return { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }[type] ?? '•';
  }
}
