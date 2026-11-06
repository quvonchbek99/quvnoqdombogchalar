/*! Kuvonch Academy — videolar Google Drive'da saqlanadi (Drive: "kuvonch.uz videolar" papkasi).
 *  Sayt sahifalari videoni shu yerdagi ro'yxatdan oladi; ro'yxatda yo'q video eski yo'li bo'yicha ochiladi.
 *  Yangi video qo'shish: Drive'dagi papkaga yuklang, "Havolaga ega har kim ko'ra oladi" qiling,
 *  so'ng DRIVE ro'yxatiga  "media/....mp4": "FAYL_ID"  qatorini qo'shing (ID — havoladagi /d/ dan keyingi qism). */
(function () {
  "use strict";
  var DRIVE = {
    /*@@DRIVE@@*/
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
