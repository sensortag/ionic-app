import {Sensor} from "./sensor";

/**
 * The humidity sensor in the SensorTag.
 * http://processors.wiki.ti.com/index.php/CC2650_SensorTag_User's_Guide#Humidity_Sensor
 */
export class HumiditySensor extends Sensor {

  private temperature: number = 0;
  private humidity: number = 0;

  constructor() {
    super(
      'f000aa20-0451-4000-b000-000000000000',
      'f000aa21-0451-4000-b000-000000000000',
      'f000aa22-0451-4000-b000-000000000000',
      'f000aa23-0451-4000-b000-000000000000'
    );
  }

  getTemperatureAsString(): string {
    return this.temperature.toFixed(2) + ' ℃'
  }

  getHumidityAsString(): string {
    return this.humidity.toFixed(1) + ' %RH';
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
   * Temp[0:7], Temp[8:15], Hum[0:7], Hum[8:15]
   *
   * @param data 4Bytes
   */
  public convertData(data: any) {
    let rawData = new Uint16Array(data);

    //temperature byte 0-1 in degrees Celsius
    this.temperature = HumiditySensor.sensorHdc1000ConvertTemperature(rawData[0]);

    //humidity byte 2-4 in %RH
    this.humidity = HumiditySensor.sensorHdc1000ConvertHumidity(rawData[1]);
  }

  /**
   * Converts the raw temperature value to ℃.
   *
   * @param {number} rawTemperature
   * @returns {number} ℃
   */
  private static sensorHdc1000ConvertTemperature(rawTemperature: number): number {
    return (rawTemperature / 65536) * 165 - 40;
  }

  /**
   * Converts the raw humidity value to %RH.
   *
   * @param {number} rawHumidity
   * @returns {number} %RH
   */
  private static sensorHdc1000ConvertHumidity(rawHumidity: number): number {
    rawHumidity &= ~0x0003; // remove status bits
    return (rawHumidity / 65536) * 100;
  }

}
