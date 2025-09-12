export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  rating?: number;
  totalBills?: number;
  totalSpent?: number;
  joinedDate: Date;
  subscriptionType: 'basic' | 'premium';
  preferences: UserPreferences;
}

export interface UserPreferences {
  currency: string;
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  billReminders: boolean;
  paymentRequests: boolean;
  activityUpdates: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showActivity: boolean;
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export class UserUtils {
  static getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  static getInitials(user: User): string {
    const firstName = user.firstName.charAt(0).toUpperCase();
    const lastName = user.lastName.charAt(0).toUpperCase();
    return `${firstName}${lastName}`;
  }

  static formatRating(rating?: number): string {
    if (!rating) return '0.0';
    return rating.toFixed(1);
  }

  static getSubscriptionDisplayText(
    subscriptionType: 'basic' | 'premium'
  ): string {
    return subscriptionType.charAt(0).toUpperCase() + subscriptionType.slice(1);
  }

  static getSubscriptionColor(subscriptionType: 'basic' | 'premium'): string {
    return subscriptionType === 'premium' ? '#FFD700' : '#666666';
  }

  static validateUser(user: CreateUser): string[] {
    const errors: string[] = [];

    if (!user.firstName.trim()) {
      errors.push('First name is required');
    }

    if (!user.lastName.trim()) {
      errors.push('Last name is required');
    }

    if (!user.email.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(user.email)) {
      errors.push('Please enter a valid email address');
    }

    if (user.phone && !this.isValidPhone(user.phone)) {
      errors.push('Please enter a valid phone number');
    }

    return errors;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
}
