(function () {
  var params = new URLSearchParams(window.location.search);

  var assetIdEl = document.getElementById("assetId");
  var serialNumberEl = document.getElementById("serialNumber");
  var annotatedLocationEl = document.getElementById("annotatedLocation");
  var statusEl = document.getElementById("status");

  function showValue(element, value) {
    element.textContent = value && value.trim() ? value : "(empty)";
  }

  var assetId = params.get("assetId") || "";
  var serialNumber = params.get("serialNumber") || "";
  var annotatedLocation = params.get("annotatedLocation") || "";
  var attrStatus = params.get("deviceAttrStatus") || "unknown";
  var attrWarnings = params.get("deviceAttrWarnings") || "";

  showValue(assetIdEl, assetId);
  showValue(serialNumberEl, serialNumber);
  showValue(annotatedLocationEl, annotatedLocation);

  if (attrStatus === "ok") {
    statusEl.textContent = "Device attributes loaded from managed wrapper.";
    return;
  }

  if (attrStatus === "partial") {
    statusEl.textContent = "Partial attributes: " + (attrWarnings || "one or more fields unavailable");
    return;
  }

  statusEl.textContent = "Opened directly (no wrapper query parameters detected).";
})();
