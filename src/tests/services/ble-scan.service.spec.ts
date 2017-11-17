import {async, TestBed} from '@angular/core/testing';
import {Platform} from 'ionic-angular';
import {PlatformMock} from '../mocks/mocks-ionic';
import {Diagnostic} from "@ionic-native/diagnostic";
import {DiagnosticMock} from "../mocks/diagnostic-mock";
import {BLE} from "@ionic-native/ble";
import {BLEMock} from "../mocks/ble-mock";
import {BleScanService} from "../../services/ble-scan.service";

describe('BLE scan service', () => {
  let bleScanService: BleScanService;
  let originalTimeout;
  let platform;
  let ble;
  let diagnostic;

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
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

    platform = TestBed.get(Platform);
    ble = TestBed.get(BLE);
    diagnostic = TestBed.get(Diagnostic);

  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
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

  it('android - ble.scan is called', (done) => {
    spyOn(platform, 'is').and.callFake(os => {
      return os == 'android';
    });

    spyOn(ble, 'enable').and.returnValue(Promise.resolve());

    spyOn(diagnostic, 'isLocationEnabled').and.returnValue(Promise.resolve(true));

    spyOn(ble, 'scan').and.callThrough();

    let scanningTime = 0.5; //s
    bleScanService.scanningTime = scanningTime;

    bleScanService.startScanningForBleDevices().subscribe(
      device => {
      },
      error => {
      },
      () => {
        expect(ble.scan).toHaveBeenCalled();
        expect(ble.scan).toHaveBeenCalledWith([], scanningTime);
        done();
      },
    )
  });

});
