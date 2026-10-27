# DropdownAlert: RN 0.87 Android reproduction

Recorded 27 October 2026 on RN 0.87.1, React 19.2.3, Hermes, Fabric, Pixel 7 Android API 35 emulator. The recorded binary is a Debug APK with developer support disabled; its local JS bundle was built with --dev false. Both source variants run in the same APK and bundle.

Baseline source: 6a71aeb39afcae7464db210e019411fc65fda1df. Patched source: 9626d0c. No observation code is inserted into either library source. App.tsx installs a Hermes rejection tracker only in the fixture to display the original failure.

After one second, both alerts receive equivalent data with an interval of 1000 ms. Baseline throws TypeError because StatusBar.setBackgroundColor is absent; its public alert Promise remains pending. The patched alert animates, dismisses automatically, and resolves. The screenshot records this final state and the absence of both removed setters.

## Reproduce

Prepare a disposable bare RN 0.87.1 app with native Android dependencies installed. Run python3 evidence/prepare-fixture.py /absolute/path/to/RNApp from this checkout. The script creates dropdown-evidence/ without overwriting an existing directory. Re-export ./dropdown-evidence/App from the root App.tsx, then build/launch a Release app, or a Debug APK configured with useDevSupport=false and an embedded --dev false JS bundle. Wait approximately five seconds.

Only core React Native native modules are needed. The script also writes dropdown-evidence/tsconfig.after.json to type-check only the patched library against the app's RN types. The deliberately broken baseline copy must be excluded when type-checking the fixture as a whole.

## Limits

The native fixture covers Android showing and automatic dismissal. iOS was not run natively. Older RN setters, missing-setter combinations, disabled updates, bottom alerts, manual dismissal and frozen spring configuration are covered by the repository's component tests.
