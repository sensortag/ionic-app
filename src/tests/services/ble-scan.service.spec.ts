import {async, TestBed} from '@angular/core/testing';
import {Platform} from 'ionic-angular';
import {PlatformMock} from '../mocks/mocks-ionic';
import {Diagnostic} from "@ionic-native/diagnostic";
import {DiagnosticMock} from "../mocks/diagnostic-mock";
import {BLE} from "@ionic-native/ble";
import {BLEMock} from "../mocks/ble-mock";
import {BleScanService} from "../../services/ble-scan.service";
import {Observable} from "rxjs/Observable";
import {BluetoothDevice} from "../../model/bluetooth/bluetooth-device";

describe('BLE scan service', () => {
  let ble: BLE;
  let bleScanService: BleScanService;
  let diagnostic: Diagnostic;
  let platform: Platform;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        BleScanService,
        {provide: BLE, useClass: BLEMock},
        {provide: Diagnostic, useClass: DiagnosticMock},
        {provide: Platform, useClass: PlatformMock}
      ]
    })
  }));

  beforeEach(() => {
    bleScanService = TestBed.get(BleScanService);
    platform = TestBed.get(Platform);
    ble = TestBed.get(BLE);
    diagnostic = TestBed.get(Diagnostic);
  });

  it('platform not supported', (done) => {
    spyOn(platform, 'is').and.returnValue(false);

    spyOn(ble, 'scan');

    bleScanService.startScanningForBleDevices().subscribe(
      device => {
      },
      error => {
        expect(ble.scan).not.toHaveBeenCalled();
        expect(error).toBe('Platform not supported');
        done();
      },
    )
  });

  it('android - bluetooth not enabled', (done) => {
    spyOn(platform, 'is').and.callFake(os => {
      return os == 'android';
    });

    spyOn(ble, 'enable').and.returnValue(Promise.reject(null));

    spyOn(ble, 'scan');

    bleScanService.startScanningForBleDevices().subscribe(
      device => {
      },
      error => {
        expect(ble.scan).not.toHaveBeenCalled();
        expect(error).toBe('Please enable bluetooth!');
        done();
      },
    )
  });

  it('android - Error checking location service ', (done) => {
    spyOn(platform, 'is').and.callFake(os => {
      return os == 'android';
    });

    spyOn(ble, 'enable').and.returnValue(Promise.resolve());

    let locationRejectMessage = 'blob';
    spyOn(diagnostic, 'isLocationEnabled').and.returnValue(Promise.reject(locationRejectMessage));

    spyOn(ble, 'scan');

    bleScanService.startScanningForBleDevices().subscribe(
      device => {
      },
      error => {
        expect(ble.scan).not.toHaveBeenCalled();
        expect(error).toBe('Error checking location service: ' + locationRejectMessage);
        done();
      },
    )
  });

  it('android - location not enabled', (done) => {
    spyOn(platform, 'is').and.callFake(os => {
      return os == 'android';
    });

    spyOn(ble, 'enable').and.returnValue(Promise.resolve());

    spyOn(diagnostic, 'isLocationEnabled').and.returnValue(Promise.resolve(false));

    spyOn(ble, 'scan');

    bleScanService.startScanningForBleDevices().subscribe(
      device => {
      },
      error => {
        expect(diagnostic.isLocationEnabled).toHaveBeenCalled();
        expect(ble.scan).not.toHaveBeenCalled();
        expect(error).toBe('Please enable the location service');
        done();
      },
    )
  });

  it('android - ble.scan returns a device', (done) => {
    spyOn(platform, 'is').and.callFake(os => {
      return os == 'android';
    });

    spyOn(ble, 'enable').and.returnValue(Promise.resolve());

    spyOn(diagnostic, 'isLocationEnabled').and.returnValue(Promise.resolve(true));

    let bluetoothDevice = new BluetoothDevice('SensorTag', '123456');

    spyOn(ble, 'scan').and.returnValue(new Observable(observer => {
        observer.next(bluetoothDevice)
      })
    );

    let scanningTime = 0.5; //s
    bleScanService.scanningTime = scanningTime;

    let deviceReceived: boolean;

    bleScanService.startScanningForBleDevices().subscribe(
      device => {
        expect(device).toEqual(bluetoothDevice);
        deviceReceived = true;
      },
      error => {
      },
      () => {
        expect(platform.is).toHaveBeenCalledWith('android');
        expect(ble.enable).toHaveBeenCalled();
        expect(diagnostic.isLocationEnabled).toHaveBeenCalled();
        expect(ble.scan).toHaveBeenCalledWith([], scanningTime);
        expect(deviceReceived).toBeTruthy('device not received');
        done();
      },
    )
  });

  it('ios - bluetooth not enabled', (done) => {
    spyOn(platform, 'is').and.callFake(os => {
      return os == 'ios';
    });

    spyOn(ble, 'isEnabled').and.returnValue(Promise.reject(null));

    spyOn(ble, 'scan');

    bleScanService.startScanningForBleDevices().subscribe(
      device => {
      },
      error => {
        expect(platform.is).toHaveBeenCalled();
        expect(ble.isEnabled).toHaveBeenCalled();
        expect(ble.scan).not.toHaveBeenCalled();
        expect(error).toBe('Please enable bluetooth!');
        done();
      },
    )
  });

  it('ios - ble.scan returns a device', (done) => {
    spyOn(platform, 'is').and.callFake(os => {
      return os == 'ios';
    });

    spyOn(ble, 'isEnabled').and.returnValue(Promise.resolve());

    let bluetoothDevice = new BluetoothDevice('SensorTag', '123456');

    spyOn(ble, 'scan').and.returnValue(new Observable(observer => {
        observer.next(bluetoothDevice)
      })
    );

    let scanningTime = 0.5; //s
    bleScanService.scanningTime = scanningTime;

    let deviceReceived: boolean;
    bleScanService.startScanningForBleDevices().subscribe(
      device => {
        expect(device).toEqual(bluetoothDevice);
        deviceReceived = true;

      },
      error => {
      },
      () => {
        expect(platform.is).toHaveBeenCalledWith('ios');
        expect(ble.isEnabled).toHaveBeenCalled();
        expect(ble.scan).toHaveBeenCalledWith([], scanningTime);
        expect(deviceReceived).toBeTruthy('device not received');
        done();
      },
    )
  });

});
