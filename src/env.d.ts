interface ImportMetaEnv {
  readonly PUBLIC_POSTHOG_KEY?: string;
  readonly PUBLIC_POSTHOG_HOST?: string;
  readonly PUBLIC_GA_ID?: string;
  readonly RESEND_API_KEY?: string;
  readonly CONTACT_TO_EMAIL?: string;
  readonly CONTACT_FROM_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  posthog?: { capture?: (event: string, props?: Record<string, unknown>) => void };
  gtag?: (...args: unknown[]) => void;
}

// Minimal Temporal surface used by the site. Native in V8; not yet in TS lib.
declare namespace Temporal {
  interface PlainDate {
    readonly year: number;
    readonly month: number;
    readonly day: number;
    toString(): string;
  }
  const Now: {
    plainDateISO(timeZone?: string): PlainDate;
  };
}
