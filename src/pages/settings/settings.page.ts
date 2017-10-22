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
              private configuration: SettingsService,
              private toastCtrl: ToastController) {

    this.config = this.formBuilder.group({
      ipAddress: ['0.0.0.0', Validators.required]
    });

    this.configuration.getSetting(SettingKeys.IP_ADDRESS).then(value => {
      this.config.setValue({ipAddress: value});
    })

  }

  /**
   * Save settings.
   */
  saveEvent() {
    this.configuration.setSetting(SettingKeys.IP_ADDRESS, this.config.value.ipAddress);
    let toast = this.toastCtrl.create({
      message: 'settings saved',
      duration: 3000
    });
    toast.present();
  }

}
