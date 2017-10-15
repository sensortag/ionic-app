import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {WifiSensorTagPage} from '../pages/wifi/wifi-sensor-tag.component';
import {ConfigurationController} from '../pages/config/config.component';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HTTP} from '@ionic-native/http';
import {IonicStorageModule} from '@ionic/storage';
import {Configuration} from "../pages/config/configuration";

@NgModule({
  declarations: [
    MyApp,
    WifiSensorTagPage,
    ConfigurationController
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
    ConfigurationController
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    Configuration,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
