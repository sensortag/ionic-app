import {Component} from "@angular/core";
import {BLE} from "@ionic-native/ble";
import {IonicPage, NavController, NavParams, ToastController} from "ionic-angular";
import {BluetoothDevice} from "../model/device";

/**
 *  Handles the communication with the selected bluetooth device.
 *
 */
@IonicPage()
@Component({
  selector: 'page-bluetooth-sensor-tag',
  templateUrl: 'bluetooth-sensor-tag.html'
})
export class BluetoothSensorTagPage {
  private ambientTemperature: string = '0.00';
  private irTemperature: string = '0.00';
  private humidity: string = '0';
  private pressure: string = '0';
  private acceleration: string = 'X: 0.00 Y: 0.00 Z: 0.00';
  private gyro: string = "X: 0.00 Y: 0.00 Z: 0.00";
  private mag: string = "X: 0.00 Y: 0.00 Z: 0.00";
  private keyPressed: string = '0';
  private light: string = '0.0';
  private status: string = 'init';

  private device: BluetoothDevice;

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private toastCtrl: ToastController, private ble: BLE) {
    this.device = navParams.data;

    this.ble.connect(this.device.id).subscribe(
      peripheralObject => this.onConnected(peripheralObject),
      //Device disconnected or there was a failure connecting
      peripheralObject => this.onDisconnected(peripheralObject)
    )
  }

  private onConnected(peripheralObject: any) {
    this.status = 'connection established';

  }

  private onDisconnected(peripheralObject: any) {
    this.status = 'device disconnected';
  }

  /**
   * Disconnect the device.
   */
  ionViewWillLeave() {
    this.ble.disconnect(this.device.id).catch(
      () => {
        let toast = this.toastCtrl.create({
          message: 'disconnect failed',
          duration: 3000
        });
        toast.present();
      }
    )
  }


}
