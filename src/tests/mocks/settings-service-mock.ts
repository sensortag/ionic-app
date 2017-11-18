import {SettingKeys} from "../../services/settings.service";

export class SettingsServiceMock {

  private storage: { [key: string]: any; } = {};

  constructor() {
    this.storage[SettingKeys.IS_STORAGE_INITIALIZED] = true;
    this.storage[SettingKeys.IS_BLUETOOTH_FILTER_ON] = true;
    this.storage[SettingKeys.IP_ADDRESS] = '192.168.10.10';
  }


  public getSetting(key: string): Promise<any> {
    return Promise.resolve(this.storage[key]);

  }


  public setSetting(key: string, value: any) {
    this.storage[key] = value;
  }

}
