import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SettingKeys, SettingsService} from "../../services/settings.service";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  private config: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private configuration: SettingsService) {

    this.config = this.formBuilder.group({
      ipAddress: ['0.0.0.0', Validators.required]
    });

    this.configuration.getSetting(SettingKeys.IP_ADDRESS).then(value => {
      this.config.setValue({ipAddress: value});
    })

  }

  saveEvent() {
    this.configuration.setSetting(SettingKeys.IP_ADDRESS, this.config.value.ipAddress);
  }

}
