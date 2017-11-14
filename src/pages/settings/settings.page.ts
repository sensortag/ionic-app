import {Component} from "@angular/core";
import {FormBuilder, FormGroup} from '@angular/forms';
import {SettingKeys, SettingsService} from "../../services/settings.service";
import {IonicPage, ToastController} from "ionic-angular";

/**
 * Page to maintain app settings.
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  private config: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private settingsService: SettingsService,
              private toastCtrl: ToastController) {

    this.config = this.formBuilder.group({
      // default settings
      ipAddress: ['192.168.1.1'],
      bluetoothFilter: [1]
    });

    this.settingsService.getSetting(SettingKeys.IS_STORAGE_INITIALIZED).then(value => {
      if (value == null) {
        // initialize settings
        this.settingsService.setSetting(SettingKeys.IS_STORAGE_INITIALIZED, true);
        this.saveEvent();
      } else {
        // get data from settings
        this.getDataFromSettings();
      }
    });
  }

  /**
   * Loads all data from the settings.
   *
   * @returns {any}
   */
  getDataFromSettings(): any {
    this.settingsService.getSetting(SettingKeys.IP_ADDRESS).then(value => {
      this.config.patchValue({ipAddress: <boolean> value});
    });

    this.settingsService.getSetting(SettingKeys.IS_BLUETOOTH_FILTER_ON).then(value => {
      this.config.patchValue({bluetoothFilter: value});
    });
  }

  /**
   * Saves all data to the settings.
   */
  saveEvent() {
    this.settingsService.setSetting(SettingKeys.IP_ADDRESS, this.config.value.ipAddress);
    this.settingsService.setSetting(SettingKeys.IS_BLUETOOTH_FILTER_ON, this.config.value.bluetoothFilter);

    let toast = this.toastCtrl.create({
      message: 'settings saved',
      duration: 3000
    });
    toast.present();
  }

}
