import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { SubscriptionDto, CreateSubscriptionRequest, UpdateSubscriptionRequest } from '../../models';
import { LoadingComponent } from '../../shared/components/loading.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, EmptyStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ items().length }} active subscriptions</p>
        </div>
        <button class="btn-primary" (click)="showCreate.set(true)">+ New Subscription</button>
      </div>

      <!-- Create form -->
      @if (showCreate()) {
        <div class="card p-6">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">New Subscription</h3>
          <form (ngSubmit)="create()" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="label">User ID</label>
              <input type="text" class="input" [(ngModel)]="form.userId" name="userId" required placeholder="UUID" />
            </div>
            <div>
              <label class="label">Type</label>
              <select class="input" [(ngModel)]="form.type" name="type" required>
                <option value="">Select type</option>
                <option>Weekly</option><option>Monthly</option><option>Quarterly</option><option>Annual</option>
              </select>
            </div>
            <div>
              <label class="label">Start Date</label>
              <input type="date" class="input" [(ngModel)]="form.startDate" name="startDate" required />
            </div>
            <div>
              <label class="label">End Date</label>
              <input type="date" class="input" [(ngModel)]="form.endDate" name="endDate" required />
            </div>
            <div class="sm:col-span-2 flex gap-3">
              <button type="submit" class="btn-primary" [disabled]="saving()">
                @if (saving()) { ⟳ } Create
              </button>
              <button type="button" class="btn-secondary" (click)="showCreate.set(false)">Cancel</button>
            </div>
          </form>
        </div>
      }

      @if (loading()) {
        <app-loading />
      } @else if (items().length === 0) {
        <app-empty-state icon="🔔" title="No subscriptions" message="No subscriptions yet." />
      } @else {
        <div class="card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="table-header text-left">ID</th>
                  <th class="table-header text-left">User</th>
                  <th class="table-header text-left">Type</th>
                  <th class="table-header text-left">Status</th>
                  <th class="table-header text-left">Start</th>
                  <th class="table-header text-left">End</th>
                  <th class="table-header text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (sub of items(); track sub.id) {
                  <tr class="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td class="table-cell font-mono text-xs text-gray-400">{{ sub.id.slice(0,8) }}…</td>
                    <td class="table-cell font-mono text-xs">{{ sub.userId.slice(0,8) }}…</td>
                    <td class="table-cell">
                      <span class="badge bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">{{ sub.type }}</span>
                    </td>
                    <td class="table-cell">
                      <span class="badge" [class]="statusBadge(sub.status)">{{ sub.status }}</span>
                    </td>
                    <td class="table-cell">{{ sub.startDate | date:'mediumDate' }}</td>
                    <td class="table-cell">{{ sub.endDate | date:'mediumDate' }}</td>
                    <td class="table-cell">
                      <button class="text-red-500 hover:text-red-700 text-xs font-medium" (click)="deleteSub(sub.id)">Delete</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class SubscriptionsComponent implements OnInit {
  private api   = inject(ApiService);
  private toast = inject(ToastService);

  loading    = signal(true);
  saving     = signal(false);
  showCreate = signal(false);
  items      = signal<SubscriptionDto[]>([]);

  form: CreateSubscriptionRequest = { userId: '', type: '', startDate: '', endDate: '' };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.getSubscriptions().subscribe({
      next: r => { this.items.set(r); this.loading.set(false); },
      error: () => { this.toast.error('Failed to load subscriptions'); this.loading.set(false); }
    });
  }

  create(): void {
    this.saving.set(true);
    this.api.createSubscription(this.form).subscribe({
      next: () => { this.toast.success('Subscription created'); this.saving.set(false); this.showCreate.set(false); this.form = { userId: '', type: '', startDate: '', endDate: '' }; this.load(); },
      error: () => { this.toast.error('Failed to create subscription'); this.saving.set(false); }
    });
  }

  deleteSub(id: string): void {
    if (!confirm('Delete this subscription?')) return;
    this.api.deleteSubscription(id).subscribe({
      next: () => { this.toast.success('Subscription deleted'); this.load(); },
      error: () => this.toast.error('Failed to delete subscription')
    });
  }

  statusBadge(status: string): string {
    return { Active: 'bg-green-100 text-green-700', Expired: 'bg-gray-100 text-gray-500', Cancelled: 'bg-red-100 text-red-700' }[status] ?? 'bg-gray-100 text-gray-600';
  }
}
