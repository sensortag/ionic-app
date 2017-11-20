import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule, NavController, Platform} from 'ionic-angular';
import {BLE} from "@ionic-native/ble";
import {Diagnostic} from '@ionic-native/diagnostic';

import {PlatformMock} from '../mocks/mocks-ionic';
import {BluetoothDeviceSearchPage} from "../../pages/bluetooth-device-search/bluetooth-device-search.page";
import {BLEMock} from "../mocks/ble-mock";
import {DiagnosticMock} from "../mocks/diagnostic-mock";
import {By} from "@angular/platform-browser/";
import {DebugElement} from "@angular/core";
import {SettingKeys, SettingsService} from "../../services/settings.service";
import {IonicStorageModule} from "@ionic/storage";
import {BleScanService} from "../../services/ble-scan.service";
import {Observable} from "rxjs/Observable";
import {BluetoothDevice} from "../../pages/model/bluetooth/bluetooth-device";
import {SettingsServiceMock} from "../mocks/settings-service-mock";

describe('BluetoothDeviceSearchPage', () => {
  let fixture: ComponentFixture<BluetoothDeviceSearchPage>;
  let component: BluetoothDeviceSearchPage;
  let status: DebugElement;
  let originalTimeout;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BluetoothDeviceSearchPage],
      imports: [
        IonicModule.forRoot(BluetoothDeviceSearchPage),
        IonicStorageModule.forRoot(),
      ],
      providers: [
        NavController,
        BleScanService,
        {provide: SettingsService, useClass: SettingsServiceMock},
        {provide: Platform, useClass: PlatformMock},
        {provide: BLE, useClass: BLEMock},
        {provide: Diagnostic, useClass: DiagnosticMock},
      ]
    })
  }));

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    fixture = TestBed.createComponent(BluetoothDeviceSearchPage);
    fixture.autoDetectChanges(true);
    component = fixture.componentInstance;

    status = fixture.debugElement.query(By.css('ion-footer p'));

  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should be created', () => {
    expect(component instanceof BluetoothDeviceSearchPage).toBe(true);
  });

  it('should have status: "Status:"', () => {
    expect(status.nativeElement.textContent.trim()).toBe("Status:");
  });

  it('should have status: "Status: start scanning" and should receive a device', (done) => {
    let platform = fixture.debugElement.injector.get(Platform);
    let ble = fixture.debugElement.injector.get(BLE);
    let settings = fixture.debugElement.injector.get(SettingsService);

    spyOn(platform, 'is').and.callThrough();
    spyOn(ble, 'enable').and.callThrough();

    let bluetoothDevice = new BluetoothDevice('CC2650 SensorTag', '123456');

    spyOn(ble, 'scan').and.returnValue(new Observable(observer => {
        observer.next(bluetoothDevice)
      })
    );

    settings.setSetting(SettingKeys.IS_BLUETOOTH_FILTER_ON, true);

    let scanButton = fixture.debugElement.query(By.css('ion-footer button'));
    scanButton.triggerEventHandler('click', null);

    setTimeout(() => {
      expect(platform.is).toHaveBeenCalled();
      expect(ble.enable).toHaveBeenCalled();
      expect(ble.scan).toHaveBeenCalled();
      expect(status.nativeElement.textContent.trim()).toBe("Status: scanning");
      let device = fixture.debugElement.query(By.css('button p'));

      expect(device).not.toBeNull();
      if (device != null) {
        let deviceName = device.nativeElement.textContent;
        expect('name: ' + bluetoothDevice.name).toEqual(deviceName);
      }
      done();
    }, 500)
  });

});


