import {Component, NgZone} from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {BluetoothDevice} from "../bluetooth-model/bluetooth-device";
import {SettingKeys, SettingsService} from "../../services/settings.service";
import {BleScanService} from "../../services/ble-scan.service";

/**
 * Page to scan for bluetooth devices.
 * Only devices with the name 'CC2650 SensorTag' are listed.
 *
 */
@IonicPage()
@Component({
  selector: 'page-bluetooth-device-search',
  templateUrl: 'bluetooth-device-search.html',
})
export class BluetoothDeviceSearchPage {
  private isFilterOn: boolean = false;

  private deviceName: string = 'CC2650 SensorTag';
  private toastTime: number = 4000; // time in ms
  private status: string;
  private devices: Array<BluetoothDevice> = [];


  constructor(private bleScanService: BleScanService,
              private navCtrl: NavController,
              private settingsService: SettingsService,
              private toastCtrl: ToastController,
              private ngZone: NgZone) {

    this.settingsService.getSetting(SettingKeys.IS_BLUETOOTH_FILTER_ON).then(value => {
      this.isFilterOn = value;
    });

  }

  /**
   * Checks if the needed services on the specific platform
   * are enabled and then starts scanning for bluetooth devices.
   */
  scanForDevices() {
    this.resetList();
    this.setStatusMessage('scanning');
    this.bleScanService.startScanningForBleDevices().subscribe(
      device => this.onDeviceFound(device),
      error => this.onScanningError(error),
      () => this.onScanningComplete(),
    );

  }

  /**
   * Navigates to the BluetoothSensorTagPage and passes the selected device.
   */
  deviceSelected(device: BluetoothDevice) {
    this.navCtrl.push('BluetoothSensorTagPage', device)
  }

  /**
   * Adds a device to the device list.
   * @param {BluetoothDevice} device
   */
  private onDeviceFound(device: BluetoothDevice) {
    if (!this.isFilterOn || (device.name === this.deviceName)) {
      this.ngZone.run(() => this.devices.push(device));
    }
  }

  /**
   * Create a toast with the error.
   *
   * @param error
   */
  private onScanningError(error) {
    this.toast(error);
  }

  /**
   * Update the status.
   *
   */
  private onScanningComplete() {
    this.setStatusMessage('scanning finished')
  }

  /**
   * Creates a toast an presents it.
   * @param {string} message
   */
  private toast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: this.toastTime
    });
    toast.present();
  }

  /**
   * Resets the array devices.
   */
  private resetList() {
    this.devices.length = 0;
  }

  /**
   * Sets the status message.
   *
   * @param {string} message
   */
  private setStatusMessage(message: string) {
    this.ngZone.run(() => this.status = message);
  }
}
