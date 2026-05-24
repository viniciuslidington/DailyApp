# PWA icons

Placeholder location. Generate real icons from `<Logo size={512}>` (see `docs/DESIGN.md` §8.2) using [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator).

Required files:

- `icon-192.png` (192×192, any)
- `icon-192-maskable.png` (192×192, maskable — safe area 80%)
- `icon-512.png` (512×512, any)
- `icon-512-maskable.png` (512×512, maskable)
- `apple-touch-icon.png` (180×180)
- `favicon.ico` (32×32 — blue ring only, no orange dot)

Until these exist, Lighthouse PWA installability will warn but the app still runs.
