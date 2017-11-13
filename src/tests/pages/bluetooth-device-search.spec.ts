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

describe('BluetoothDeviceSearchPage', () => {
  let fixture: ComponentFixture<BluetoothDeviceSearchPage>;
  let component: BluetoothDeviceSearchPage;
  let status: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BluetoothDeviceSearchPage],
      imports: [
        IonicModule.forRoot(BluetoothDeviceSearchPage)
      ],
      providers: [
        NavController,
        {provide: Platform, useClass: PlatformMock},
        {provide: BLE, useClass: BLEMock},
        {provide: Diagnostic, useClass: DiagnosticMock},
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BluetoothDeviceSearchPage);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof BluetoothDeviceSearchPage).toBe(true);
  });

  it('should start scanning', () => {
    fixture.detectChanges();
    status = fixture.debugElement.query(By.css('p'));
    expect(status.nativeElement.textContent.trim()).toBe("Status:");
  });

});


