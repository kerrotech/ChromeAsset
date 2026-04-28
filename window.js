(function () {
  var webSectionEl = document.getElementById("webSection");
  var fallbackSectionEl = document.getElementById("fallbackSection");
  var webviewEl = document.getElementById("kioskWebview");
  var overlayEl = document.getElementById("overlay");
  var webStatusEl = document.getElementById("status");
  var fallbackStatusEl = document.getElementById("fallbackStatus");
  var assetIdEl = document.getElementById("assetId");
  var serialNumberEl = document.getElementById("serialNumber");
  var annotatedLocationEl = document.getElementById("annotatedLocation");

  function setWebStatus(text) {
    webStatusEl.textContent = text;
  }

  function setFallbackStatus(text) {
    fallbackStatusEl.textContent = text;
  }

  function setField(element, value) {
    element.textContent = value || "(empty)";
  }

  function setUnavailable(element) {
    element.textContent = "Unavailable";
  }

  function resolveHostedUrl() {
    if (typeof window.KIOSK_WEB_APP_URL === "string") {
      return window.KIOSK_WEB_APP_URL.trim();
    }

    return "";
  }

  function showFallback(reasonText) {
    webSectionEl.classList.add("hidden");
    fallbackSectionEl.classList.remove("hidden");
    setFallbackStatus(reasonText);
  }

  function asQueryValue(value) {
    if (value === "Unavailable") {
      return "";
    }

    if (!value || value === "(empty)") {
      return "";
    }

    return value;
  }

  function buildWebAppUrl(baseUrl, warnings) {
    var url = new URL(baseUrl);
    url.searchParams.set("assetId", asQueryValue(assetIdEl.textContent));
    url.searchParams.set("serialNumber", asQueryValue(serialNumberEl.textContent));
    url.searchParams.set("annotatedLocation", asQueryValue(annotatedLocationEl.textContent));

    if (warnings.length) {
      url.searchParams.set("deviceAttrStatus", "partial");
      url.searchParams.set("deviceAttrWarnings", warnings.join(" | "));
    } else {
      url.searchParams.set("deviceAttrStatus", "ok");
    }

    return url.toString();
  }

  function readAttribute(methodName, targetEl, friendlyName, done) {
    var api = chrome.enterprise.deviceAttributes;
    if (!api[methodName]) {
      setUnavailable(targetEl);
      done(friendlyName + " method unavailable");
      return;
    }

    api[methodName](function (value) {
      if (chrome.runtime.lastError) {
        setUnavailable(targetEl);
        done(friendlyName + ": " + chrome.runtime.lastError.message);
        return;
      }

      setField(targetEl, value);
      done(null);
    });
  }

  if (!chrome.enterprise || !chrome.enterprise.deviceAttributes) {
    setWebStatus("enterprise.deviceAttributes API not available.");
    setUnavailable(assetIdEl);
    setUnavailable(serialNumberEl);
    setUnavailable(annotatedLocationEl);
    showFallback("enterprise.deviceAttributes API not available.");
    return;
  }

  var pending = 3;
  var errors = [];
  var hostedUrl = resolveHostedUrl();
  var webviewListenersAttached = false;

  function ensureWebviewListeners() {
    if (webviewListenersAttached) {
      return;
    }

    webviewListenersAttached = true;

    // loadstop is the most reliable signal that webview navigation completed.
    webviewEl.addEventListener("loadstop", function () {
      overlayEl.classList.add("hidden");

      if (errors.length) {
        setWebStatus("Hosted app loaded with attribute warnings.");
      } else {
        setWebStatus("Hosted app loaded.");
      }
    });

    webviewEl.addEventListener("loadabort", function (event) {
      var reason = "Hosted web app failed to load in kiosk mode.";
      if (event && event.reason) {
        reason += " Reason: " + event.reason;
      }
      showFallback(reason);
    });
  }

  function done(errorText) {
    if (errorText) {
      errors.push(errorText);
    }

    pending -= 1;
    if (pending !== 0) {
      return;
    }

    if (!hostedUrl || hostedUrl === "https://example.com/kiosk") {
      showFallback("Hosted URL is not configured in window.config.js.");
      return;
    }

    setWebStatus("Launching hosted web app...");

    ensureWebviewListeners();

    try {
      webviewEl.src = buildWebAppUrl(hostedUrl, errors);
    } catch (err) {
      showFallback("Invalid hosted URL in window.config.js.");
      return;
    }

    webSectionEl.classList.remove("hidden");
    fallbackSectionEl.classList.add("hidden");
  }

  readAttribute("getDeviceAssetId", assetIdEl, "Asset ID", done);
  readAttribute("getDeviceSerialNumber", serialNumberEl, "Serial Number", done);
  readAttribute("getDeviceAnnotatedLocation", annotatedLocationEl, "Annotated Location", done);
})();
