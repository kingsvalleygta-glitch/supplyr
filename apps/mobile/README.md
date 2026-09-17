# Supplyr mobile (Expo)

Native iOS **and** Android app for [Supplyr](https://supplyr-two.vercel.app) — Kings Valley Homes construction supplies. Built with **Expo SDK 54+ / Expo Router**, designed to run in **Expo Go** on both platforms.

## Prerequisites

1. Node 20+
2. **Expo Go** on your phone:
   - **iPhone:** [Expo Go on the App Store](https://apps.apple.com/app/expo-go/id982107779)
   - **Android:** [Expo Go on Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
3. Same Wi‑Fi as your computer (for LAN), or use tunnel mode

## Run

```bash
cd apps/mobile
npm install
npx expo start
```

Then:

- Scan the QR code with **Camera** (iPhone) or **Expo Go** (Android), **or**
- Press `i` / `a` for simulators if you have them

Tunnel (if LAN fails):

```bash
npx expo start --tunnel
```

## API base URL

Default: `https://supplyr-two.vercel.app`

Override with env (restart Expo after changing):

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000 npx expo start
```

Or set `extra.apiBaseUrl` in `app.json`.

Mobile calls:

| Method | Path |
|--------|------|
| GET | `/api/products` (paginated + search) |
| GET | `/api/products/[slug]` |
| GET | `/api/categories` |
| POST | `/api/orders` |
| GET | `/api/orders/[id]` |
| GET | `/api/orders/[id]/tracking` |
| POST | `/api/pro-leads` |

## Screens

| Tab / route | Purpose |
|-------------|---------|
| Home | Hero, categories, featured |
| Browse | Search + category filters + infinite scroll |
| Cart | AsyncStorage cart |
| Checkout | Place order → confirmation |
| Orders / track | Live timeline + map (`react-native-maps`, WebView fallback) |
| Pro | Contractor signup |
| Estimate | Simplified install calculator |

## Platforms

`app.json` includes **both** `ios` and `android` so Expo Go works on iPhone and Android. No custom native modules beyond Expo Go–compatible packages (`react-native-maps`, AsyncStorage, expo-image, WebView).

## Brand

Black (`#111113`) + high-vis yellow (`#f5c518`), en-CA copy, CAD pricing.
