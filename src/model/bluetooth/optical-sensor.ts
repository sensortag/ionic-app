import {Sensor} from "./sensor";

/**
 * The optical sensor in the SensorTag.
 * http://processors.wiki.ti.com/index.php/CC2650_SensorTag_User's_Guide#Optical_Sensor
 */
export class OpticalSensor extends Sensor {

  private illuminance: number = 0;

  constructor() {
    super(
      'f000aa70-0451-4000-b000-000000000000',
      'f000aa71-0451-4000-b000-000000000000',
      'f000aa72-0451-4000-b000-000000000000',
      'f000aa73-0451-4000-b000-000000000000'
    );
  }

  getIlluminanceAsString(): string {
    return this.illuminance.toFixed(2) + ' lx'
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
   * LightLSB:LightMSB
   *
   * @param data 2Bytes
   */
  public convertData(data: any) {
    let rawData = new Uint16Array(data);

    this.illuminance = OpticalSensor.sensorOpt3001Convert(rawData[0]);

  }

  /**
   * Converts the raw illuminance value to Lux.
   *
   * @param {number} rawData
   * @returns {number} lx
   */
  private static sensorOpt3001Convert(rawData: number) {
    let m = rawData & 0x0FFF;
    let e = (rawData & 0xF000) >> 12;

    // e on 4 bits stored in a 16 bit unsigned => it can store 2 << (e - 1) with e < 16
    e = (e == 0) ? 1 : 2 << (e - 1);

    return m * (0.01 * e);
  }

}
