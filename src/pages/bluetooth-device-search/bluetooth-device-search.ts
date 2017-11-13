import {Component, NgZone} from '@angular/core';
import {IonicPage, NavController, ToastController, Platform} from 'ionic-angular';
import {BluetoothDevice} from "../model/device";
import {BLE} from "@ionic-native/ble";
import {Diagnostic} from '@ionic-native/diagnostic';

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
  private deviceName: string = 'CC2650 SensorTag';
  private enableBluetoothMessage = 'Please enable bluetooth!';
  private scanningTime: number = 10; // time in s
  private toastTime: number = 4000; // time in ms
  private status: string;

  private devices: Array<BluetoothDevice> = [];

  constructor(public navCtrl: NavController,
              private platform: Platform,
              private diagnostic: Diagnostic,
              private ble: BLE, public toastCtrl: ToastController,
              private ngZone: NgZone) {
  }

  /**
   * Checks if the needed services on the specific platform
   * are enabled and then starts scanning for bluetooth devices.
   */
  scanForDevices() {
    this.resetList();
    if (this.platform.is('android')) {
      this.startScanningOnAndroid();
    } else if (this.platform.is('ios')) {
      this.startScanningOnIOS();
    } else {
      this.toast('Platform not supported')
    }

  }

  /**
   * Navigates to the BluetoothSensorTagPage and passes the selected device.
   */
  deviceSelected(device: BluetoothDevice) {
    this.navCtrl.push('BluetoothSensorTagPage', device)
  }

  /**
   *  Checks if bluetooth and the location service is enabled.
   *  If both are enabled the scanning for ble devices is started.
   */
  private startScanningOnAndroid() {
    this.ble.enable().then(() => {
      this.diagnostic.isLocationEnabled().then((locationEnabled) => {
        if (locationEnabled) {
          this.startScanning()
        } else {
          this.toast('Please enable the location service')
        }
      }).catch((error) =>
        this.toast('Error checking location service: ' + error)
      )
    }).catch(() => {
      this.toast(this.enableBluetoothMessage)
    });
  }

  /**
   * Checks if bluetooth is enabled.
   * If it is enabled the scanning for ble devices is started.
   */
  private startScanningOnIOS() {
    this.ble.isEnabled().then(() =>
      this.startScanning()
    ).catch(() =>
      this.toast(this.enableBluetoothMessage)
    );
  }

  /**
   * Scans for bluetooth devices.
   */
  private startScanning() {
    this.setStatusMessage('scanning');

    this.ble.scan([], this.scanningTime).subscribe(
      device => this.onDeviceFound(device),
      error => this.onScanningError(error)
    );
    // set a timeout function to reset the status,
    // because complete of ble.scan(..).subscribe is never called
    setTimeout(() => {
      this.setStatusMessage('scanning completed');
    }, this.scanningTime * 1000);
  }

  /**
   * Adds a device to the device list.
   * @param {BluetoothDevice} device
   */
  private onDeviceFound(device: BluetoothDevice) {
    if (device.name === this.deviceName) {
      this.ngZone.run(() => this.devices.push(device));
    }
  }

  /**
   * Updates the status with the given error.
   *
   * @param error
   */
  private onScanningError(error) {
    this.setStatusMessage('scanning error: ' + error);
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
