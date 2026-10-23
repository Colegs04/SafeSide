# SafeSide — Personal Safety Assistant

A complete individual Expo React Native project with Redux Toolkit, camera/gallery evidence, GPS, local storage, incident records, and an emergency contact. Built for Android/iOS; a web preview is also included through Expo.

## Run on Windows / VS Code

1. Extract this ZIP, open the `safety-assistant` folder in VS Code, then open Terminal → New Terminal.
2. Install Node.js LTS if necessary.
3. Run:

```powershell
npm ci
npx expo start --clear
```

This project deliberately pins **Expo SDK 54**. Use an SDK 54 compatible Expo Go client on Android (see https://expo.dev/go), or create a development build. A current store Expo Go version may not support this older SDK. For an Android development build, install Android Studio and the Android SDK, connect a phone with USB debugging, and run `npm run android`. iOS local builds require macOS and Xcode (`npm run ios`).

For Expo Go: connect the phone and computer to the same Wi-Fi and scan the terminal QR. If the network blocks LAN, try `npx expo start --tunnel` (requires internet and may prompt to install the tunnel package).

Web preview: `npm run web`, or press `w` in the Expo terminal. Camera behavior, dialer, sharing, and permissions differ on web. Use a physical phone for grading native features. A simulator may lack a camera and needs a simulated GPS position.

## Features

- Dashboard with emergency state and navigation; back button on feature pages.
- SOS confirmation, durable SOS record, resolve action, contact call button.
- Camera and gallery permission handling, cancel handling, preview, retake, discard, and notes.
- GPS latitude, longitude, accuracy, timestamp, denied permission message, timeout and disabled GPS handling, settings shortcut, map link.
- Incident photo and metadata persistence, timestamps, share text summary, confirmed deletion.
- Contact name/phone validation and persistence.
- Loading feedback and save errors. Failed saves do not report success.

**SOS is a classroom feature that saves locally. It does not automatically notify anyone or dispatch emergency services.** Call opens a dialer; the user controls the call. Share sends only a text summary through the platform share dialog, not the image. Data is not encrypted. No account, server, or XAMPP is required.

## Files and architecture

| Layer | Files | Responsibility |
|---|---|---|
| Presentation | `App.tsx`, `src/presentation/*` | Render screens, reusable components, collect user input |
| Business | `src/business/store.ts`, `native.ts`, `types.ts` | Redux state, save orchestration, permission/device workflows, types |
| Data | `src/data/repository.ts` | AsyncStorage reads/writes and permanent evidence image files |

`ActionButton`, `Card`, and `StatusCard` are reusable components. All three receive props. `Card` also accepts children. `useState` manages tabs, pending image, draft note/contact, coordinates, loading/error messages and confirmations. Redux holds the persisted incidents, emergency status and contact.

### Redux / Flux example

1. User presses Save evidence.
2. Presentation calls the save workflow.
3. The data layer copies the temporary image into the device's documents directory.
4. `updateData` marks the store busy, constructs the next data, and awaits AsyncStorage persistence.
5. It dispatches `committed(nextData)` only after the write succeeds.
6. The slice reducer updates Redux state. `useAppSelector` receives the new state and React renders Records.

Reducers do not read storage, call GPS, or launch the camera. Async side effects run outside reducers. Redux Toolkit uses Immer so reducer assignments produce immutable updates. The persisted snapshot is loaded before editable screens appear, avoiding overwrite during startup.

## Evaluation explanation (short speaking script)

“My app is SafeSide, a personal safety assistant. The dashboard displays emergency status and provides navigation. I created reusable ActionButton, Card and StatusCard components. For example, StatusCard receives an active boolean prop, and ActionButton receives title, onPress and disabled props.

I use React useState for temporary screen data such as the image preview and form text. Redux Toolkit manages shared application data such as saved incidents and emergency status. Actions reach a reducer and components subscribe to the store, showing one-way Flux data flow.

The camera and gallery use expo-image-picker. The app requests permissions and displays an error when access is denied. GPS uses expo-location and displays coordinates with a timestamp and accuracy. If permission is denied or GPS is off, I show a message and allow retry.

AsyncStorage saves the contact, emergency status and incident metadata. Photos are copied from temporary cache into the app documents directory before saving their paths. Therefore records remain after restarting. The presentation, business and data folders separate UI, workflows and persistence.”

## Screenshot and short video checklist

Record the actual installed app on your phone for native-feature evidence. Do not present browser recordings as proof of phone camera/GPS testing.

Suggested 90–120 second recording:

1. Show dashboard and navigation (10 s).
2. Save your own test contact (10 s). Do not call a real emergency number for a demonstration.
3. Open Location, allow access, show coordinates (15 s).
4. Open Evidence, allow camera, capture a non-sensitive object, show preview/retake, add note, save (25 s).
5. Open Records and show photo, note and coordinates (10 s).
6. Close/reopen app and show records/contact still present (15 s).
7. Activate SOS, show emergency status and record, then resolve (10 s).
8. Deny a permission in settings and show the app's error/retry behavior (15 s).

Take screenshots of Dashboard, camera preview, GPS, saved Records and permission-denied state. Android: Power + Volume Down. Use built-in screen recording. iPhone: Side + Volume Up for screenshots and Control Center for screen recording.

## Checks and limitations

Run `npm run typecheck`, `npx expo install --check` and `npx expo export --platform web`.

Coordinates are a snapshot, not continuous tracking; refresh GPS before saving another incident. Pending photo/note and unsaved GPS are intentionally not persisted. Denial does not fabricate a position. Native images are stored in app-private documents; web uses a data URL and is subject to browser storage quotas. Very large collections can exhaust storage, in which case an error is shown. Save data is on this device only, and uninstalling deletes it. This is an educational app, not a production emergency service.

## Browser camera fix

Take photo now opens a live webcam through `getUserMedia`, with Capture photo, Cancel camera, and Retake. Choose from gallery continues to open a file picker. Browser capture requires localhost or HTTPS and camera permission. On Windows, enable camera access for desktop apps in Windows Settings if your browser cannot access it. Close other apps using the camera.

Changed files: `src/presentation/SafetyApp.tsx`, `BrowserCamera.tsx`, and `BrowserCamera.web.tsx`. To update an existing copy of this project, replace SafetyApp.tsx and add both BrowserCamera files in that folder. No additional dependencies are required. Restart with `npx expo start --web --clear` and open the localhost URL printed by Expo.

The browser camera was tested with Chromium's synthetic camera: preview, capture, retake/cancel, stream shutdown, saving/reloading the image, and denied permission. Physical webcam hardware was not available for verification. The original demo video predates this fix.
