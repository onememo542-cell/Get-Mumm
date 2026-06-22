import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center py-20 text-center" role="alert">
      <div class="text-5xl mb-4">⚠️</div>
      <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">{{ title }}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ message }}</p>
      @if (retryable) {
        <button class="btn-primary" (click)="retry.emit()">Try Again</button>
      }
    </div>
  `
})
export class ErrorStateComponent {
  @Input() title = 'Something went wrong';
  @Input() message = 'Failed to load data. Please try again.';
  @Input() retryable = true;
  @Output() retry = new EventEmitter<void>();
}
