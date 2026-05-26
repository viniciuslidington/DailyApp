export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let _prompt: BeforeInstallPromptEvent | null = null;

export function captureInstallPrompt(e: BeforeInstallPromptEvent): void {
  _prompt = e;
}

export function getInstallPrompt(): BeforeInstallPromptEvent | null {
  return _prompt;
}

export function clearInstallPrompt(): void {
  _prompt = null;
}
