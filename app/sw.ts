/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (string | { url: string; revision: string | null })[];
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

// Push + notificationclick stubs — real handlers ship in Phase 6.
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;
  const payload = (() => {
    try {
      return event.data.json() as { title?: string; body?: string; url?: string };
    } catch {
      return { title: "Daily", body: event.data.text() };
    }
  })();
  event.waitUntil(
    self.registration.showNotification(payload.title ?? "Daily", {
      body: payload.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: payload.url ?? "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string } | undefined)?.url ?? "/";
  const target = new URL(url, self.location.origin).href;

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });

      // Prefer a client already at the target — just focus it.
      const exact = clients.find((c) => c.url === target);
      if (exact) {
        await exact.focus();
        return;
      }

      // Otherwise navigate any open client to the target and focus it.
      const anyClient = clients[0];
      if (anyClient && "navigate" in anyClient) {
        try {
          const navigated = await anyClient.navigate(target);
          await (navigated ?? anyClient).focus();
          return;
        } catch {
          // Cross-origin or otherwise non-navigable — fall through to openWindow.
        }
      }

      await self.clients.openWindow(target);
    })(),
  );
});
