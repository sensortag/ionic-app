import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {WifiSensorTagPage} from "./wifi-sensor-tag.page";
import {HTTP} from '@ionic-native/http';
import {Diagnostic} from "@ionic-native/diagnostic";

@NgModule({
  declarations: [
    WifiSensorTagPage,
  ],
  imports: [
    IonicPageModule.forChild(WifiSensorTagPage),
  ],
  providers: [
    HTTP,
    Diagnostic,
  ]
})
export class WifiSensorTagPageModule {
}
