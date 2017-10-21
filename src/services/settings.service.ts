import {Storage} from '@ionic/storage';
import {Injectable} from "@angular/core";

export class SettingKeys {
  public static IP_ADDRESS = 'IP_ADDRESS';

}

/**
 Data class for the app configuration.
 */
@Injectable()
export class SettingsService {
  constructor(private storage: Storage) {

  }

  public getSetting(key: string): Promise<string> {
    return this.storage.get(key);
  }

  public setSetting(key: string, value: string) {
    this.storage.ready().then(() => {
      this.storage.set(key.toString(), value)
        .catch(() => {
          console.log('failed to save')
        })
    });

  }
}
