import {Sensor} from "./sensor";

/**
 * The barometer sensor in the SensorTag.
 * http://processors.wiki.ti.com/index.php/CC2650_SensorTag_User's_Guide#Barometric_Pressure_Sensor
 */
export class BarometerSensor extends Sensor {

  private _temperature: number = 0;
  private _pressure: number = 0;

  constructor() {
    super(
      'f000aa40-0451-4000-b000-000000000000',
      'f000aa41-0451-4000-b000-000000000000',
      'f000aa42-0451-4000-b000-000000000000',
      'f000aa44-0451-4000-b000-000000000000'
    );
  }

  getTemperatureAsString(): string {
    return this._temperature.toFixed(2) + ' ℃'
  }

  getPressureAsString(): string {
    return this._pressure + ' mBar';
  }

  get temperature(): number {
    return this._temperature;
  }

  get pressure(): number {
    return this._pressure;
  }

  /**
   *
   * @returns {ArrayBuffer} 1Byte
   */
  public getConfigurationValue(): ArrayBuffer {
    return new Uint8Array([0x01]).buffer; //0x01 = enable barometer
  }

  /**
   *
   * @param data 6Bytes
   */
  public convertData(data: any) {
    let rawData = new Uint8Array(data);

    //temperature byte 0-2 in degrees Celsius
    this._temperature = BarometerSensor.sensorBmp280Convert(rawData[0] << 16 + rawData[1] << 8 + rawData[2]);

    //pressure byte 3-5 in hectopascal
    this._pressure = BarometerSensor.sensorBmp280Convert(rawData[3] << 16 + rawData[4] << 8 + rawData[5]);
  }

  private static sensorBmp280Convert(rawValue: number): number {
    return rawValue[0] / 100;
  }

}
