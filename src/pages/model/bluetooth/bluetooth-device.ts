/**
 * Data class for a bluetooth device
 */
export class BluetoothDevice {
  private _name: string;
  private _id: string;
  private _rssi: number;
  private _advertising: any;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }

  get advertising(): any {
    return this._advertising;
  }

  set advertising(value: any) {
    this._advertising = value;
  }

  get rssi(): number {
    return this._rssi;
  }

  set rssi(value: number) {
    this._rssi = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

}
