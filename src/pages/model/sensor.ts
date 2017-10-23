/**
 * Data class for a sensor of the SensorTag.
 */

export abstract class Sensor {
  private _serviceUUID: string;
  private _dataUUID: string;
  private _configurationUUID: string;
  private _periodUUID: string;

  constructor(serviceUUID: string, dataUUID: string, configurationUUID: string, periodUUID: string) {
    this._serviceUUID = serviceUUID;
    this._dataUUID = dataUUID;
    this._configurationUUID = configurationUUID;
    this._periodUUID = periodUUID;
  }

  get periodUUID(): string {
    return this._periodUUID;
  }

  set periodUUID(value: string) {
    this._periodUUID = value;
  }

  get configurationUUID(): string {
    return this._configurationUUID;
  }

  set configurationUUID(value: string) {
    this._configurationUUID = value;
  }

  get dataUUID(): string {
    return this._dataUUID;
  }

  set dataUUID(value: string) {
    this._dataUUID = value;
  }

  get serviceUUID(): string {
    return this._serviceUUID;
  }

  set serviceUUID(value: string) {
    this._serviceUUID = value;
  }

  public abstract convertData(data: any): any;

  public abstract getConfigurationValue(): ArrayBuffer;
}
