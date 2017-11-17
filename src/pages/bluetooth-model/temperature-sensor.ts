import {Sensor} from "./sensor";

/**
 * The IR temperature sensor in the SensorTag.
 * http://processors.wiki.ti.com/index.php/CC2650_SensorTag_User's_Guide#IR_Temperature_Sensor
 *
 */
export class TemperatureSensor extends Sensor {
  private ambientTemperature: number;
  private infraRedTemperature: number;
  private static SCALE_LSB: number = 0.03125;

  constructor() {
    super(
      'f000aa00-0451-4000-b000-000000000000',
      'f000aa01-0451-4000-b000-000000000000',
      'f000aa02-0451-4000-b000-000000000000',
      'f000aa03-0451-4000-b000-000000000000',
    );
  }

  getAmbientTemperatureAsString(): string {
    return this.temperatureToString(this.ambientTemperature);
  }

  getInfraRedTemperatureAsString(): string {
    return this.temperatureToString(this.infraRedTemperature);
  }

  private temperatureToString(temperature: number): string {
    return temperature.toFixed(2) + ' ℃';
  }

  /**
   * The parameter should have following structure:
   * Object[0:7], Object[8:15], Ambience[0:7], Ambience[8:15]
   *
   * @param data 4 Byte = 2*16Bit
   */
  convertData(data: any) {
    let rawData = new Uint16Array(data);
    this.infraRedTemperature = TemperatureSensor.convertTemperature(rawData[0]);
    this.ambientTemperature = TemperatureSensor.convertTemperature(rawData[1]);
  }

  /**
   *
   * @returns {ArrayBuffer}
   */
  getConfigurationValue(): ArrayBuffer {
    return new Uint8Array([0x01]).buffer; //0x01 = enable
  }

  private static convertTemperature(data: number): number {
    return (data >> 2) * this.SCALE_LSB;
  }
}
