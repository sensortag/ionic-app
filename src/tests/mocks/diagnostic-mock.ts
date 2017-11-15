export class DiagnosticMock {

  /**
   * Returns true if the device setting for location is on. On Android this returns true if Location Mode is switched on. On iOS this returns true if Location Services is switched on.
   * @returns {Promise<boolean>}
   */
  isLocationEnabled(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  /**
   * Checks if Wifi is connected/enabled. On iOS this returns true if the device is connected to a network by WiFi. On Android and Windows 10 Mobile this returns true if the WiFi setting is set to enabled.
   * On Android this requires permission. `<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />`
   * @returns {Promise<any>}
   */
  isWifiAvailable(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}
