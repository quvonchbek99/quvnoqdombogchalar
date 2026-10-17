package uz.kuvonch.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.view.View;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.PermissionRequest;
import android.webkit.URLUtil;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.splashscreen.SplashScreen;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import androidx.webkit.WebSettingsCompat;
import androidx.webkit.WebViewFeature;

import java.util.ArrayList;
import java.util.List;

/**
 * Kuvonch Academy — Android ilova (v2).
 * Jonli saytni (kuvonch.uz) ochadi: kamera + mikrofon (virtual o'yinlar, ovozli javob), yuklab olish
 * (PPTX, APK), to'liq ekran, pastga tortib yangilash, oflayn ekran, orqaga tugmasi, yorliqlar.
 */
public class MainActivity extends AppCompatActivity {
    private static final String HOME = "https://kuvonch.uz/";
    private static final int REQ_PERM = 71;

    private WebView web;
    private SwipeRefreshLayout swipe;
    private ProgressBar progress;
    private View offline;
    private FrameLayout fullscreen;
    private View customView;
    private WebChromeClient.CustomViewCallback customCallback;
    private PermissionRequest pendingPermission;
    private long lastBack = 0;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        web = findViewById(R.id.web);
        swipe = findViewById(R.id.swipe);
        progress = findViewById(R.id.progress);
        offline = findViewById(R.id.offline);
        fullscreen = findViewById(R.id.fullscreen);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);   // o'yin ovozlari
        s.setAllowFileAccess(false);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setSupportZoom(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setUserAgentString(s.getUserAgentString() + " KuvonchAcademyApp/2.0");
        if (WebViewFeature.isFeatureSupported(WebViewFeature.ALGORITHMIC_DARKENING)) {
            WebSettingsCompat.setAlgorithmicDarkeningAllowed(s, false); // sayt o'zi qora
        }
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(web, true);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req) {
                Uri u = req.getUrl();
                String host = u.getHost() == null ? "" : u.getHost();
                String scheme = u.getScheme() == null ? "" : u.getScheme();
                // Sayt ichida — ilovada; tashqi havolalar (Telegram, YouTube, Instagram) — tegishli ilovada
                if (scheme.startsWith("http") && (host.endsWith("kuvonch.uz") || host.endsWith("quvonchbek99.github.io") || host.contains("desmos.com") || host.contains("googleapis.com") || host.contains("firebaseapp.com") || host.contains("google.com"))) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception e) { return false; }
                return true;
            }
            @Override public void onPageStarted(WebView v, String url, android.graphics.Bitmap f) { progress.setVisibility(View.VISIBLE); }
            @Override public void onPageFinished(WebView v, String url) { progress.setVisibility(View.GONE); swipe.setRefreshing(false); }
            @Override
            public void onReceivedError(WebView v, WebResourceRequest req, WebResourceError err) {
                if (req.isForMainFrame() && !isOnline()) offline.setVisibility(View.VISIBLE);
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override public void onProgressChanged(WebView v, int p) { progress.setProgress(p); }
            // Kamera va mikrofon — virtual o'yinlar va ovozli javob uchun
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                List<String> need = new ArrayList<>();
                for (String r : request.getResources()) {
                    if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(r) && !has(Manifest.permission.CAMERA)) need.add(Manifest.permission.CAMERA);
                    if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r) && !has(Manifest.permission.RECORD_AUDIO)) need.add(Manifest.permission.RECORD_AUDIO);
                }
                if (need.isEmpty()) { request.grant(request.getResources()); return; }
                pendingPermission = request;
                ActivityCompat.requestPermissions(MainActivity.this, need.toArray(new String[0]), REQ_PERM);
            }
            @Override
            public void onShowCustomView(View view, CustomViewCallback cb) {
                if (customView != null) { cb.onCustomViewHidden(); return; }
                customView = view; customCallback = cb;
                fullscreen.addView(view); fullscreen.setVisibility(View.VISIBLE); web.setVisibility(View.GONE);
                getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
            @Override public void onHideCustomView() { hideCustomView(); }
        });

        // Yuklab olish: PPTX, PDF, APK → Downloads papkasi
        web.setDownloadListener((url, ua, cd, mime, len) -> {
            try {
                DownloadManager.Request r = new DownloadManager.Request(Uri.parse(url));
                String name = URLUtil.guessFileName(url, cd, mime);
                r.setMimeType(mime).setTitle(name).setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                        .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, name);
                ((DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE)).enqueue(r);
                Toast.makeText(this, "⬇ Yuklanmoqda: " + name, Toast.LENGTH_SHORT).show();
            } catch (Exception e) {
                startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
            }
        });

        swipe.setColorSchemeColors(ContextCompat.getColor(this, R.color.accent));
        swipe.setProgressBackgroundColorSchemeColor(ContextCompat.getColor(this, R.color.bg));
        swipe.setOnRefreshListener(() -> { offline.setVisibility(View.GONE); web.reload(); });
        // o'yin paytida (kanvas) pastga tortish xalaqit bermasin — faqat sahifa tepasida ishlaydi
        web.getViewTreeObserver().addOnScrollChangedListener(() -> swipe.setEnabled(web.getScrollY() == 0 && customView == null));
        findViewById(R.id.retry).setOnClickListener(v -> { offline.setVisibility(View.GONE); web.reload(); });

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override public void handleOnBackPressed() {
                if (customView != null) { hideCustomView(); return; }
                if (web.canGoBack()) { web.goBack(); return; }
                long now = System.currentTimeMillis();
                if (now - lastBack < 2000) finish();
                else { lastBack = now; Toast.makeText(MainActivity.this, R.string.exit_hint, Toast.LENGTH_SHORT).show(); }
            }
        });

        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else load(startUrl(getIntent()));
    }

    private void hideCustomView() {
        if (customView == null) return;
        fullscreen.removeView(customView); fullscreen.setVisibility(View.GONE); web.setVisibility(View.VISIBLE);
        customView = null; if (customCallback != null) customCallback.onCustomViewHidden();
    }
    private String startUrl(Intent i) {
        if (i != null && i.getData() != null && "https".equals(i.getData().getScheme())) return i.getData().toString();
        return HOME;
    }
    private void load(String url) {
        if (!isOnline()) { offline.setVisibility(View.VISIBLE); }
        web.loadUrl(url);
    }
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (intent.getData() != null) load(startUrl(intent));
    }
    private boolean has(String p) { return ContextCompat.checkSelfPermission(this, p) == PackageManager.PERMISSION_GRANTED; }
    private boolean isOnline() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return true;
        NetworkCapabilities c = cm.getNetworkCapabilities(cm.getActiveNetwork());
        return c != null && c.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }

    @Override
    public void onRequestPermissionsResult(int code, @NonNull String[] perms, @NonNull int[] res) {
        super.onRequestPermissionsResult(code, perms, res);
        if (code != REQ_PERM || pendingPermission == null) return;
        boolean ok = true;
        for (int r : res) if (r != PackageManager.PERMISSION_GRANTED) ok = false;
        if (ok) pendingPermission.grant(pendingPermission.getResources());
        else { pendingPermission.deny(); Toast.makeText(this, "Kamera/mikrofonga ruxsat berilmadi — o'yinlar uchun sozlamalardan yoqing", Toast.LENGTH_LONG).show(); }
        pendingPermission = null;
    }
    @Override protected void onSaveInstanceState(@NonNull Bundle out) { super.onSaveInstanceState(out); web.saveState(out); }
    @Override protected void onPause() { super.onPause(); web.onPause(); }
    @Override protected void onResume() { super.onResume(); web.onResume(); }
    @Override protected void onDestroy() { web.destroy(); super.onDestroy(); }
}
