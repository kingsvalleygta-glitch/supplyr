# Supplyr — App Store & Google Play publish checklist (Expo EAS)

Bundle ID / package (already set): `ca.kingsvalleyhomes.supplyr`

This repo is **config-ready**. You still need developer accounts before any store build or submit. Do **not** invent credentials in CI or chat.

---

## 0. Accounts you must create first

| Account | Cost | Why |
|---------|------|-----|
| [Expo](https://expo.dev/signup) | Free | EAS Build / Submit, project UUID |
| [Apple Developer Program](https://developer.apple.com/programs/) | ~US$99/yr | App Store Connect + signing |
| [Google Play Console](https://play.google.com/console/signup) | US$25 one-time | Play listing + AAB upload |

Create Expo first (needed for `eas init`). Apple and Google can be done in either order; iOS and Android submits are independent.

---

## 1. Expo login + link this app (required before any `eas build`)

On a machine where you can complete browser login:

```bash
cd apps/mobile
npx eas-cli login          # opens browser / device code
npx eas-cli whoami         # must print your Expo username
npx eas-cli init           # creates/links project; writes real UUID into app.json
```

`app.json` currently has:

```json
"extra": { "eas": { "projectId": "REPLACE_WITH_EAS_PROJECT_UUID" } }
```

`eas init` / linking replaces that placeholder with a real UUID. Commit the updated `app.json` after init.

Optional (if Expo org ownership matters):

```bash
npx eas-cli whoami
# set "owner" in app.json to your Expo username or org slug if needed
```

---

## 2. Privacy policy URL

Stores require a public privacy policy. Use (or publish) a page on the live site, e.g.:

- `https://supplyr-two.vercel.app/privacy` (create if missing)

You will paste this URL into App Store Connect and Google Play Console.

---

## 3. Screenshots & listing assets

Prepare before submit (typical):

**iPhone**

- 6.7" display: at least 1–3 screenshots (home, browse/cart, tracking)
- Optional: 6.5" / 5.5" if targeting older sizes

**Android**

- Phone: at least 2 screenshots
- Feature graphic 1024×500 (Play)

**Icon / splash**

Already in `assets/images/` (`icon.png`, `splash-icon.png`, Android adaptive icons).

---

## 4. Profiles in `eas.json`

| Profile | Use |
|---------|-----|
| `development` | Dev client / simulator |
| `preview` | Internal IPA / APK for testers |
| `production` | Store IPA (iOS) + AAB (Android), `autoIncrement` |

---

## 5. Build (after Expo login + Apple/Google accounts)

From `apps/mobile`:

```bash
# iOS App Store binary
npm run eas:build:ios
# same as: npx eas-cli build -p ios --profile production

# Android Play AAB
npm run eas:build:android
# same as: npx eas-cli build -p android --profile production
```

First iOS build will walk through Apple credentials (Apple ID with Developer Program membership, App Store Connect API key or interactive login). First Android build will create or ask for a keystore (EAS can manage it).

Preview / internal:

```bash
npx eas-cli build -p ios --profile preview
npx eas-cli build -p android --profile preview
```

---

## 6. Submit to stores

```bash
npm run eas:submit:ios
# npx eas-cli submit -p ios --profile production

npm run eas:submit:android
# npx eas-cli submit -p android --profile production
```

Or upload the artifact manually from the EAS build page into App Store Connect / Play Console.

### App Store Connect (iOS) — after Apple Developer is active

1. Create app with bundle ID `ca.kingsvalleyhomes.supplyr`
2. Fill name, subtitle, description, keywords, support URL, privacy policy URL
3. Upload screenshots + age rating
4. Attach the production build from EAS
5. Submit for review

### Google Play Console — after Play developer account is active

1. Create app with package `ca.kingsvalleyhomes.supplyr`
2. Complete store listing, content rating, data safety, privacy policy
3. Upload production AAB (internal/closed track first is safest)
4. Roll out to production when ready

---

## 7. Version fields

| Field | Where | Current |
|-------|--------|---------|
| Marketing version | `expo.version` | `1.0.0` |
| iOS build number | `expo.ios.buildNumber` | `1` (EAS `autoIncrement` on production) |
| Android versionCode | `expo.android.versionCode` | `1` (EAS `autoIncrement` on production) |

Bump `version` (e.g. `1.0.1`) for user-visible releases; let EAS increment build numbers.

---

## 8. Tracking map note

Live tracking uses **WebView** → `https://supplyr-two.vercel.app` track page so Expo Go and store builds stay green without Google Maps native keys. `react-native-maps` may remain in dependencies for later native maps work; it is not required for store builds.

---

## 9. Quick “am I ready?” checklist

- [ ] Expo account + `eas login` + `eas whoami` works
- [ ] `eas init` ran; `extra.eas.projectId` is a real UUID (committed)
- [ ] Apple Developer Program enrolled (iOS)
- [ ] Google Play Console paid (Android — can wait)
- [ ] Privacy policy URL live
- [ ] Screenshots ready
- [ ] `eas build -p ios --profile production` succeeded
- [ ] App Store Connect listing filled + submitted
- [ ] (Later) Android AAB + Play listing

---

## 10. What this agent did / did not do

**Done in repo:** `eas.json`, store-ready `app.json` fields, WebView tracking, npm EAS scripts, this checklist.

**Not done (needs you):** Expo browser login, Apple/Google account signup, `eas build`, `eas submit`, inventing any credentials.
