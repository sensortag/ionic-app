import {Component, NgZone} from '@angular/core';
import {IonicPage, NavController, ToastController} from 'ionic-angular';
import {BluetoothDevice} from "../model/device";
import {BLE} from "@ionic-native/ble";

/**
 * Page to scan for bluetooth devices.
 * Only devices with the name 'SensorTag' are listed.
 *
 */
@IonicPage()
@Component({
  selector: 'page-bluetooth-device-search',
  templateUrl: 'bluetooth-device-search.html',
})
export class BluetoothDeviceSearchPage {
  private deviceName: string = 'CC2650 SensorTag';
  private scanningTime: number = 10; // time in s
  private toastTime: number = 4000; // time in ms
  private status: string;
  private devices: Array<BluetoothDevice> = [];

  constructor(public navCtrl: NavController,
              private ble: BLE, public toastCtrl: ToastController,
              private ngZone: NgZone) {
  }

  /**
   * Checks if bluetooth is enabled
   * and scans for bluetooth devices.
   */
  scanForDevices() {
    this.resetList();
    //TODO add check if location service is on if os is Android
    this.ble.enable().then(() => {
      this.startScanning();
    }).catch(() => {
      this.toast('Please enable bluetooth!')
    });
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

  /*
   * Resets the array devices.
   */
  private resetList() {
    this.devices.length = 0;
  }

  /**
   * Navigates to the BluetoothSensorTagPage and passes the selected device.
   */
  deviceSelected(device: BluetoothDevice) {
    this.navCtrl.push('BluetoothSensorTagPage', device)
  }

  private setStatusMessage(message: string) {
    this.ngZone.run(() => this.status = message);
  }
}
