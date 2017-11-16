import {Injectable} from "@angular/core";
import {Platform} from "ionic-angular";
import {BLE} from "@ionic-native/ble";
import {Diagnostic} from "@ionic-native/diagnostic";
import {Observable} from "rxjs/Observable";

/**
 *
 */
@Injectable()
export class BleScanService {
  private enableBluetoothMessage = 'Please enable bluetooth!';
  private scanningTime: number = 10; // time in s

  constructor(private platform: Platform,
              private diagnostic: Diagnostic,
              private ble: BLE,) {

  }

  startScanningForBleDevices(): Observable<any> {
    let osServicesReady: Promise<any>;
    return new Observable(observer => {
      if (this.platform.is('android')) {
        osServicesReady = this.isAndroidReadyForScanning()
      } else if (this.platform.is('ios')) {
        osServicesReady = this.isIOSReadyForScanning();
      } else {
        observer.error('Platform not supported');
      }
      if (osServicesReady != null) {
        osServicesReady.then(() => this.startScanning(observer))
          .catch(error => observer.error(error));
      }
    });
  }

  /**
   *  Checks if bluetooth and the location service is enabled.
   */
  private isAndroidReadyForScanning(): Promise<any> {
    return this.ble.enable().then(() => {
      return this.diagnostic.isLocationEnabled().then((locationEnabled) => {
        if (locationEnabled) {
          return Promise.resolve();
        } else {
          return Promise.reject('Please enable the location service');
        }
      }).catch((error) => {
        return Promise.reject('Error checking location service: ' + error);
      });
    }).catch(() => {
      return Promise.reject(this.enableBluetoothMessage);
    });
  }

  /**
   * Checks if bluetooth is enabled.
   */
  private isIOSReadyForScanning(): Promise<any> {
    return this.ble.isEnabled().then(() => {
      return Promise.resolve();
    }).catch(() => {
      return Promise.reject(this.enableBluetoothMessage);
    });
  }

  /**
   * Scans for bluetooth devices.
   */
  private startScanning(observer) {
    this.ble.scan([], this.scanningTime).subscribe(
      device => observer.next(device),
      error => observer.error(error)
    );
    // set a timeout function to reset the status,
    // because complete of ble.scan(..).subscribe is never called
    setTimeout(() => {
      observer.complete();
    }, this.scanningTime * 1000);
  }


}
