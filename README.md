This is an [Ionic](http://ionicframework.com/docs/) app to communicate with the Wifi and Bluetooth [SensorTag](http://www.ti.com/sensortag) from TI.

## Preconditions
 * node.js
 * cli-tools: `npm install -g cordova ionic`
 * platform sepcific sdk, see: https://cordova.apache.org/docs/en/4.0.0/guide/platforms/

## Run the app
To build and then run the app on a connected device use the command `ionic cordova run platform --prod`, where `platform` is `android` or `ios`.

## Testing
To run unit tests run `npm run test`.
To run e2e tests run `ionic serve` and then `npm run e2e`.
For more information see https://github.com/ionic-team/ionic-unit-testing-example.

## Wifi SensorTag CC3200STK-WIFIMK
The app uses the Ionic native [HTTP](https://ionicframework.com/docs/native/http/) plugin. The plugin is used to get the html page param_sensortag_poll.html of the Wifi sensor.
### param_sensortag_poll.html
The body of param_sensortag_poll.html page can look like following:
```html
<body>
  <p id="tmp">090C 0D04 18.09 26.03</p>
  <p id="hum">80DC 66F0 50.34 26.35</p>
  <p id="bar">70F7A0 81F500 26.45 943.48</p>
  <p id="gyr">FEFE 005D 0086 -1.97 0.71 1.02</p>
  <p id="acc">1028 0019 FEAD 1.01 0.01 -0.08</p>
  <p id="opt">059F 14.39</p>
  <p id="mag">00A2 01D6 FE9F 162 470 -353</p>
  <p id="key">0</p>
  <p id="syn">35</p>
</body>
```
All values are available in the hexadecimal and decimal system.<br>
This html file contains following data:

* Ambient Temperature
* Infrared Temperature
* Humidity
* Barometer
* Movement accelerometer
* Movement gyrometer
* Movement magnetometer
* Key pressed
* Illuminance

## Bluetooth SensorTag CC2650STK
The app uses the native Ionic [BLE]( https://ionicframework.com/docs/native/ble/) plugin to communicate with the SensorTag.
Informatino on how to communicate with the Sensortag can be found here:
http://processors.wiki.ti.com/index.php/CC2650_SensorTag_User's_Guide
