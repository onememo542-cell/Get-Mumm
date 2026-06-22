import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgIconComponent],
  template: `
    <div class="card p-4 md:p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
         role="region" [attr.aria-label]="label + ': ' + value">
      <div [class]="iconBg + ' w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0'">
        <ng-icon [name]="iconName" size="22" [class]="iconColor" />
      </div>
      <div class="min-w-0">
        <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium truncate">{{ label }}</p>
        <p class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">{{ value | number }}</p>
        @if (sub) {
          <p class="text-xs text-gray-400 mt-0.5 truncate">{{ sub }}</p>
        }
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() iconName  = 'lucideBarChart2';
  @Input() iconColor = 'text-primary-600 dark:text-primary-400';
  @Input() label     = '';
  @Input() value: number = 0;
  @Input() sub       = '';
  @Input() iconBg    = 'bg-primary-50 dark:bg-primary-900/20';
}
