import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center py-20 text-center">
      <div class="text-5xl mb-4">{{ icon }}</div>
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">{{ title }}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon = '📭';
  @Input() title = 'No data found';
  @Input() message = 'Nothing to display here yet.';
}
