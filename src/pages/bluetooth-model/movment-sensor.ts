import {Sensor} from "./sensor";

/**
 * The movement sensor in the SensorTag.
 * http://processors.wiki.ti.com/index.php/CC2650_SensorTag_User's_Guide#Movement_Sensor
 *
 */
export class MovementSensor extends Sensor {
  private static _accelerometerRange: number = 2; // 0 = 2G, 1 = 4G, 2 = 8G, 3 = 16G

  private gyroscope: Array<number> = new Array(3);
  private accelerometer: Array<number> = new Array(3);
  private magnetometer: Array<number> = new Array(3);

  constructor() {
    super(
      'f000aa80-0451-4000-b000-000000000000',
      'f000aa81-0451-4000-b000-000000000000',
      'f000aa82-0451-4000-b000-000000000000',
      'f000aa83-0451-4000-b000-000000000000'
    );
  }

  /**
   * Returns the range of the accelerometer.
   *
   * @returns {number} 0 = 2G, 1 = 4G, 2 = 8G, 3 = 16G
   */
  static get accelerometerRange(): number {
    return this._accelerometerRange;
  }

  /**
   * Set the range of the accelerometer.
   *
   * @param {number} value 0 = 2G, 1 = 4G, 2 = 8G, 3 = 16G
   */
  static set accelerometerRange(value: number) {
    if (value => 0 && value <= 3) {
      this._accelerometerRange = value;
    }
  }

  getMagnetometerAsString(): string {
    return 'X: ' + this.magnetometer[0].toFixed(0)
      + ', Y: ' + this.magnetometer[1].toFixed(0)
      + ', Z: ' + this.magnetometer[2].toFixed(0)
      + ' [uT]';
  }

  getAccelerometerAsString(): string {
    return 'X: ' + this.accelerometer[0].toFixed(2)
      + ', Y: ' + this.accelerometer[1].toFixed(2)
      + ', Z: ' + this.accelerometer[2].toFixed(2)
      + ' [G]';
  }

  getGyroscopeAsString(): string {
    return 'X: ' + this.gyroscope[0].toFixed(2)
      + ', Y: ' + this.gyroscope[1].toFixed(2)
      + ', Z: ' + this.gyroscope[2].toFixed(2)
      + ' [°/s]';
  }

  /**
   * Converts the movement sensor data.
   *
   * @param data 18Bytes = 9*16Bit signed
   */
  public convertData(data: any) {
    let rawData = new Int16Array(data);

    //Gyroscope
    this.gyroscope[0] = MovementSensor.sensorMpu9250GyroConvert(rawData[0]);
    this.gyroscope[1] = MovementSensor.sensorMpu9250GyroConvert(rawData[1]);
    this.gyroscope[2] = MovementSensor.sensorMpu9250GyroConvert(rawData[2]);

    //Accelerometer
    this.accelerometer[0] = MovementSensor.sensorMpu9250AccConvert(rawData[3]);
    this.accelerometer[1] = MovementSensor.sensorMpu9250AccConvert(rawData[4]);
    this.accelerometer[2] = MovementSensor.sensorMpu9250AccConvert(rawData[5]);

    //Magnetometer
    this.magnetometer[0] = rawData[6];
    this.magnetometer[1] = rawData[7];
    this.magnetometer[2] = rawData[8];

  }

  /**
   * Puts together the configuration value for the movement service.
   *
   * @returns {ArrayBuffer} configuration value 2Bytes
   */
  public getConfigurationValue(): ArrayBuffer {
    /* Bit  Usage
     *  0 	Gyroscope z axis enable
     *  1 	Gyroscope y axis enable
     *  2 	Gyroscope x axis enable
     *  3 	Accelerometer z axis enable
     *  4 	Accelerometer y axis enable
     *  5 	Accelerometer x axis enable
     *  6 	Magnetometer enable (all axes)
     *  7 	Wake-On-Motion Enable
     *  8:9 	Accelerometer range (0=2G, 1=4G, 2=8G, 3=16G)
     *  10:15 	Not used
     *
     * Gyro (all axis), Acc (all axis), Mag (all axis) & wake on motion enabled & acc range 2G
     * 0b000000011111111 = 0x00FF
     *
     */
    let configMovement = new Uint16Array(1);
    configMovement[0] = 0x00FF | (MovementSensor._accelerometerRange << 8);

    return configMovement.buffer;
  }

  /**
   * Convert the gyroscope raw value to °/s.
   *
   * @param {number} rawValue
   * @returns {number} °/s
   */
  private static sensorMpu9250GyroConvert(rawValue: number): number {
    return rawValue / (65536 / 500);
  }

  /**
   * Convert the accelerometer raw value to G.
   *
   * @param {number} rawValue
   * @returns {number} G
   */
  private static sensorMpu9250AccConvert(rawValue: number): number {
    return rawValue / (32768 / (Math.pow(2, MovementSensor._accelerometerRange + 1)));
  }

}
