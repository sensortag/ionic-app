import {Component, NgZone} from "@angular/core";
import {HTTP, HTTPResponse} from "@ionic-native/http";
import {Diagnostic} from '@ionic-native/diagnostic';
import {SettingKeys, SettingsService} from "../../services/settings.service";
import {IonicPage, Loading, LoadingController, Platform, ToastController} from "ionic-angular";
import {KeyModel} from "../../model/key-model";


/**
 * Handles the communication to the wifi SensorTag.
 */
@IonicPage()
@Component({
  selector: 'page-wifi-sensor-tag',
  templateUrl: 'wifi-sensor-tag.html'
})
export class WifiSensorTagPage {
  private ambientTemperature: string = '0.00';
  private irTemperature: string = '0.00';
  private humidity: string = '0';
  private pressure: string = '0';
  private acceleration: string = 'X: 0.00 Y: 0.00 Z: 0.00';
  private gyroscope: string = "X: 0.00 Y: 0.00 Z: 0.00";
  private magnetometer: string = "X: 0.00 Y: 0.00 Z: 0.00";
  private keyPressed: string = '0';
  private light: string = '0.0';
  private ipAddress: string = '0.0.0.0';
  private keyModel = new KeyModel();

  private status: string = '-';
  private loader: Loading;

  constructor(private http: HTTP,
              private diagnostic: Diagnostic,
              private platform: Platform,
              private toastCtrl: ToastController,
              private settings: SettingsService,
              private loadingCtrl: LoadingController,
              private ngZone: NgZone) {

    this.settings.getSetting(SettingKeys.IP_ADDRESS).then(value => {
      this.ipAddress = value;
    });

  }

  /**
   * Get the html page which contains the SensorTag data.
   */
  refreshEvent() {
    this.platform.ready().then(() => {

      this.diagnostic.isWifiAvailable().then((isWifiAvailable: boolean) => {
        if (isWifiAvailable) {

          this.showLoader();
          this.getWifiSensorData();

        } else {

          let toast = this.toastCtrl.create({
            message: 'Please enable wifi!',
            duration: 4000
          });
          toast.present();

        }

      }).catch((error) =>
        this.setStatusMessage('Error during check if wifi is enabled: ' + error)
      );

    }).catch(() =>
      this.setStatusMessage('Platform not ready!')
    );
  }

  /**
   * Tries to get the wifi sensor data.
   */
  private getWifiSensorData() {
    this.http.get('http://' + this.ipAddress + '/param_sensortag_poll.html', {}, {})
      .then(response => {
        this.dismissLoader();
        this.setStatusMessage(response.status.toString());

        this.parseHtmlFile(response);
      })
      .catch(error => {
        this.dismissLoader();
        this.setStatusMessage(error.status.toString() + ' - ' + error.error);

      });
  }

  /**
   * Parses the param_sensortag_poll.html file.
   *
   * @param {HTTPResponse} response
   */
  private parseHtmlFile(response: HTTPResponse) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(response.data, 'text/html');

    this.ngZone.run(() => {

      this.ambientTemperature = doc.getElementById('tmp').innerHTML.split(' ')[3];
      this.irTemperature = doc.getElementById('tmp').innerHTML.split(' ')[2];
      this.humidity = doc.getElementById('hum').innerHTML.split(' ')[2];
      this.pressure = doc.getElementById('bar').innerHTML.split(' ')[3];
      this.acceleration = 'X: ' + doc.getElementById('acc').innerHTML.split(' ')[3]
        + ' Y: ' + doc.getElementById('acc').innerHTML.split(' ')[4]
        + ' Z: ' + doc.getElementById('acc').innerHTML.split(' ')[5];
      this.gyroscope = 'X: ' + doc.getElementById('gyr').innerHTML.split(' ')[3]
        + ' Y: ' + doc.getElementById('gyr').innerHTML.split(' ')[4]
        + ' Z: ' + doc.getElementById('gyr').innerHTML.split(' ')[5];
      this.magnetometer = 'X: ' + doc.getElementById('mag').innerHTML.split(' ')[3]
        + ' Y: ' + doc.getElementById('mag').innerHTML.split(' ')[4]
        + ' Z: ' + doc.getElementById('mag').innerHTML.split(' ')[5];

      this.keyPressed = this.parsePressedKey(doc.getElementById('key').innerHTML);

      this.light = doc.getElementById('opt').innerHTML.split(' ')[1];

    });
  }

  /**
   * Parses the pressed keys to a string.
   *
   * @returns {string}
   */
  parsePressedKey(pressedKeys: string): string {
    let data = new Uint8Array(1);
    data[0] = parseInt(pressedKeys, 10);
    this.keyModel.convertData(data);
    return this.keyModel.getKeyAsString();
  }

  /**
   * Shows loading symbol.
   */
  private showLoader() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    this.loader.present();
  }

  /**
   * Removes loading symbol.
   */
  private dismissLoader() {
    this.loader.dismiss();
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
