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
  private barometerTemperature = '0';
  private accelerometer: string = 'X: 0.00 Y: 0.00 Z: 0.00';
  private gyroscope: string = 'X: 0.00 Y: 0.00 Z: 0.00';
  private magnetometer: string = 'X: 0.00 Y: 0.00 Z: 0.00';
  private keysPressed: string = '0';
  private light: string = '0.0';
  private status: string = 'init';

  private device: BluetoothDevice;
  //TODO reduce coupling
  private movementSensor = new MovementSensor();
  private barometerSensor = new BarometerSensor();
  private keySensor = new KeySensor();

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

    //movement sensor
    this.ble.write(this.device.id, this.movementSensor.serviceUUID,
      this.movementSensor.configurationUUID, this.movementSensor.getConfigurationValue())
      .catch(error => this.onError(error));

    //barometer sensor
    this.ble.write(this.device.id, this.barometerSensor.serviceUUID,
      this.barometerSensor.configurationUUID, this.barometerSensor.getConfigurationValue())
      .catch(error => this.onError(error));

  }

  private onError(error: any) {
    this.status = 'Error' + error;
  }

  private onMovementSensorData(data: any) {
    this.movementSensor.convertData(data);
    this.accelerometer = this.movementSensor.getAccelerometerAsString();
    this.gyroscope = this.movementSensor.getGyroscopeAsString();
    this.magnetometer = this.movementSensor.getMagnetometerAsString();
  }

  private onBarometerSensorData(data: any) {
    this.barometerSensor.convertData(data);
    this.barometerTemperature = this.barometerSensor.getTemperatureAsString();
    this.pressure = this.barometerSensor.getPressureAsString();
  }

  private onKeyData(data: any) {
    this.keySensor.convertData(data);
    this.keysPressed = this.keySensor.getKeyAsString();
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
