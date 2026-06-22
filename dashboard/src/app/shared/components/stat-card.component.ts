import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="card p-4 md:p-6 flex items-start gap-3 md:gap-4 hover:shadow-md transition-shadow"
         role="region" [attr.aria-label]="label + ': ' + value">
      <div [class]="iconBg + ' w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl flex-shrink-0'"
           aria-hidden="true">
        {{ icon }}
      </div>
      <div class="min-w-0">
        <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">{{ label }}</p>
        <p class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{{ value | number }}</p>
        @if (sub) {
          <p class="text-xs text-gray-400 mt-0.5 truncate">{{ sub }}</p>
        }
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() icon    = '📊';
  @Input() label   = '';
  @Input() value: number = 0;
  @Input() sub     = '';
  @Input() iconBg  = 'bg-primary-50 dark:bg-primary-900/20';
}
