import {Sensor} from "./sensor";
import {KeyModel} from "../key-model";

/**
 * The simple key sensor in the SensorTag.
 * http://processors.wiki.ti.com/index.php/CC2650_SensorTag_User's_Guide#Simple_Keys_Service
 */
export class KeySensor extends Sensor {
  private key: KeyModel = new KeyModel();

  constructor() {
    super(
      'ffe0',
      'ffe1',
      '',
      ''
    );
  }

  getKeyAsString(): string {
    return this.key.getKeyAsString();
  }

  /**
   * Converts the key data.
   *
   * @param data 1 Byte
   */
  convertData(data: any) {
    this.key.convertData(data);
  }

  /**
   * no configuration
   * @returns {ArrayBuffer}
   */
  getConfigurationValue(): ArrayBuffer {
    return new Uint8Array(0).buffer;
  }
}
