import {Sensor} from "./sensor";

/**
 * The barometer sensor in the SensorTag.
 * http://processors.wiki.ti.com/index.php/CC2650_SensorTag_User's_Guide#Barometric_Pressure_Sensor
 */
export class BarometerSensor extends Sensor {

  private temperature: number = 0;
  private pressure: number = 0;

  constructor() {
    super(
      'f000aa40-0451-4000-b000-000000000000',
      'f000aa41-0451-4000-b000-000000000000',
      'f000aa42-0451-4000-b000-000000000000',
      'f000aa44-0451-4000-b000-000000000000'
    );
  }

  getTemperatureAsString(): string {
    return this.temperature.toFixed(2) + ' ℃'
  }

  getPressureAsString(): string {
    return this.pressure + ' mBar';
  }

  /**
   * The configuration value is 0x01 -> enable measurement.
   *
   * @returns {ArrayBuffer} configuration value 1Byte
   */
  public getConfigurationValue(): ArrayBuffer {
    return new Uint8Array([0x01]).buffer; //0x01 = enable barometer
  }

  /**
   * The parameter should have the following structure:
   * Temp[0:7], Temp[8:15], Temp[16:23], Press[0:7], Press[8:15], Press[16:23]
   *
   * @param data 6Bytes
   */
  public convertData(data: any) {
    let rawData = new Uint8Array(data);
    //

    //temperature byte 0-2 in degrees Celsius
    this.temperature = BarometerSensor.sensorBmp280Convert(rawData[0] | (rawData[1] << 8) | (rawData[2] << 16));

    //pressure byte 3-5 in hectopascal
    this.pressure = BarometerSensor.sensorBmp280Convert(rawData[3] | (rawData[4] << 8) | (rawData[5] << 16));
  }

  /**
   * Converts the raw pressure value and temperature value.
   *
   * @param {number} rawValue
   * @returns {number} converted value
   */
  private static sensorBmp280Convert(rawValue: number): number {
    return rawValue / 100;
  }

}
