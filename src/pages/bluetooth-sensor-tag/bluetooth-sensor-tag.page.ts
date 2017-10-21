import {Component} from "@angular/core";
import {BLE} from "@ionic-native/ble";
import {SettingsService} from "../../services/settings.service";
import {IonicPage} from "ionic-angular";

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
  private deviceName: string = 'CC2650 SensorTag';
  private status: number;
  private error: string;

  constructor(private ble: BLE,
              private settings: SettingsService) {

  }

  refreshEvent() {

  }


}
