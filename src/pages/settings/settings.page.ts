import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
      ipAddress: ['0.0.0.0', Validators.required],
      bluetoothFilter:[1, Validators.required]
    });

    this.settingsService.getSetting(SettingKeys.IP_ADDRESS).then(value => {
      this.config.patchValue({ipAddress: <boolean> value});
    });

    this.settingsService.getSetting(SettingKeys.IS_BLUETOOTH_FILTER_ON).then(value => {
      this.config.patchValue({bluetoothFilter: value});
    });

  }

  /**
   * Save settings.
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
