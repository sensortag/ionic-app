import {Storage} from '@ionic/storage';
import {Injectable} from "@angular/core";

export class SettingKeys {
  public static IP_ADDRESS = 'IP_ADDRESS';
  public static IS_BLUETOOTH_FILTER_ON = 'IS_BLUETOOTH_FILTER_ON';
}

/**
 * Offers methods to store and restore settings.
 */
@Injectable()
export class SettingsService {
  constructor(private storage: Storage) {

  }

  public getSetting(key: string): Promise<any> {
    return this.storage.get(key);
  }

  //TODO return promise
  public setSetting(key: string, value: any) {
    this.storage.ready().then(() => {
      this.storage.set(key.toString(), value)
        .catch(() => {
          console.log('failed to save')
        })
    });

  }
}
