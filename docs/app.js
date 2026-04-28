(function () {
  var params = new URLSearchParams(window.location.search);

  var assetIdEl = document.getElementById("assetId");
  var serialNumberEl = document.getElementById("serialNumber");
  var annotatedLocationEl = document.getElementById("annotatedLocation");
  var directoryDeviceIdEl = document.getElementById("directoryDeviceId");
  var appVersionEl = document.getElementById("appVersion");
  var statusEl = document.getElementById("status");
  var attrStateEl = document.getElementById("attrState");
  var platformEl = document.getElementById("platform");
  var languageEl = document.getElementById("language");
  var timezoneEl = document.getElementById("timezone");
  var viewportEl = document.getElementById("viewport");
  var onlineStatusEl = document.getElementById("onlineStatus");
  var userAgentEl = document.getElementById("userAgent");

  function showValue(element, value) {
    element.textContent = value && value.trim() ? value : "(empty)";
  }

  var assetId = params.get("assetId") || "";
  var serialNumber = params.get("serialNumber") || "";
  var annotatedLocation = params.get("annotatedLocation") || "";
  var directoryDeviceId = params.get("directoryDeviceId") || "";
  var appVersion = params.get("appVersion") || "";
  var platform = params.get("platform") || "";
  var language = params.get("language") || "";
  var timezone = params.get("timezone") || "";
  var viewport = params.get("viewport") || "";
  var onlineStatus = params.get("onlineStatus") || "";
  var userAgent = params.get("userAgent") || "";
  var attrStatus = params.get("deviceAttrStatus") || "unknown";
  var attrWarnings = params.get("deviceAttrWarnings") || "";

  showValue(assetIdEl, assetId);
  showValue(serialNumberEl, serialNumber);
  showValue(annotatedLocationEl, annotatedLocation);
  showValue(directoryDeviceIdEl, directoryDeviceId);
  appVersionEl.textContent = "Version " + (appVersion && appVersion.trim() ? appVersion : "unknown");
  showValue(platformEl, platform || navigator.platform);
  showValue(languageEl, language || navigator.language);

  try {
    showValue(timezoneEl, timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "");
  } catch (err) {
    showValue(timezoneEl, timezone);
  }

  showValue(viewportEl, viewport || window.innerWidth + " x " + window.innerHeight);
  showValue(onlineStatusEl, onlineStatus || (navigator.onLine ? "Online" : "Offline"));
  showValue(userAgentEl, userAgent || navigator.userAgent);

  window.addEventListener("resize", function () {
    if (!viewport || !viewport.trim()) {
      showValue(viewportEl, window.innerWidth + " x " + window.innerHeight);
    }
  });

  window.addEventListener("online", function () {
    if (!onlineStatus || !onlineStatus.trim()) {
      showValue(onlineStatusEl, "Online");
    }
  });

  window.addEventListener("offline", function () {
    if (!onlineStatus || !onlineStatus.trim()) {
      showValue(onlineStatusEl, "Offline");
    }
  });

  if (attrStatus === "ok") {
    statusEl.textContent = "Device attributes loaded from managed wrapper.";
    attrStateEl.textContent = "All enterprise attributes were provided.";
    return;
  }

  if (attrStatus === "partial") {
    statusEl.textContent = "Partial attributes: " + (attrWarnings || "one or more fields unavailable");
    attrStateEl.textContent = "Some values are unavailable in this environment.";
    return;
  }

  statusEl.textContent = "Opened directly (no wrapper query parameters detected).";
  attrStateEl.textContent = "Showing browser-derived defaults where possible.";
})();
