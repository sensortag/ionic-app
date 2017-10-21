import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {WifiSensorTagPage} from '../pages/wifi/wifi-sensor-tag.page';
import {BluetoothSensorTagPage} from "../pages/bluetooth/bluetooth-sensor-tag.page";
import {SettingsPage} from '../pages/settings/settings.page';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HTTP} from '@ionic-native/http';
import {BLE} from '@ionic-native/ble';
import {IonicStorageModule} from '@ionic/storage';
import {SettingsService} from "../services/settings.service";

@NgModule({
  declarations: [
    MyApp,
    WifiSensorTagPage,
    BluetoothSensorTagPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WifiSensorTagPage,
    BluetoothSensorTagPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    BLE,
    SettingsService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
