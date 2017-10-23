import {Component} from "@angular/core";
import {HTTP, HTTPResponse} from "@ionic-native/http";
import {SettingKeys, SettingsService} from "../../services/settings.service";
import {IonicPage, Loading, LoadingController} from "ionic-angular";


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

  private status: number;
  private error: string = '-';
  private loader: Loading;

  constructor(private http: HTTP,
              private settings: SettingsService,
              private loadingCtrl: LoadingController) {

    this.settings.getSetting(SettingKeys.IP_ADDRESS).then(value => {
      this.ipAddress = value;
    });

  }

  /**
   * Get the html page which contains the SensorTag data.
   */
  refreshEvent() {
    this.showLoader();
    this.http.get('http://' + this.ipAddress + '/param_sensortag_poll.html', {}, {})
      .then(response => {
        this.dismissLoader();
        this.status = response.status;
        this.error = "";

        this.parseHtmlFile(response);
      })
      .catch(error => {
        this.dismissLoader();
        this.status = error.status;
        this.error = error.error;

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

    this.ambientTemperature = doc.getElementById('tmp').innerHTML.split(' ')[3];
    this.irTemperature = doc.getElementById('tmp').innerHTML.split(' ')[2];
    this.humidity = doc.getElementById('hum').innerHTML.split(' ')[2];
    this.pressure = doc.getElementById('bar').innerHTML.split(' ')[3];
    this.acceleration = 'X: ' + doc.getElementById('acc').innerHTML.split(' ')[3]
      + ' Y:' + doc.getElementById('acc').innerHTML.split(' ')[4]
      + ' Z: ' + doc.getElementById('acc').innerHTML.split(' ')[5];
    this.gyroscope = 'X: ' + doc.getElementById('gyr').innerHTML.split(' ')[3]
      + ' Y:' + doc.getElementById('gyr').innerHTML.split(' ')[4]
      + ' Z: ' + doc.getElementById('gyr').innerHTML.split(' ')[5];
    this.magnetometer = 'X: ' + doc.getElementById('mag').innerHTML.split(' ')[3]
      + ' Y:' + doc.getElementById('mag').innerHTML.split(' ')[4]
      + ' Z: ' + doc.getElementById('mag').innerHTML.split(' ')[5];
    this.keyPressed = doc.getElementById('key').innerHTML;
    this.light = doc.getElementById('opt').innerHTML.split(' ')[1];

  }

  private showLoader() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    this.loader.present();
  }

  private dismissLoader() {
    this.loader.dismiss();
  }
}
