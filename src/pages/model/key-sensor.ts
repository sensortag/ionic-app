import {Sensor} from "./sensor";

/**
 * The simple key sensor in the SensorTag.
 * http://processors.wiki.ti.com/index.php/CC2650_SensorTag_User's_Guide#Simple_Keys_Service
 */
export class KeySensor extends Sensor {
  private leftKey: boolean = false;
  private rightKey: boolean = false;
  private reedRelay: boolean = false;


  constructor() {
    super(
      '0000ffe0-0000-1000-8000-00805f9b34fb',
      '0000ffe1-0000-1000-8000-00805f9b34fb',
      '',
      ''
    );
  }

  getKeyAsString() {
    let keys: string = '';
    if (this.leftKey) keys += 'left key ';
    if (this.rightKey) keys += 'right key ';
    if (this.reedRelay) keys += 'reed relay';
    return keys.trim();
  }

  /**
   *
   * @param data 1 Byte
   */
  convertData(data: any) {
    //Bit 0: left key (user button)
    this.leftKey = (data[0] << 7) == 0x10;
    //Bit 1: right key (power button)
    this.rightKey = ((data[0] >> 1) << 7) == 0x10;
    //Bit 2: reed relay
    this.reedRelay = ((data[0] >> 2) << 7) == 0x10;
  }

  /**
   * no configuration
   * @returns {ArrayBuffer}
   */
  getConfigurationValue(): ArrayBuffer {
    return new Uint8Array(0).buffer;
  }
}
