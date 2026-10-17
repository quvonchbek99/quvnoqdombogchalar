# Kuvonch Academy — Android ilova (v2)

Jonli saytni (https://kuvonch.uz) ochadigan WebView ilova: kamera + mikrofon (virtual o'yinlar, ovozli javob),
yuklab olish (PPTX/PDF/APK), to'liq ekran, pastga tortib yangilash, oflayn ekran, yorliqlar (uzoq bosganda).

## Qayta yig'ish (yangi versiya)
1. `app/build.gradle` da `versionCode` ni +1, `versionName` ni yangilang.
2. Android Studio: Build → Generate Signed Bundle/APK → APK → `kuvonch-release.jks` (alias `kuvonch`, parol: `kuvonch2026`).
   Yoki terminal: `./gradlew assembleRelease` (ANDROID_HOME kerak) → `app/build/outputs/apk/release/app-release.apk`.
3. APK'ni repo ildiziga `kuvonch-academy.apk` nomi bilan nusxalang va push qiling.

Keystore shu papkada (`kuvonch-release.jks`) — yo'qotmang: yangilanishlar faqat shu kalit bilan imzolanganda o'rnatiladi.
Paket nomi: `uz.kuvonch.app` (eski `uz.kuvonch.academy` ilova bilan to'qnashmaydi — ikkalasi ham turishi mumkin).
