import {Component, Injectable} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Configuration} from "./configuration";

@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
@Injectable()
export class ConfigurationController {
  private config: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private configuration: Configuration) {

    this.config = this.formBuilder.group({
      ipAddress: ['', Validators.required]
    });
    this.configuration.loaded.subscribe((ip) => {
      this.config.setValue({ipAddress: ip});
    })
  }

  saveEvent(event) {
    this.configuration.ipAddress = this.config.value.ipAddress;
  }

}
