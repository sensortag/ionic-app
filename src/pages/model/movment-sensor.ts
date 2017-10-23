import {Sensor} from "./sensor";

/**
 * The movement sensor in the SensorTag.
 * http://processors.wiki.ti.com/index.php/CC2650_SensorTag_User's_Guide#Movement_Sensor
 *
 */
export class MovementSensor extends Sensor {
  private static accelerometerRange: number = 0; // 0=2G, 1=4G, 2=8G, 3=16G
  private _gyroscope: Array<number> = new Array(3);
  private _accelerometer: Array<number> = new Array(3);
  private _magnetometer: Array<number> = new Array(3);

  constructor() {
    super(
      'f000aa80-0451-4000-b000-000000000000',
      'f000aa81-0451-4000-b000-000000000000',
      'f000aa82-0451-4000-b000-000000000000',
      'f000aa83-0451-4000-b000-000000000000'
    );
  }

  getMagnetometerAsString(): string {
    return 'X: ' + this._magnetometer[0].toFixed(2)
      + ' Y: ' + this._magnetometer[1].toFixed(2)
      + ' Z: ' + this._magnetometer[2].toFixed(2)
      + ' [G]';
  }

  getAccelerometerAsString(): string {
    return 'X: ' + this._accelerometer[0].toFixed(2)
      + ' Y: ' + this._accelerometer[1].toFixed(2)
      + ' Z: ' + this._accelerometer[2].toFixed(2)
      + ' [G]';
  }

  getGyroscopeAsString(): string {
    return 'X: ' + this._gyroscope[0].toFixed(2)
      + ' Y: ' + this._gyroscope[1].toFixed(2)
      + ' Z: ' + this._gyroscope[2].toFixed(2)
      + ' [°/s]';
  }


  get magnetometer(): Array<number> {
    return this._magnetometer;
  }

  get accelerometer(): Array<number> {
    return this._accelerometer;
  }

  get gyroscope(): Array<number> {
    return this._gyroscope;
  }

  /**
   *
   * @param data 18Bytes = 9*16Bit signed
   */
  public convertData(data: any) {
    let rawData = new Int16Array(data);

    //Gyroscope
    this._gyroscope[0] = MovementSensor.sensorMpu9250GyroConvert(rawData[0]);
    this._gyroscope[1] = MovementSensor.sensorMpu9250GyroConvert(rawData[1]);
    this._gyroscope[2] = MovementSensor.sensorMpu9250GyroConvert(rawData[2]);

    //Accelerometer
    this._accelerometer[0] = MovementSensor.sensorMpu9250AccConvert(rawData[3]);
    this._accelerometer[1] = MovementSensor.sensorMpu9250AccConvert(rawData[4]);
    this._accelerometer[3] = MovementSensor.sensorMpu9250AccConvert(rawData[5]);

    //Magnetometer
    this._magnetometer[0] = rawData[6];
    this._magnetometer[1] = rawData[7];
    this._magnetometer[2] = rawData[8];

  }

  /**
   *
   * @returns {ArrayBuffer} 2Bytes
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
     * 0b111111100000000 = 0x7F00
     *
     */
    //TODO use this.accelerometerRange to build config value
    let configMovement = new Uint16Array(1);
    configMovement[0] = 0x7F00;

    return configMovement.buffer;
  }

  private static sensorMpu9250GyroConvert(data: number): number {
    return data[0] / (65536 / 500);
  }

  private static sensorMpu9250AccConvert(data: number): number {
    return data[0] / (32768 / (2 ^ this.accelerometerRange + 1));
  }

}
