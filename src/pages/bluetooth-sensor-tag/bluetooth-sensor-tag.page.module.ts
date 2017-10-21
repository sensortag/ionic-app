import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BluetoothSensorTagPage} from "./bluetooth-sensor-tag.page";
import {BLE} from "@ionic-native/ble";

@NgModule({
  declarations: [
    BluetoothSensorTagPage,
  ],
  imports: [
    IonicPageModule.forChild(BluetoothSensorTagPage),
  ],
  providers: [
    BLE,
  ]
})
export class BluetoothSensorTagPageModule {
}
