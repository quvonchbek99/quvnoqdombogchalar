/*! Kuvonch Academy — videolar Google Drive'da saqlanadi (Drive: "kuvonch.uz videolar" papkasi).
 *  Sayt sahifalari videoni shu yerdagi ro'yxatdan oladi; ro'yxatda yo'q video eski yo'li bo'yicha ochiladi.
 *  Yangi video qo'shish: Drive'dagi papkaga yuklang, "Havolaga ega har kim ko'ra oladi" qiling,
 *  so'ng DRIVE ro'yxatiga  "media/....mp4": "FAYL_ID"  qatorini qo'shing (ID — havoladagi /d/ dan keyingi qism). */
(function () {
  "use strict";
  var DRIVE = {
    "media/ezop-tulki-va-uzum.mp4": "1sLNLkPwgJqd-Pq0X2FpPZJJ8lmjqilfq",
    "media/ezop/ez-001.mp4": "1h7z6-QE0jMYlQWa_NecsLQK9a1tijXK_",
    "media/ezop/ez-002.mp4": "1ZqroONodEMfPhmo7eyXY1dBW-6mIVB4u",
    "media/ezop/ez-003.mp4": "1-J1czvW_g6M54xj6nB4I8unXBHmL6Ak2",
    "media/ezop/ez-004.mp4": "1HQaA8yv1bGmihz2yTvF-HUO7hhuxpXOt",
    "media/ezop/ez-005.mp4": "1ZU2D33ZueVQeCcqJ2IePPv8wskhJa-o0",
    "media/ezop/ez-006.mp4": "1wYiJsSyX8hgbNPSqCmP0FDYhQ8VUgk7j",
    "media/ezop/ez-007.mp4": "1CYHzvJtgkIEXCkrcX7j97Mm50v6qwA57",
    "media/ezop/ez-008.mp4": "1slxp3vv1GeSorEVg02TgwSIozF_0tcN7",
    "media/ezop/ez-009.mp4": "1SacPmLDXH6tAFe21Au8ekFjLuSxkh1F8",
    "media/ezop/ez-010.mp4": "1dY7fMR39wLIRkQLOI2tMSR-5264k5VzY",
    "media/ezop/ez-011.mp4": "1dv-yLauAMuZErGGMXAvyDdgRvEP7x_KI",
    "media/ezop/ez-012.mp4": "1UNS43b9IckehqVLwZObeqDxHbwXSS8-W",
    "media/ezop/ez-013.mp4": "1MGFg6Z6xQniPhQ8si4GbYX5XAkKs7yBg",
    "media/ezop/ez-014.mp4": "1bVdB6vmSQg105nz9ruiJJOpBFTabCkB1",
    "media/ezop/ez-015.mp4": "10kwAePkrMSU9C6UlDLDnWVIgS_JO8wGq",
    "media/ezop/ez-016.mp4": "1aLPaH7CmZirVW52pSGpfT2myQt4rgcy0",
    "media/ezop/ez-017.mp4": "1s-46ELwaqnNRN1KT7fwiT_zE7ut_4Op-",
    "media/ezop/ez-018.mp4": "1szM9zr-Xkv_N7Hn_dxM9XaX6oNysQApf",
    "media/ezop/ez-019.mp4": "1uqCSsLwtsL1vvZc_7SfMwEYF8OFuoOUn",
    "media/ezop/ez-020.mp4": "1tb5WyWA7Oe6Bsajak9yZ-b9mkaw-rAVU",
    "media/ezop/ez-021.mp4": "1Tuz3IyBqft1j7GHifl_whlnV008bdA2i",
    "media/ezop/ez-022.mp4": "1qfawEpwC_xiEawmet3QRgV25mawV7un2",
    "media/ezop/ez-023.mp4": "11V8D4rhU1rkZvCIsMqNnaODu0GXtW8vO",
    "media/ezop/ez-024.mp4": "112law0eVMQ5yericbgL9fj2ag0rU0kiM",
    "media/ezop/ez-025.mp4": "19c-D_aXYBouulgn8ZxmGUPBwkn3r5U50",
    "media/ezop/ez-026.mp4": "1VHMVHgClfUSDmpsFyjjMj7MZHuMmPaKw",
    "media/ezop/ez-027.mp4": "1izO6mKleOjoI9RRaemF-24SmklzdZnaF",
    "media/ezop/ez-028.mp4": "1Lxs2Z36etSXX80blk9-2ngqH46nDbcar",
    "media/ezop/ez-029.mp4": "1xKrcefHTtx754UzhbDqzernod_LP0YSh",
    "media/ezop/ez-030.mp4": "1W-4ZtJdFZHYbsg5gLMW6EoXK0VllEwIv",
    "media/ezop/ez-031.mp4": "1rkbIVaD1T4wp151sp7dCTQr2zR7FvQkI",
    "media/ezop/ez-032.mp4": "1e7xk5nTl4AdIGHMT9QlemqoASXQoYEig",
    "media/ezop/ez-033.mp4": "1P948KeVCN5M6t4O2Ni-S0AuRUzI2X-LN",
    "media/ezop/ez-034.mp4": "1yZORta0i1MsUI0Juf7qMw01LjMpgtS6l",
    "media/ezop/ez-035.mp4": "1-N-gB7gMMS94JCRseFG_omghtn80-kWH",
    "media/ezop/ez-036.mp4": "1EX5d-s7y8RWEnJHCw1A-jwG_hT_wskpI",
    "media/ezop/ez-037.mp4": "17ooGf8GXSUtALZ_ubU5C56uI3Q1zaFuV",
    "media/ezop/ez-038.mp4": "1kQ0tQjJUM0Fm3HtxdsnBS1CkoB6StcGe",
    "media/ezop/ez-039.mp4": "1tLWcuTtFPqYGbo7b0d5LwG3j58kbP6bw",
    "media/ezop/ez-040.mp4": "1pMGNzbDj5umnqVgiJh5HzDJYF4vll2mA",
    "media/ezop/ez-041.mp4": "1n2xJf8P_lpP3tcgFte3ZU2GJKOAIPvwv",
    "media/ezop/ez-042.mp4": "1oiqHfGVDhercKAC3Ig-a5omdTDJc56xW",
    "media/ezop/ez-043.mp4": "134uqUyV3nNNkUEWr8BObFfVhKxWBMmuZ",
    "media/ezop/ez-044.mp4": "15zxsB2YA9cYsviWX3FF_BTzQBxJuUCTH",
    "media/ezop/ez-045.mp4": "1wHtCgntL3hHIctpuheMIk7k5j-lO2sJN",
    "media/ezop/ez-046.mp4": "1vwhHNBKC_v9-8GOOE8QvFWoTJufRSIjQ",
    "media/ezop/ez-047.mp4": "1-eOAAo7s5IOCw6gTEcJyWJir_wNuRQIt",
    "media/ezop/ez-048.mp4": "1oM5yda9dI1G1vwWgQhvOiLam0Y0v7db4",
    "media/ezop/ez-049.mp4": "1Lv3rw_nXyl5iBMqm53lEBzsouq4bLEMf",
    "media/ezop/ez-050.mp4": "1neq-2W9I1qRdhR0R-wphyD3cDytpjpEp",
    "media/ezop/ez-051.mp4": "1meKtqTBSzojEbf1X_m0iUQaCT44W3oSo",
    "media/ezop/ez-052.mp4": "1XRy8roe0hsbfW3_s6Mmo7DQi-WnCcr8G",
    "media/ezop/ez-053.mp4": "1smWcj1u34vIxWFocBWxm56ba-CuSNPz9",
    "media/ezop/ez-054.mp4": "1wy5wmc-rPNTbTyhGsD82iZzQGuj_vlL5",
    "media/ezop/ez-055.mp4": "1tUBBdD1fc-Ob1cQTyHWlHWzDDhjp1H5x",
    "media/ezop/ez-056.mp4": "1LHFI0ILNW2DlyPKEb3yQWDYWtZ8i4Mxo",
    "media/ezop/ez-057.mp4": "1JQ5Ii491cX_hFEwQjFq5pe_N6y65Ec6z",
    "media/ezop/ez-058.mp4": "1IzDTqoHdRHitAfPhEf4tK9tBlziFY25e",
    "media/ezop/ez-059.mp4": "1H9wroFUWV9nk6yAGKA7oT5_kKoUfxBdm",
    "media/ezop/ez-060.mp4": "1RdQWhUG6wXezfRIX5iTmFr0KbkS7GXNB",
    "media/ezop/ez-061.mp4": "1dd-TCp7cwlwBtSNsu5eRqgXQbWAHAcUg",
    "media/ezop/ez-062.mp4": "1lTdnGSpYqFXa9MZMj8C7TZ38D5Qtdpup",
    "media/ezop/ez-063.mp4": "15uejS_Y20ogTCKm-KDmXJXArODjBBIza",
    "media/ezop/ez-064.mp4": "1Zk3xBC-Kk57Ut-NnLx_N9AVHCVoD7QTf",
    "media/ezop/ez-065.mp4": "1ztzR6l_HywK4MRtKxJuxO2p5MEFLMXbp",
    "media/ezop/ez-066.mp4": "1c_z-tKjLr3foAYgw8VQSynPiBwxbu-P1",
    "media/ezop/ez-067.mp4": "1rjj3zEJEXGJ1yFyIs74DRKgvylQjBOrP",
    "media/ezop/ez-068.mp4": "1wcGg8j2hkU3RmMnfXnjQnWfu_DIFoPhc",
    "media/ezop/ez-069.mp4": "1xPYsVRYzhNRTOvg5FylfHuQ0GSYViqt5",
    "media/ezop/ez-070.mp4": "1jCGjk2ckYBFpkH_af1TXZqIjU6WRmbT9",
    "media/ezop/ez-071.mp4": "1CnAEvSckf5cZxGZOhdMlkfobzPh9yeWv",
    "media/ezop/ez-072.mp4": "1mUDUXgeDvHBexm9KpmFMEvuS8zSi_dP9",
    "media/ezop/ez-073.mp4": "14L-2yCbD0NtAvYYFfm_hKEOOzIUuQxQs",
    "media/ezop/ez-074.mp4": "1ShgYaoDLhEu-osz2XLlxFTvYth3XcUjX",
    "media/ezop/ez-075.mp4": "1fBzZnBcBbkk3NfRmVXxmuBsSFhrhHtpq",
    "media/ezop/ez-076.mp4": "1CoNkJV7_rDIJJeKlCvj6E_8SPVJLKNbB",
    "media/ezop/ez-077.mp4": "15kFY5khdsshY76Nf3s83fGWha9QLfqu5",
    "media/ezop/ez-078.mp4": "109cig5OmClNlLJAxiQg03n3V9J1LNyNO",
    "media/ezop/ez-079.mp4": "181RUUxEBgC7RfZaIHVpByfDP0dREwGcI",
    "media/ezop/ez-080.mp4": "1NihBZVFOhRoOyE5vvqMaZXxwmypuamk1",
    "media/ezop/ez-081.mp4": "1B0PrB3gjiM1PUq0nLN_7xSTG7z6ND9ET",
    "media/ezop/ez-082.mp4": "1AvDiKE6XH2xuEFMYKujEvU0wzFlf1BpV",
    "media/ezop/ez-083.mp4": "1HG2eRk11pu7Ek0ENbacNsgWR8DshiC6S",
    "media/ezop/ez-104.mp4": "1B4AI9UD1q28yngb_8uuklXevgKjt04rk",
    "media/imo-2025-5-v2.mp4": "1843eDnAnNUvcucnWmFNmHG9F0uilK87_",
    "media/imo-2025-5.mp4": "1GHCK1RXu0u4wIeXasW18lEXjXoJg2VmI",
    "media/kuvonch-uz-reels-20s.mp4": "14J5kNLkWulYza85Hj4nnNoJeTOx5wBxj",
    "media/matematika-tarixi-1-qism.mp4": "1OpC1H7SRe5BOjkuCxFLO4xO0NhFIO7FM",
    "media/matematika-tarixi-2-qism.mp4": "1JDJd6xv6LjaPkhIAIjBxpR2AfLAbbbOp",
    "media/matematika-tarixi-3-qism.mp4": "1uvyVmDcyJvb9kTZ8lz9j_ZPadzG0LHj2",
    "media/matematika-tarixi-4-qism.mp4": "13tzC1a0hIXNKvgTAgZkz-OVM6R1ioBYe",
    "media/matematika-tarixi-toliq.mp4": "1l9HKlch1ScR1IU7Q8Cs08vvCZKSjZ0D_",
    "media/pifagor-teoremasi-1-qism.mp4": "1H4SU97eyoHfukQkJ9PWn2wFmEA6uWpvl",
    "media/pifagor-teoremasi-2-qism.mp4": "1XwIhR7scZTRHMg7f-MnmNBw3jtYTFUus",
    "media/pifagor-teoremasi-toliq.mp4": "1tV9amXcoOc6WV_DnR6sftSzFlHdcbSve",
    "media/reklama/reklama-arqon.mp4": "1s7cnLLJvdMbT-xtprdDqRbrSjIx0gUSb",
    "media/reklama/reklama-sayt.mp4": "1LDBuHpD5clDpS6jXwFcBNve3TDwO0nEJ",
    "media/reklama/reklama-viktorina.mp4": "1FbE1EJNh92eWyfBo2UwLyXntNqPOtNgf",
    "media/sichqon-ovi-film-haqiqati.mp4": "1VG_QH_xAtrVsKdpofK5DLi2j9ArWlBFy",
    "media/uch-sovga.mp4": "1r-Mj76zTcRKDj26QpqqZzd4mtp2x3FaN",
    "media/zohid-va-latcha.mp4": "1NajdSZIFVjTk71L7t3yBiXDhzXPEfIDW",
    "post-04-virtual-reels.mp4": "1Gb3oHYMuB-J4lqXJlnxdZMnbHDqPsLsE",
    "promo/2026-10-matematik-sudoku.mp4": "1vJvHLqZXhp3piGoislU9PSA7UnR1dczU",
    "promo/2026-10-math-royale-airdrop.mp4": "1C1WjCJk5rV-2n6oMfgQcO1Mp_FK17GYj",
    "promo/2026-10-math-royale-orol.mp4": "1u05n5RLW0mvOBShOL9eOqQaTi2_WGgy5",
    "promo/2026-10-shaxmat-jumboq.mp4": "1QuYC52oAPUO6vFFWdO78WU4-YUtcc285",
    "promo/2026-10-yangi-oyinlar.mp4": "1cm8frrIKdZ23dI7IpEzWs-1RqWhTyVv6"
  };

  function id(p) { return (p && DRIVE[p]) || null; }
  function dl(i) { return "https://drive.usercontent.google.com/download?id=" + i + "&export=download&confirm=t"; }

  window.kaVideo = {
    /** Drive videoni to'g'ridan-to'g'ri <video> ga bermaydi (sinovda "Format error"), shuning uchun Drive pleyeri ishlatiladi */
    iframe: true,
    /** Drive fayl ID si (yo'q bo'lsa null) */
    id: id,
    /** <video src> uchun manzil */
    src: function (p) { var i = id(p); return i ? dl(i) : p; },
    /** Yuklab olish havolasi */
    download: function (p) { var i = id(p); return i ? dl(i) : p; },
    /** Drive'ning o'z pleyeri (iframe uchun) */
    embed: function (p) { var i = id(p); return i ? "https://drive.google.com/file/d/" + i + "/preview" : ""; },
    /** Drive'dagi sahifasi */
    page: function (p) { var i = id(p); return i ? "https://drive.google.com/file/d/" + i + "/view" : p; },
    /** <video> Drive'dan ochilmasa, uning o'rniga Drive pleyerini qo'yadi. Qo'yilgan iframe'ni qaytaradi. */
    swap: function (video, p) {
      var u = this.embed(p); if (!u || !video || !video.parentNode) return null;
      var f = document.createElement("iframe");
      f.src = u; f.className = "drive-player"; f.title = "Video";
      f.setAttribute("allow", "autoplay; fullscreen"); f.setAttribute("allowfullscreen", "");
      f.setAttribute("loading", "lazy");
      f.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;background:#050a14";
      try { video.pause(); } catch (e) {}
      video.removeAttribute("src"); video.style.display = "none";
      video.parentNode.insertBefore(f, video.nextSibling);
      return f;
    }
  };
})();
