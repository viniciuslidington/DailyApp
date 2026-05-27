/**
 * Utility functions to map message placeholders between backend curly-brace format
 * (e.g. {countdown}) and user-friendly square-bracket format (e.g. [Countdown]).
 */

const MAP_BACKEND_TO_FRIENDLY: Record<string, string> = {
  "{countdown}": "[Countdown]",
  "{date}": "[Date]",
  "{time}": "[Time]",
  "{name}": "[Your name]",
};

const MAP_FRIENDLY_TO_BACKEND: Record<string, string> = {
  "[Countdown]": "{countdown}",
  "[Date]": "{date}",
  "[Time]": "{time}",
  "[Your name]": "{name}",
};

/**
 * Converts a database message with backend curly-brace placeholders to a user-friendly format.
 * e.g., "See you at {time}" -> "See you at [Time]"
 */
export function toUserFriendlyMessage(message: string | null | undefined): string {
  if (!message) return "";
  let result = message;
  for (const [backend, friendly] of Object.entries(MAP_BACKEND_TO_FRIENDLY)) {
    result = result.replaceAll(backend, friendly);
  }
  return result;
}

/**
 * Converts a user-friendly message with square-bracket placeholders to the backend curly-brace format.
 * e.g., "See you at [Time]" -> "See you at {time}"
 */
export function toBackendMessage(message: string | null | undefined): string | null {
  if (!message) return null;
  const trimmed = message.trim();
  if (!trimmed) return null;

  let result = trimmed;
  for (const [friendly, backend] of Object.entries(MAP_FRIENDLY_TO_BACKEND)) {
    result = result.replaceAll(friendly, backend);
  }
  return result;
}
