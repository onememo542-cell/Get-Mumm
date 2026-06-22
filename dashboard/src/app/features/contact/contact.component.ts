import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';
import { ContactSubmissionDto, OfficeInquirySubmissionDto } from '../../models';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgIconComponent, TranslatePipe, SkeletonComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="space-y-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{{ 'CONTACT.TITLE' | translate }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ 'CONTACT.SUBTITLE' | translate }}</p>
      </div>

      <!-- Contact Form Submissions -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <ng-icon name="lucideMailOpen" size="18" class="text-primary-500" />
            <h3 class="text-base font-semibold text-gray-800 dark:text-white">{{ 'CONTACT.MESSAGES_TITLE' | translate }}</h3>
            @if (!loadingContacts()) {
              <span class="badge bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs">{{ contacts().length }}</span>
            }
          </div>
          <button class="btn-secondary gap-2 text-xs py-1.5" (click)="loadContacts()" [attr.aria-label]="'COMMON.REFRESH' | translate">
            <ng-icon name="lucideRefreshCw" size="13" />
          </button>
        </div>

        @if (loadingContacts()) {
          <app-skeleton type="table" [count]="4" />
        } @else if (contactsError()) {
          <app-error-state (retry)="loadContacts()" />
        } @else if (contacts().length === 0) {
          <app-empty-state iconName="lucideMailOpen"
                           [title]="'CONTACT.MESSAGES_EMPTY_TITLE' | translate"
                           [message]="'CONTACT.MESSAGES_EMPTY_MSG' | translate" />
        } @else {
          <div class="card overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm" role="table">
                <thead class="bg-gray-50 dark:bg-gray-800/60">
                  <tr>
                    <th class="table-header text-start" scope="col">{{ 'CONTACT.NAME' | translate }}</th>
                    <th class="table-header text-start" scope="col">{{ 'CONTACT.EMAIL' | translate }}</th>
                    <th class="table-header text-start" scope="col">{{ 'CONTACT.SUBJECT' | translate }}</th>
                    <th class="table-header text-start" scope="col">{{ 'CONTACT.STATUS' | translate }}</th>
                    <th class="table-header text-start" scope="col">{{ 'CONTACT.DATE' | translate }}</th>
                    <th class="table-header" scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (c of contacts(); track c.id) {
                    <tr class="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
                        [class.bg-blue-50]="expandedContact() === c.id"
                        [class.dark:bg-blue-900]="expandedContact() === c.id">
                      <td class="table-cell font-medium">{{ c.name }}</td>
                      <td class="table-cell text-gray-500">
                        <a [href]="'mailto:' + c.email" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{{ c.email }}</a>
                      </td>
                      <td class="table-cell text-gray-600 dark:text-gray-400 max-w-[180px] truncate" [title]="c.subject">{{ c.subject }}</td>
                      <td class="table-cell">
                        <span class="badge" [class]="contactStatusBadge(c.status)">{{ c.status }}</span>
                      </td>
                      <td class="table-cell text-xs text-gray-400 whitespace-nowrap">{{ c.createdAt | date:'dd MMM yyyy' }}</td>
                      <td class="table-cell">
                        <button class="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
                                (click)="toggleContact(c.id)" [attr.aria-label]="'CONTACT.VIEW_MESSAGE' | translate">
                          <ng-icon [name]="expandedContact() === c.id ? 'lucideChevronUp' : 'lucideChevronDown'" size="14" />
                        </button>
                      </td>
                    </tr>
                    @if (expandedContact() === c.id) {
                      <tr class="border-t border-blue-100 dark:border-blue-800">
                        <td colspan="6" class="px-5 py-4 bg-blue-50/50 dark:bg-blue-900/10">
                          <p class="text-xs text-gray-400 mb-1">{{ 'CONTACT.MESSAGE' | translate }}</p>
                          <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ c.message }}</p>
                          @if (c.phone) {
                            <p class="text-xs text-gray-400 mt-2">{{ 'CONTACT.PHONE' | translate }}: <span class="text-gray-600 dark:text-gray-300">{{ c.phone }}</span></p>
                          }
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </section>

      <!-- Office Catering Inquiries -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <ng-icon name="lucideBuilding2" size="18" class="text-orange-500" />
            <h3 class="text-base font-semibold text-gray-800 dark:text-white">{{ 'CONTACT.INQUIRIES_TITLE' | translate }}</h3>
            @if (!loadingInquiries()) {
              <span class="badge bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs">{{ inquiries().length }}</span>
            }
          </div>
          <button class="btn-secondary gap-2 text-xs py-1.5" (click)="loadInquiries()" [attr.aria-label]="'COMMON.REFRESH' | translate">
            <ng-icon name="lucideRefreshCw" size="13" />
          </button>
        </div>

        @if (loadingInquiries()) {
          <app-skeleton type="table" [count]="3" />
        } @else if (inquiriesError()) {
          <app-error-state (retry)="loadInquiries()" />
        } @else if (inquiries().length === 0) {
          <app-empty-state iconName="lucideBuilding2"
                           [title]="'CONTACT.INQUIRIES_EMPTY_TITLE' | translate"
                           [message]="'CONTACT.INQUIRIES_EMPTY_MSG' | translate" />
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            @for (inq of inquiries(); track inq.id) {
              <div class="card p-5">
                <div class="flex items-start justify-between mb-3 gap-2">
                  <div>
                    <p class="font-semibold text-gray-800 dark:text-white text-sm">{{ inq.companyName }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ inq.contactName }}</p>
                  </div>
                  <span class="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{{ inq.createdAt | date:'dd MMM yyyy' }}</span>
                </div>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-3">
                  <div>
                    <p class="text-gray-400">{{ 'CONTACT.EMAIL' | translate }}</p>
                    <a [href]="'mailto:' + inq.email" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">{{ inq.email }}</a>
                  </div>
                  <div>
                    <p class="text-gray-400">{{ 'CONTACT.PHONE' | translate }}</p>
                    <p class="text-gray-700 dark:text-gray-300">{{ inq.phone || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-gray-400">{{ 'CONTACT.HEAD_COUNT' | translate }}</p>
                    <p class="text-gray-700 dark:text-gray-300 font-semibold">{{ inq.headCount }} {{ 'CONTACT.PEOPLE' | translate }}</p>
                  </div>
                  <div>
                    <p class="text-gray-400">{{ 'CONTACT.FREQUENCY' | translate }}</p>
                    <p class="text-gray-700 dark:text-gray-300">{{ inq.frequency || '—' }}</p>
                  </div>
                  @if (inq.deliveryArea) {
                    <div class="col-span-2">
                      <p class="text-gray-400">{{ 'CONTACT.DELIVERY_AREA' | translate }}</p>
                      <p class="text-gray-700 dark:text-gray-300">{{ inq.deliveryArea }}</p>
                    </div>
                  }
                </div>
                @if (inq.message) {
                  <div class="border-t border-gray-100 dark:border-gray-800 pt-3">
                    <p class="text-xs text-gray-400 mb-1">{{ 'CONTACT.MESSAGE' | translate }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">{{ inq.message }}</p>
                  </div>
                }
              </div>
            }
          </div>
        }
      </section>
    </div>
  `
})
export class ContactComponent implements OnInit {
  private api        = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  contacts         = signal<ContactSubmissionDto[]>([]);
  inquiries        = signal<OfficeInquirySubmissionDto[]>([]);
  loadingContacts  = signal(true);
  loadingInquiries = signal(true);
  contactsError    = signal(false);
  inquiriesError   = signal(false);
  expandedContact  = signal<string | null>(null);

  ngOnInit(): void { this.loadContacts(); this.loadInquiries(); }

  loadContacts(): void {
    this.loadingContacts.set(true); this.contactsError.set(false);
    this.api.getContactSubmissions().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r  => { this.contacts.set(r); this.loadingContacts.set(false); },
      error: () => { this.contactsError.set(true); this.loadingContacts.set(false); },
    });
  }

  loadInquiries(): void {
    this.loadingInquiries.set(true); this.inquiriesError.set(false);
    this.api.getOfficeInquiries().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r  => { this.inquiries.set(r); this.loadingInquiries.set(false); },
      error: () => { this.inquiriesError.set(true); this.loadingInquiries.set(false); },
    });
  }

  toggleContact(id: string): void {
    this.expandedContact.set(this.expandedContact() === id ? null : id);
  }

  contactStatusBadge(status: string): string {
    return ({
      New:        'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      Read:       'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
      Replied:    'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      Archived:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    } as Record<string, string>)[status] ?? 'bg-gray-100 text-gray-600';
  }
}
