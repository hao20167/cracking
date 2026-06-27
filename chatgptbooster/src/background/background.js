(() => {
  const SETTINGS_KEY = "csb_settings";
  const USER_STATUS_KEY = "csb_user_status";

  function proStatus() {
    return {
      type: "pro",
      grantedAt: new Date().toISOString(),
      source: "local_unlocked"
    };
  }

  chrome.runtime.onInstalled.addListener((details) => {
    const updates = {
      [USER_STATUS_KEY]: proStatus()
    };

    if (details.reason === "install") {
      updates[SETTINGS_KEY] = {
        enabled: true,
        messageLimit: 15,
        debug: false
      };
    }

    chrome.storage.local.set(updates);
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "REQUEST_PERMISSION") {
      sendResponse({ granted: true });
      return true;
    }

    if (message?.type === "ACTIVATE_LICENSE" || message?.type === "VALIDATE_LICENSE") {
      sendResponse({ success: true, result: { ok: true }, data: { install_id: "local_unlocked" } });
      return true;
    }

    return false;
  });
})();
