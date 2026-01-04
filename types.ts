
export enum MailProvider {
  GMAIL = 'GMAIL',
  HOTMAIL = 'HOTMAIL',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  SILENCED = 'SILENCED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
  SPAM = 'SPAM',
}

export enum UnsubscribeMethod {
  ONE_CLICK = 'ONE_CLICK',
  MAILTO = 'MAILTO',
  URL = 'URL',
  MANUAL = 'MANUAL',
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface EmailAccount {
  id: string;
  provider: MailProvider;
  email: string;
  active: boolean;
}

export interface Subscription {
  id: string;
  senderName: string;
  senderEmail: string;
  senderDomain: string;
  totalEmails: number;
  totalSize: number; // in bytes
  lastEmailAt: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'irregular';
  status: SubscriptionStatus;
  method: UnsubscribeMethod;
  category: string;
  impactScore: number;
}

export interface InboxStats {
  totalMessages: number;
  unreadCount: number;
  spaceUsed: number; // bytes
  healthScore: number;
  provider: MailProvider;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  status: 'success' | 'failed' | 'processing';
}
