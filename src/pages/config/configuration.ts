import {Storage} from '@ionic/storage';
import {Injectable} from "@angular/core";
import {ReplaySubject} from "rxjs/ReplaySubject";

/**
 Data class for the app configuration.
 */

@Injectable()
export class Configuration {
  private _ipAddress: string;
  //TODO clean up mess: find better way to wait until data is loaded
  loaded: ReplaySubject<string> = new ReplaySubject<string>(1);

  constructor(private storage: Storage) {
    this.storage.ready().then(() => {
        this.storage.get('configuration').then(value => {
          this.ipAddress = value;
          this.loaded.next(value);
        }).catch(() => {
          this.ipAddress = 'failed to load';
        })
      }
    )
  }

  public get ipAddress(): string {
    return this._ipAddress;
  }

  public set ipAddress(value: string) {
    this._ipAddress = value;
    this.storage.ready().then(() => {
      this.storage.set('configuration', value)
        .catch(() => {
          console.log('failed to save')
        })
    });
  }
}
