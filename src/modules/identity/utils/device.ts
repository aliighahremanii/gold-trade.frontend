const DEVICE_ID_STORAGE_KEY = "gt_device_id";

export function getDeviceId() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);

  if (existing) {
    return existing;
  }

  const deviceId = crypto.randomUUID();
  window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  return deviceId;
}

export function getDeviceName() {
  if (typeof navigator === "undefined") {
    return "Unknown device";
  }

  return navigator.userAgent.slice(0, 120) || "Unknown device";
}

export function getDeviceContext() {
  return {
    deviceId: getDeviceId(),
    deviceName: getDeviceName(),
  };
}
