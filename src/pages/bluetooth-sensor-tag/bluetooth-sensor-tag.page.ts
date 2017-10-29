import {Component, NgZone} from "@angular/core";
import {BLE} from "@ionic-native/ble";
import {IonicPage, NavController, NavParams, ToastController} from "ionic-angular";
import {BluetoothDevice} from "../model/device";
import {MovementSensor} from "../model/movment-sensor";
import {BarometerSensor} from "../model/barometer-sensor";
import {KeySensor} from "../model/key-sensor";
import {TemperatureSensor} from "../model/temperature-sensor";
import {HumiditySensor} from "../model/humidity-sensor";

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
  private humiditySensorTemperature: string;
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
  private temperatureSensor = new TemperatureSensor();
  private humiditySensor = new HumiditySensor();

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private toastCtrl: ToastController, private ble: BLE,
              private ngZone: NgZone) {
    this.device = navParams.data;

    this.ble.connect(this.device.id).subscribe(
      peripheralObject => this.onConnected(peripheralObject),
      // device disconnected or there was a failure
      peripheralObject => this.onDisconnected(peripheralObject)
    )
  }

  private onConnected(peripheralObject: any) {
    this.status = 'connection established';

    this.subscribeToServices();
    this.enableSensors();

  }

  private subscribeToServices() {
    // movement sensor
    this.ble.startNotification(this.device.id, this.movementSensor.serviceUUID, this.movementSensor.dataUUID)
      .subscribe(
        data => this.onMovementSensorData(data),
        error => this.onError(error),
      );

    // barometer sensor
    this.ble.startNotification(this.device.id, this.barometerSensor.serviceUUID, this.barometerSensor.dataUUID)
      .subscribe(
        data => this.onBarometerSensorData(data),
        error => this.onError(error)
      );

    // keys
    this.ble.startNotification(this.device.id, this.keySensor.serviceUUID, this.keySensor.dataUUID)
      .subscribe(
        data => this.onKeyData(data),
        error => this.onError(error)
      );

    // temperature sensor
    this.ble.startNotification(this.device.id, this.temperatureSensor.serviceUUID, this.temperatureSensor.dataUUID)
      .subscribe(
        data => this.onTemperatureSensorData(data),
        error => this.onError(error)
      );

    // humidity sensor
    this.ble.startNotification(this.device.id, this.humiditySensor.serviceUUID, this.humiditySensor.dataUUID)
      .subscribe(
        data => this.onHumiditySensorData(data),
        error => this.onError(error)
      );

  }

  private enableSensors() {

    // movement sensor
    this.ble.write(this.device.id, this.movementSensor.serviceUUID,
      this.movementSensor.configurationUUID, this.movementSensor.getConfigurationValue())
      .catch(error => this.onError(error));

    // barometer sensor
    this.ble.write(this.device.id, this.barometerSensor.serviceUUID,
      this.barometerSensor.configurationUUID, this.barometerSensor.getConfigurationValue())
      .catch(error => this.onError(error));

    // temperature sensor
    this.ble.write(this.device.id, this.temperatureSensor.serviceUUID,
      this.temperatureSensor.configurationUUID, this.temperatureSensor.getConfigurationValue())
      .catch(error => this.onError(error));

    // humidity sensor
    this.ble.write(this.device.id, this.humiditySensor.serviceUUID,
      this.humiditySensor.configurationUUID, this.humiditySensor.getConfigurationValue())
      .catch(error => this.onError(error));

  }

  private onError(error: any) {
    this.ngZone.run(() => {
      this.status = 'Error' + error;
      this.showToast(error);
    });
  }

  private onMovementSensorData(data: any) {
    this.movementSensor.convertData(data);
    this.ngZone.run(() => {
      this.accelerometer = this.movementSensor.getAccelerometerAsString();
      this.gyroscope = this.movementSensor.getGyroscopeAsString();
      this.magnetometer = this.movementSensor.getMagnetometerAsString();
    });
  }

  private onBarometerSensorData(data: any) {
    this.barometerSensor.convertData(data);
    this.ngZone.run(() => {
      this.barometerTemperature = this.barometerSensor.getTemperatureAsString();
      this.pressure = this.barometerSensor.getPressureAsString();
    });
  }

  private onKeyData(data: any) {
    this.keySensor.convertData(data);
    this.ngZone.run(() => this.keysPressed = this.keySensor.getKeyAsString());
  }

  private onTemperatureSensorData(data: any) {
    this.temperatureSensor.convertData(data);
    this.ngZone.run(() => {
      this.ambientTemperature = this.temperatureSensor.getAmbientTemperatureAsString();
      this.irTemperature = this.temperatureSensor.getInfraRedTemperatureAsString();
    });
  }

  private onHumiditySensorData(data: any) {
    this.humiditySensor.convertData(data);
    this.ngZone.run(() => {
      this.humidity = this.humiditySensor.getHumidityAsString();
      this.humiditySensorTemperature = this.humiditySensor.getTemperatureAsString();
    });
  }

  private onDisconnected(peripheralObject: any) {
    let message = 'device disconnected';
    this.status = message;
    this.showToast(message)
  }

  /**
   * Disconnect the device.
   */
  ionViewWillLeave() {
    this.ble.disconnect(this.device.id).catch(
      () => this.showToast('disconnect failed')
    )
  }

  private showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
