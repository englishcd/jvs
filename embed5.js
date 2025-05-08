if(typeof sURL==='undefined'){sURL='xxx'}
flvPlayer = null;
tsPlayer = null;
hlsPlayer = null;
dashPlayer = null;

stopPlayers = function () {
    if (flvPlayer) {
      flvPlayer.destroy();
      flvPlayer = null;
    }

    if (tsPlayer) {
      tsPlayer.destroy();
      tsPlayer = null;
    }
    if (hlsPlayer) {
      hlsPlayer.destroy();
      hlsPlayer = null;
    }
    if (dashPlayer) {
      dashPlayer.destroy();
      dashPlayer = null;
    }
  };

hide_for_error = function () {
    $("#player").hide();

    stopPlayers();
  };

show_for_ok = function () {
    $("#player").show();
  };

  // Use H5 native to play mp4.
  if (sURL.indexOf(".mp4") > 0) {
    $("#player").attr("src", sURL).show;
    return;
  }

  // Start play HTTP-TS.
  //if (r.indexOf("ts") > 0) {
  if (!mpegts.getFeatureList().mseLivePlayback) {
    hide_for_error();
    return;
  }

  show_for_ok();

  tsPlayer = mpegts.createPlayer({
    type: "mpegts",
    url: sURL,
    isLive: true,
    enableStashBuffer: false
  });
  tsPlayer.attachMediaElement(document.getElementById("player"));
  tsPlayer.load();
  tsPlayer.play();
  //return;
  //}

  // Start play HLS.
  if (sURL.indexOf(".m3u8") > 0) {
    if (!Hls.isSupported()) {
      hide_for_error();
      return;
    }

    show_for_ok();

    hlsPlayer = new Hls();
    hlsPlayer.loadSource(sURL);
    hlsPlayer.attachMedia(document.getElementById("player"));
    return;
  }

  // Start play MPEG-DASH.
  if (sURL.indexOf(".mpd") > 0) {
    show_for_ok();

    dashPlayer = dashjs.MediaPlayer().create();
    dashPlayer.initialize(document.querySelector("#player"), sURL, true);
    return;
  }

  // Start play HTTP-FLV.
  isFlv = sURL.indexOf(".flv") > 0;

  isFlv = isFlv || (sURL.url && sURL.url.indexOf("http") === 0);
  if (isFlv) {
    if (!mpegts.getFeatureList().mseLivePlayback) {
      hide_for_error();
      return;
    }

    show_for_ok();

    flvPlayer = mpegts.createPlayer({
      type: "flv",
      url: sURL,
      isLive: true,
      enableStashBuffer: false
    });

    flvPlayer.attachMediaElement(document.getElementById("player"));
    flvPlayer.load();
    flvPlayer.play();
    return;
  }
