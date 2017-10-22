import {Component} from "@angular/core";
import {BLE} from "@ionic-native/ble";
import {IonicPage, NavController, NavParams, ToastController} from "ionic-angular";
import {BluetoothDevice} from "../model/device";
import {MovementSensor} from "../model/movment-sensor";
import {BarometerSensor} from "../model/barometer-sensor";
import {KeySensor} from "../model/key-sensor";

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
  private movementSensor = new MovementSensor(
    'f000aa80-0451-4000-b000-000000000000',
    'f000aa81-0451-4000-b000-000000000000',
    'f000aa82-0451-4000-b000-000000000000',
    'f000aa83-0451-4000-b000-000000000000');

  private barometerSensor = new BarometerSensor(
    'f000aa40-0451-4000-b000-000000000000',
    'f000aa41-0451-4000-b000-000000000000',
    'f000aa42-0451-4000-b000-000000000000',
    'f000aa44-0451-4000-b000-000000000000'
  );

  private keySensor = new KeySensor(
    '0000ffe0-0000-1000-8000-00805f9b34fb',
    '0000ffe1-0000-1000-8000-00805f9b34fb',
    '',
    ''
  );

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private toastCtrl: ToastController, private ble: BLE) {
    this.device = navParams.data;

    this.ble.connect(this.device.id).subscribe(
      peripheralObject => this.onConnected(peripheralObject),
      //Device disconnected or there was a failure
      peripheralObject => this.onDisconnected(peripheralObject)
    )
  }

  private onConnected(peripheralObject: any) {
    this.status = 'connection established';

    this.subscribeToServices();
    this.enableSensors();

  }

  private subscribeToServices() {
    //movement sensor
    this.ble.startNotification(this.device.id, this.movementSensor.serviceUUID, this.movementSensor.dataUUID)
      .subscribe(
        data => this.onMovementSensorData(data),
        error => this.onError(error),
      );

    //barometer sensor
    this.ble.startNotification(this.device.id, this.barometerSensor.serviceUUID, this.barometerSensor.dataUUID)
      .subscribe(
        data => this.onBarometerSensorData(data),
        error => this.onError(error)
      );

    //keys
    this.ble.startNotification(this.device.id, this.keySensor.serviceUUID, this.keySensor.dataUUID)
      .subscribe(
        data => this.onKeyData(data),
        error => this.onError(error)
      );
  }

  private enableSensors() {
    let configMovement = new Uint16Array(1);
    configMovement[0] = 0x7F00;

    //movement sensor
    this.ble.write(this.device.id, this.movementSensor.serviceUUID, this.movementSensor.configurationUUID, configMovement.buffer)
      .catch(error => this.onError(error));

    //set period
    let periodData = new Uint8Array(1);
    periodData[0] = 100; // 100*10ms = 1s
    this.ble.write(this.device.id, this.movementSensor.serviceUUID, this.movementSensor.periodUUID, periodData.buffer)
      .catch(error => this.onError(error));

    //barometer sensor
    let configBarometer = new Uint8Array(1);
    configBarometer[0] = 0x01; //enable
    this.ble.write(this.device.id, this.barometerSensor.serviceUUID, this.barometerSensor.configurationUUID, configBarometer.buffer)
      .catch(error => this.onError(error));

  }

  private onError(error: any) {
    this.status = 'Error' + error;
  }

  private onMovementSensorData(data: any) {
    let convertedData = this.movementSensor.convertData(data);
    //TODO implement
  }

  private onBarometerSensorData(data: any) {
    let convertedData = this.barometerSensor.convertData(data);
    //TODO implement
  }

  private onKeyData(data: any) {
    let convertedData = this.keySensor.convertData(data);
    //TODO implement
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
