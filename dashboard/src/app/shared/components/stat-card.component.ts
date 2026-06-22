import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div [class]="iconBg + ' w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0'">
        {{ icon }}
      </div>
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ label }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value | number }}</p>
        <p *ngIf="sub" class="text-xs text-gray-400 mt-1">{{ sub }}</p>
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() icon = '📊';
  @Input() label = '';
  @Input() value: number = 0;
  @Input() sub = '';
  @Input() iconBg = 'bg-primary-50 dark:bg-primary-900/20';
}
