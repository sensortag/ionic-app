import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule, NavController, Platform} from 'ionic-angular';
import {BLE} from "@ionic-native/ble";
import {Diagnostic} from '@ionic-native/diagnostic';

import {PlatformMock} from '../../../test-config/mocks-ionic';
import {BluetoothDeviceSearchPage} from "../../pages/bluetooth-device-search/bluetooth-device-search";
import {BLEMock} from "../mocks/ble-mock";
import {DiagnosticMock} from "../mocks/diagnostic-mock";
import {By} from "@angular/platform-browser/";
import {DebugElement} from "@angular/core";
import {SettingsService} from "../../services/settings.service";
import {IonicStorageModule} from "@ionic/storage";

describe('BluetoothDeviceSearchPage', () => {
  let fixture: ComponentFixture<BluetoothDeviceSearchPage>;
  let component: BluetoothDeviceSearchPage;
  let status: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BluetoothDeviceSearchPage],
      imports: [
        IonicModule.forRoot(BluetoothDeviceSearchPage),
        IonicStorageModule.forRoot(),
      ],
      providers: [
        NavController,
        SettingsService,
        {provide: Platform, useClass: PlatformMock},
        {provide: BLE, useClass: BLEMock},
        {provide: Diagnostic, useClass: DiagnosticMock},
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BluetoothDeviceSearchPage);
    fixture.autoDetectChanges(true);
    component = fixture.componentInstance;
    status = fixture.debugElement.query(By.css('ion-footer p'));
  });

  it('should be created', () => {
    expect(component instanceof BluetoothDeviceSearchPage).toBe(true);
  });

  it('should have status: "Status:"', () => {
    expect(status.nativeElement.textContent.trim()).toBe("Status:");
  });

  it('should have status: "Status: start scanning"', () => {
    let platform = fixture.debugElement.injector.get(Platform)
    spyOn(platform, 'is');

    let scanButton = fixture.debugElement.query(By.css('ion-footer button'));
    scanButton.triggerEventHandler('click',null);

    expect(platform.is).toHaveBeenCalled();




  });

});


