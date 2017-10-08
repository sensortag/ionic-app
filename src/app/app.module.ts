import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {WifiSensorTagPage} from "../pages/wifi/WifiSensorTag";

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HTTP} from '@ionic-native/http';

@NgModule({
  declarations: [
    MyApp,
    WifiSensorTagPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WifiSensorTagPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
