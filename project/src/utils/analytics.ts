import { detect } from 'detect-browser';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

class Analytics {
  private static instance: Analytics;
  private browser = detect();
  
  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  trackEvent({ category, action, label, value }: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // @ts-ignore
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        browser: this.browser?.name,
        browser_version: this.browser?.version,
      });
    }
  }

  trackError(error: Error): void {
    this.trackEvent({
      category: 'Error',
      action: error.name,
      label: error.message,
    });
  }
}

export const analytics = Analytics.getInstance();