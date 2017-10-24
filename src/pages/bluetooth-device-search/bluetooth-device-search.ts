import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
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
              private ble: BLE, public toastCtrl: ToastController) {
  }

  /**
   * Checks if bluetooth is enabled
   * and scans for bluetooth devices.
   */
  scanForDevices() {
    this.resetList();

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
    this.status = 'started scanning';

    this.ble.scan([], this.scanningTime).subscribe(
      device => this.onDeviceFound(device),
      error => this.onScanningError(error),
      () => this.onScanningCompleted()
    );
  }

  /**
   * Adds a device to the device list.
   * @param {BluetoothDevice} device
   */
  private onDeviceFound(device: BluetoothDevice) {
    this.toast('device found' + JSON.stringify(device));
    if (device.name === this.deviceName) {
      this.devices.push(device);
    }
  }

  private onScanningCompleted() {
    this.status = 'scan completed';
  }

  private onScanningError(error) {
    this.status = 'scanning error: ' + error;
    this.toast('scanning error: ' + error);
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

}
