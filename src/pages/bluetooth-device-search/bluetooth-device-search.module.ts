import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BluetoothDeviceSearchPage} from './bluetooth-device-search';
import {BLE} from "@ionic-native/ble";
import {Diagnostic} from '@ionic-native/diagnostic';
import {BleScanService} from "../../services/ble-scan.service";

@NgModule({
  declarations: [
    BluetoothDeviceSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(BluetoothDeviceSearchPage),
  ],
  providers: [
    BLE,
    Diagnostic,
    BleScanService,
  ]
})
export class BluetoothDeviceSearchPageModule {
}
