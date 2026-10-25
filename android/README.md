# Kuvonch Academy — Android ilova (v2)

Jonli saytni (https://kuvonch.uz) ochadigan WebView ilova: kamera + mikrofon (virtual o'yinlar, ovozli javob),
yuklab olish (PPTX/PDF/APK), to'liq ekran, pastga tortib yangilash, oflayn ekran, yorliqlar (uzoq bosganda).

## Qayta yig'ish (yangi versiya)
1. `app/build.gradle` da `versionCode` ni +1, `versionName` ni yangilang.
2. Android Studio: Build → Generate Signed Bundle/APK → APK → o'zingizdagi `kuvonch-release.jks` (alias `kuvonch`, parolni o'zingiz kiritasiz).
   Yoki terminal: `KA_KS_FILE=/yo'l/kuvonch-release.jks KA_KS_PASS=… ./gradlew assembleRelease` (ANDROID_HOME kerak) → `app/build/outputs/apk/release/app-release.apk`.
3. APK'ni repo ildiziga `kuvonch-academy.apk` nomi bilan nusxalang va push qiling.

Keystore (`kuvonch-release.jks`) va uning paroli **repoga qo'yilmaydi** (repo ochiq — kalitni ko'rgan har kim ilovangiz nomidan soxta APK imzolashi mumkin edi).
Uni kompyuteringizda / xavfsiz joyda saqlang va `android/` papkasiga faqat yig'ish paytida qo'ying (`.gitignore` uni push qilishga yo'l qo'ymaydi).
Yangilanishlar faqat shu kalit bilan imzolanganda o'rnatiladi.
Paket nomi: `uz.kuvonch.app` (eski `uz.kuvonch.academy` ilova bilan to'qnashmaydi — ikkalasi ham turishi mumkin).
