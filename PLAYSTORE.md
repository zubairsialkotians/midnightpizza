# Publishing Midnight Pizza on Google Play

The complete path from this folder to a live Play Store app, and how to ship updates later.

**What's already set up in the project**

| File | What it does for Play |
|---|---|
| `app.config.js` | Package `mid.night.pizza`, target/compile SDK 36 (Play's current requirement), adaptive icon, only the needed permissions (Internet, notifications, camera); ad ID, storage, overlay and microphone are blocked |
| `eas.json` | `production` builds a signed **.aab** and bumps `versionCode` on every build; `submit` uploads to the **internal testing** track as a draft |
| `google-services.json` | Firebase config that already includes `mid.night.pizza` (push notifications) |
| `screens/PrivacyScreen.js` | Privacy policy inside the app (My account → Privacy policy) |
| My account → Delete my account | In-app account deletion (Play requires it) |
| `store/privacy-policy.html` | The same policy as a web page to host (Play needs a public URL) |
| `store/listing.md` | App name, short and full description, category |
| `store/graphics/` | 512×512 app icon and 1024×500 feature graphic |

**Time needed:** about 1–2 hours of work. A **new personal** developer account must also run a 14-day closed test before it can publish to production (step 9).

---

## 1. One-time accounts

1. **Google Play developer account**: https://play.google.com/console/signup. There's a one-time US$25 fee and identity verification, which can take a few days.
   - *Personal* account: you need a closed test with **12 testers for 14 days** before production access.
   - *Organization* account: needs a D-U-N-S number, but there's no 12-tester rule.
2. **Expo account**: already logged in here as `zbhaientheo`. To check:
   ```bash
   npx eas-cli whoami
   ```

## 2. Connect the project to EAS (once)

```bash
cd "/Users/asim/Documents/MZEE Apps/midnightpizza"
npx eas-cli init
```

This creates the `midnightpizza` project on expo.dev and prints its ID. Put that ID in `.env`:

```
EAS_PROJECT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Push notifications don't work without it.

Check the rest of `.env` too:
- `EXPO_PUBLIC_SHOP_KEY` is filled in.
- `APP_BUNDLE_ID=mid.night.pizza`. **Never change this after the first upload**: Play ties the app to it forever.

## 3. Push notifications (FCM) credentials (once)

Android pushes go through Firebase Cloud Messaging, so EAS needs a Firebase service-account key:

1. Open the Firebase console for the project in `google-services.json`. Go to **Project settings → Service accounts → Generate new private key** and download the JSON. Keep it outside this folder.
2. Run:
   ```bash
   npx eas-cli credentials -p android
   ```
   Pick the **production** profile, then **Google Service Account → Manage your Google Service Account Key for Push Notifications (FCM V1) → Upload**, and choose that JSON.

## 4. Host the privacy policy

1. Open `store/privacy-policy.html`. Add your support email at the bottom (the commented line), since the shop has no email set.
2. Publish it on your website. The easiest way is WordPress on sialkotians.com: **Pages → Add New** → title "Midnight Pizza Privacy Policy" → add a **Custom HTML** block and paste the file → Publish. Note the URL, e.g. `https://sialkotians.com/midnight-pizza-privacy/`.
3. Add that URL to `.env` (it's used in the app config notes and store forms):
   ```
   EXPO_PUBLIC_PRIVACY_URL=https://sialkotians.com/midnight-pizza-privacy/
   ```

If you change the policy, update both `screens/PrivacyScreen.js` and the web page, along with the date in each.

## 5. Build the app bundle

```bash
npx eas-cli build -p android --profile production
```

- The first time, answer **Yes** to "Generate a new Android Keystore". EAS stores it safely. Don't lose access to the Expo account: that key signs every update.
- The build runs in the cloud (about 10–20 minutes). When it finishes, download the **.aab** from the link it prints, or from expo.dev → Builds.

Optional: to test on a phone before uploading, build an installable APK:
```bash
npx eas-cli build -p android --profile preview
```

## 6. Create the app in Play Console

Go to **Play Console → Create app**:
- App name: `Midnight Pizza`
- Default language: English (United Kingdom or United States)
- App or game: **App**. Free or paid: **Free**. You can't change it to paid later.
- Accept the declarations → **Create app**.

## 7. Store listing

**Grow users → Store presence → Main store listing**:

| Field | Where to get it |
|---|---|
| App name, short and full description | `store/listing.md` |
| App icon (512×512 PNG) | `store/graphics/play-icon-512.png` |
| Feature graphic (1024×500) | `store/graphics/feature-graphic-1024x500.jpg` |
| Phone screenshots (2–8) | `store/graphics/play-screenshot-1.png` … `play-screenshot-5.png` (1080×2160, upload in this order). These are branded and framed; the plain app captures are in `store/graphics/raw/`. To change a caption, edit `SHOTS` in `store/graphics/frame.html`, then run `store/graphics/render.sh`. |

**Taking screenshots.** Run the app on the emulator or a phone. Log in with a **demo** account, not a real customer's, and capture:
1. Home with the menu
2. A product page
3. Cart
4. Checkout
5. My orders or an order's status
6. News

On the emulator, use the camera button in its side toolbar, or run:
```bash
~/Library/Android/sdk/platform-tools/adb exec-out screencap -p > shot.png
```

Play rules: PNG or JPEG, with the long side no more than **twice** the short side. Pixel 8 Pro shots (1344×2992) are too tall, so crop them to 2:1 first:
```bash
sips -c 2688 1344 shot.png --out shot.png && sips -z 2160 1080 shot.png --out shot.png
```

Then set **Store settings**: category **Food & Drink**, plus contact email (required) and phone.

## 8. App content (Policy → App content)

Complete every item until each shows a green tick.

| Section | Answer |
|---|---|
| **Privacy policy** | The URL from step 4 |
| **App access** | *All or some functionality is restricted.* Customers can order without logging in, but staff/owner screens need a login. Give reviewers a **demo customer** login (phone/email + password) and say "Ordering works without login. Admin screens are for shop staff only." Don't share the owner's real password: make a test customer account. |
| **Ads** | No, the app does not contain ads |
| **Content rating** | Start questionnaire → category *All other app types* → answer **No** to violence, sexuality, drugs, gambling and so on. Answer **Yes** to "users can interact or exchange information" only if you count reviews; otherwise No. Result: *Everyone / PEGI 3*. |
| **Target audience** | 18 and over (or 13+). Not designed for children. |
| **News app** | No (the shop news is promotional, not a news publisher) |
| **Data safety** | See below |
| **Government app** | No |
| **Financial features** | *My app doesn't provide any financial features* (it only shows payment instructions and takes a screenshot; it doesn't process payments) |
| **Health** | No health features |
| **Advertising ID** | No (it's blocked in the build) |

### Data safety answers

- **Does your app collect or share any of the required user data types?** Yes
- **Is all of the user data collected by your app encrypted in transit?** Yes (HTTPS)
- **Do you provide a way for users to request that their data is deleted?** Yes. Delete account URL: the privacy page plus `#delete`, e.g. `https://sialkotians.com/midnight-pizza-privacy/#delete` (it explains in-app deletion and the WhatsApp request).

Data types to tick. For each one: **Collected: Yes, Shared: No, Processed ephemerally: No**.

| Data type | Required or optional | Purposes |
|---|---|---|
| Personal info → **Name** | Required | App functionality, Account management |
| Personal info → **Email address** | Required | App functionality, Account management |
| Personal info → **Phone number** | Required | App functionality, Account management |
| Personal info → **Address** | Required | App functionality |
| Financial info → **Purchase history** | Required | App functionality |
| Photos and videos → **Photos** | Optional (payment screenshot) | App functionality |
| App activity → **Other user-generated content** (reviews, order notes) | Optional | App functionality |
| Device or other IDs (push token) | Optional | App functionality |

Leave everything else unticked: no location, contacts, analytics, crash logs or ad ID.

> "Shared" means sent to a third party for *their* use. Hosting and Expo/Firebase push delivery are *service providers* acting for you, which Google doesn't count as sharing.

## 9. Testing tracks → production

### Personal account (12 testers / 14 days)

1. **Testing → Internal testing → Create new release** → upload the `.aab` from step 5. The first upload must be done by hand in the Console. Add your own email as a tester and install it from the opt-in link.
2. **Testing → Closed testing** → create a track → add **at least 12 testers** (Google accounts: friends, staff, regular customers) → upload the same `.aab` → roll out.
3. The 12 testers must **opt in, install it and keep it installed for 14 days in a row**. Ask them to open it a few times.
4. After 14 days: **Dashboard → Apply for production access**. Answer the questions about your testing. Approval usually takes a few days.

### Organization account

Upload to **Internal testing** to check it, then **Production → Create new release** and upload.

### Release to production

**Production → Countries/regions** → add Pakistan (and any others) → **Create new release** → choose the bundle → release notes ("First release") → **Review release → Start rollout**. Google's review takes from a few hours to about 7 days.

## 10. Updates later

1. Change the code. For a visible release, bump `version` in `app.config.js` (e.g. `1.0.1`). `versionCode` goes up automatically on every build.
2. Build:
   ```bash
   npx eas-cli build -p android --profile production
   ```
3. Upload it, either by hand in Play Console (**Production → Create new release**) or automatically:
   - **One-time setup for automatic uploads:**
     1. In Google Cloud, create a service account in the Play project and download its JSON key.
     2. In Play Console → **Users and permissions → Invite**, add that service account's email with the *Release* permissions.
     3. Save the key as `play-service-account.json` in this folder. It's git- and EAS-ignored, so don't commit it.
   - **Each release:**
     ```bash
     npx eas-cli submit -p android --profile production --latest
     ```
     This uploads the newest build to **Internal testing** as a draft. In the Console, promote it to Production.

     To go straight to production, change `"track": "internal"` to `"production"` in `eas.json`.

Server-side changes (prices, items, banners, news, shop settings) don't need a new app version: they come from the API.

## 11. Checklist before the first submission

- [ ] `.env`: `EXPO_PUBLIC_SHOP_KEY`, `EAS_PROJECT_ID` and `EXPO_PUBLIC_PRIVACY_URL` are set
- [ ] FCM key uploaded (step 3), and a test push received on a production/preview build
- [ ] Privacy page is live and the link opens
- [ ] Demo customer account created for reviewers
- [ ] Shop settings filled in (logo, phone, delivery charges, open), with items and photos added, so reviewers don't see an empty shop
- [ ] Icon, feature graphic and 2+ screenshots uploaded
- [ ] Every App content item is green

## Troubleshooting

| Problem | Fix |
|---|---|
| "You need to use a different package name" | `mid.night.pizza` is taken by another Play app. Change `APP_BUNDLE_ID`, add that package in Firebase, and replace `google-services.json` before the first upload. |
| "Version code 1 has already been used" | Run the build again (autoIncrement bumps it), or set the version with `npx eas-cli build:version:set -p android`. |
| "Your app targets API level …" | `expo-build-properties` already targets 36. Raise it in `app.config.js` when Google announces a new requirement (each August). |
| Rejected for **App access** | Reviewers couldn't log in. Check that the demo account works and give clearer instructions. |
| Rejected for **Data safety mismatch** | Make sure the form matches section 8 and the privacy page. |
| Push notifications don't arrive | Check that `EAS_PROJECT_ID` is set, the FCM V1 key is uploaded, and you're on a real build (not Expo Go) with notifications allowed. |
| Lost the upload key | Play App Signing holds the app signing key. In Play Console → App integrity → *Request upload key reset*. |
