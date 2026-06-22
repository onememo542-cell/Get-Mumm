import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { SubscriptionDto, CreateSubscriptionRequest, UpdateSubscriptionRequest } from '../../models';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, NgIconComponent, TranslatePipe, SkeletonComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{{ 'SUBSCRIPTIONS.TITLE' | translate }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            @if (!loading()) { {{ items().length }} {{ 'SUBSCRIPTIONS.TITLE' | translate | lowercase }} }
          </p>
        </div>
        <button class="btn-primary self-start sm:self-auto gap-2" (click)="toggleCreate()">
          @if (showCreate()) {
            <ng-icon name="lucideX" size="14" /> {{ 'COMMON.CANCEL' | translate }}
          } @else {
            <ng-icon name="lucidePlus" size="14" /> {{ 'SUBSCRIPTIONS.NEW' | translate }}
          }
        </button>
      </div>

      @if (showCreate()) {
        <div class="card p-5 border-primary-200 dark:border-primary-800">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <ng-icon name="lucidePlus" size="14" class="text-primary-500" />
            {{ 'SUBSCRIPTIONS.NEW' | translate }}
          </h3>
          <form (ngSubmit)="create()" #f="ngForm" novalidate>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="label">{{ 'SUBSCRIPTIONS.USER_ID' | translate }}</label>
                <input type="text" class="input font-mono" [(ngModel)]="form.userId" name="userId"
                       required placeholder="UUID" autocomplete="off" />
              </div>
              <div>
                <label class="label">{{ 'SUBSCRIPTIONS.TYPE' | translate }}</label>
                <select class="input" [(ngModel)]="form.type" name="type" required>
                  <option value="">{{ 'SUBSCRIPTIONS.SELECT_TYPE' | translate }}</option>
                  <option>Weekly</option><option>Monthly</option>
                  <option>Quarterly</option><option>Annual</option>
                </select>
              </div>
              <div>
                <label class="label">{{ 'SUBSCRIPTIONS.START_DATE' | translate }}</label>
                <input type="date" class="input" [(ngModel)]="form.startDate" name="startDate" required />
              </div>
              <div>
                <label class="label">{{ 'SUBSCRIPTIONS.END_DATE' | translate }}</label>
                <input type="date" class="input" [(ngModel)]="form.endDate" name="endDate" required />
              </div>
            </div>
            <div class="flex gap-3">
              <button type="submit" class="btn-primary gap-2" [disabled]="saving() || !f.valid">
                @if (saving()) { <ng-icon name="lucideLoader" size="14" class="animate-spin" /> {{ 'COMMON.SAVING' | translate }} }
                @else { <ng-icon name="lucidePlus" size="14" /> {{ 'COMMON.CREATE' | translate }} }
              </button>
              <button type="button" class="btn-secondary" (click)="showCreate.set(false)">{{ 'COMMON.CANCEL' | translate }}</button>
            </div>
          </form>
        </div>
      }

      @if (editingSub()) {
        <div class="card p-5 border-blue-200 dark:border-blue-800">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <ng-icon name="lucidePencil" size="14" class="text-blue-500" />
            {{ 'SUBSCRIPTIONS.EDIT' | translate }}
            <code class="text-xs font-mono text-gray-400 ms-auto">{{ editingSub()!.id.slice(0,8) }}…</code>
          </h3>
          <form (ngSubmit)="saveEdit()" #ef="ngForm" novalidate>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label class="label">{{ 'SUBSCRIPTIONS.TYPE' | translate }}</label>
                <select class="input" [(ngModel)]="editForm.type" name="editType">
                  <option value="">— {{ 'SUBSCRIPTIONS.NO_CHANGE' | translate }} —</option>
                  <option>Weekly</option><option>Monthly</option>
                  <option>Quarterly</option><option>Annual</option>
                </select>
              </div>
              <div>
                <label class="label">{{ 'SUBSCRIPTIONS.STATUS' | translate }}</label>
                <select class="input" [(ngModel)]="editForm.status" name="editStatus">
                  <option value="">— {{ 'SUBSCRIPTIONS.NO_CHANGE' | translate }} —</option>
                  <option>Active</option><option>Expired</option><option>Cancelled</option>
                </select>
              </div>
              <div>
                <label class="label">{{ 'SUBSCRIPTIONS.END_DATE' | translate }}</label>
                <input type="date" class="input" [(ngModel)]="editForm.endDate" name="editEndDate" />
              </div>
            </div>
            <div class="flex gap-3">
              <button type="submit" class="btn-primary gap-2" [disabled]="saving()">
                @if (saving()) { <ng-icon name="lucideLoader" size="14" class="animate-spin" /> {{ 'COMMON.SAVING' | translate }} }
                @else { <ng-icon name="lucideSave" size="14" /> {{ 'COMMON.SAVE' | translate }} }
              </button>
              <button type="button" class="btn-secondary" (click)="cancelEdit()">{{ 'COMMON.CANCEL' | translate }}</button>
            </div>
          </form>
        </div>
      }

      @if (loading()) {
        <app-skeleton type="table" [count]="5" />
      } @else if (error()) {
        <app-error-state (retry)="load()" />
      } @else if (items().length === 0) {
        <app-empty-state iconName="lucideBell"
                         [title]="'SUBSCRIPTIONS.EMPTY_TITLE' | translate"
                         [message]="'SUBSCRIPTIONS.EMPTY_MSG' | translate" />
      } @else {
        <div class="card overflow-hidden hidden md:block">
          <div class="overflow-x-auto">
            <table class="w-full" role="table">
              <thead class="bg-gray-50 dark:bg-gray-800/60">
                <tr>
                  <th class="table-header text-start" scope="col">ID</th>
                  <th class="table-header text-start" scope="col">{{ 'SUBSCRIPTIONS.USER_ID' | translate }}</th>
                  <th class="table-header text-start" scope="col">{{ 'SUBSCRIPTIONS.TYPE' | translate }}</th>
                  <th class="table-header text-start" scope="col">{{ 'SUBSCRIPTIONS.STATUS' | translate }}</th>
                  <th class="table-header text-start" scope="col">{{ 'SUBSCRIPTIONS.START_DATE' | translate }}</th>
                  <th class="table-header text-start" scope="col">{{ 'SUBSCRIPTIONS.END_DATE' | translate }}</th>
                  <th class="table-header" scope="col"></th>
                </tr>
              </thead>
              <tbody>
                @for (sub of items(); track sub.id) {
                  <tr class="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors">
                    <td class="table-cell font-mono text-xs text-gray-400" [title]="sub.id">{{ sub.id.slice(0,8) }}…</td>
                    <td class="table-cell font-mono text-xs" [title]="sub.userId">{{ sub.userId.slice(0,8) }}…</td>
                    <td class="table-cell">
                      <span class="badge bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">{{ sub.type }}</span>
                    </td>
                    <td class="table-cell">
                      <span class="badge" [class]="statusBadge(sub.status)">{{ sub.status }}</span>
                    </td>
                    <td class="table-cell text-sm whitespace-nowrap">{{ sub.startDate | date:'dd MMM yyyy' }}</td>
                    <td class="table-cell text-sm whitespace-nowrap">{{ sub.endDate | date:'dd MMM yyyy' }}</td>
                    <td class="table-cell">
                      <div class="flex items-center gap-1 justify-end">
                        <button class="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                                (click)="startEdit(sub)" [attr.aria-label]="'COMMON.EDIT' | translate">
                          <ng-icon name="lucidePencil" size="13" />
                        </button>
                        <button class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                (click)="deleteSub(sub.id)" [attr.aria-label]="'COMMON.DELETE' | translate">
                          <ng-icon name="lucideTrash2" size="13" />
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="space-y-3 md:hidden" role="list">
          @for (sub of items(); track sub.id) {
            <div class="card p-4" role="listitem">
              <div class="flex items-start justify-between mb-3 gap-3">
                <div class="min-w-0">
                  <p class="text-xs font-mono text-gray-400">{{ sub.id.slice(0,8) }}…</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ 'SUBSCRIPTIONS.USER_ID' | translate }}: <code>{{ sub.userId.slice(0,8) }}…</code></p>
                </div>
                <div class="flex gap-2 items-center flex-shrink-0">
                  <span class="badge bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs">{{ sub.type }}</span>
                  <span class="badge text-xs" [class]="statusBadge(sub.status)">{{ sub.status }}</span>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                <div class="flex items-center gap-1"><ng-icon name="lucideCalendar" size="11" /> {{ sub.startDate | date:'dd MMM yyyy' }}</div>
                <div class="flex items-center gap-1"><ng-icon name="lucideCalendar" size="11" /> {{ sub.endDate | date:'dd MMM yyyy' }}</div>
              </div>
              <div class="flex gap-2">
                <button class="btn-secondary text-xs py-1.5 flex-1 justify-center gap-1.5" (click)="startEdit(sub)">
                  <ng-icon name="lucidePencil" size="12" /> {{ 'COMMON.EDIT' | translate }}
                </button>
                <button class="btn-danger text-xs py-1.5 flex-1 justify-center gap-1.5" (click)="deleteSub(sub.id)">
                  <ng-icon name="lucideTrash2" size="12" /> {{ 'COMMON.DELETE' | translate }}
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class SubscriptionsComponent implements OnInit {
  private api        = inject(ApiService);
  private toast      = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  loading    = signal(true);
  error      = signal(false);
  saving     = signal(false);
  showCreate = signal(false);
  editingSub = signal<SubscriptionDto | null>(null);
  items      = signal<SubscriptionDto[]>([]);

  form: CreateSubscriptionRequest = { userId: '', type: '', startDate: '', endDate: '' };
  editForm: UpdateSubscriptionRequest = { type: '', status: '', endDate: '' };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true); this.error.set(false);
    this.api.getSubscriptions().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r  => { this.items.set(r); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); this.toast.error('Failed to load subscriptions'); },
    });
  }

  toggleCreate(): void {
    this.showCreate.set(!this.showCreate());
    if (this.showCreate()) this.editingSub.set(null);
  }

  create(): void {
    this.saving.set(true);
    this.api.createSubscription(this.form).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.toast.success('Subscription created');
        this.saving.set(false); this.showCreate.set(false);
        this.form = { userId: '', type: '', startDate: '', endDate: '' };
        this.load();
      },
      error: () => { this.toast.error('Failed to create subscription'); this.saving.set(false); },
    });
  }

  startEdit(sub: SubscriptionDto): void {
    this.editingSub.set(sub);
    this.editForm = { type: '', status: '', endDate: '' };
    this.showCreate.set(false);
  }

  cancelEdit(): void { this.editingSub.set(null); }

  saveEdit(): void {
    const id = this.editingSub()?.id;
    if (!id) return;
    const payload: UpdateSubscriptionRequest = {};
    if (this.editForm.type)    payload.type    = this.editForm.type;
    if (this.editForm.status)  payload.status  = this.editForm.status;
    if (this.editForm.endDate) payload.endDate = this.editForm.endDate;
    if (!Object.keys(payload).length) { this.cancelEdit(); return; }
    this.saving.set(true);
    this.api.updateSubscription(id, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.toast.success('Subscription updated'); this.saving.set(false); this.editingSub.set(null); this.load(); },
      error: () => { this.toast.error('Failed to update subscription'); this.saving.set(false); },
    });
  }

  deleteSub(id: string): void {
    if (!confirm('Permanently delete this subscription?')) return;
    this.api.deleteSubscription(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next:  () => { this.toast.success('Subscription deleted'); this.load(); },
      error: () => this.toast.error('Failed to delete subscription'),
    });
  }

  statusBadge(status: string): string {
    return ({
      Active:    'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      Expired:   'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
      Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    } as Record<string, string>)[status] ?? 'bg-gray-100 text-gray-600';
  }
}
