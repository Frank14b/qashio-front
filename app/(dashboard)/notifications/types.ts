export type NotificationType =
  | 'transaction.created'
  | 'transaction.updated'
  | 'transaction.deleted'
  | 'budget.threshold_reached'
  | 'account.created'
  | 'account.updated';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  /** Ids linking to the related resource */
  data: { transactionId?: string; budgetId?: string; accountId?: string };
  readAt: string | null;
  createdAt: string;
}

export interface NotificationList {
  items: AppNotification[];
  unreadCount: number;
}
