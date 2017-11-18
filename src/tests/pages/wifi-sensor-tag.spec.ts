import {WifiSensorTagPage} from "../../pages/wifi-sensor-tag/wifi-sensor-tag.page";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {DebugElement} from "@angular/core";
import {IonicModule, LoadingController, NavController, Platform, ToastController} from "ionic-angular";
import {IonicStorageModule} from "@ionic/storage";
import {SettingKeys, SettingsService} from "../../services/settings.service";
import {HTTP} from "@ionic-native/http";
import {Diagnostic} from "@ionic-native/diagnostic";
import {PlatformMock} from "../mocks/mocks-ionic";
import {DiagnosticMock} from "../mocks/diagnostic-mock";
import {HTTPMock} from "../mocks/http-mock";
import {By} from "@angular/platform-browser";
import {SettingsServiceMock} from "../mocks/settings-service-mock";
import {LoadingControllerMock} from "../mocks/loading-contorller-mock";
import {ToastControllerMock} from "../mocks/toast-controller-mock";

describe('WifiSensorTagPage', () => {
  let fixture: ComponentFixture<WifiSensorTagPage>;
  let component: WifiSensorTagPage;
  let originalTimeout;
  let settingsService: SettingsService;
  let platform: Platform;
  let diagnostic: Diagnostic;
  let http: HTTP;
  let toastController: ToastController;
  let status: DebugElement;
  let ipAddress: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WifiSensorTagPage],
      imports: [
        IonicModule.forRoot(WifiSensorTagPage),
        IonicStorageModule.forRoot(),
      ],
      providers: [
        NavController,
        {provide: ToastController, useFactory: () => ToastControllerMock.instance()},
        {provide: LoadingController, useFactory: () => LoadingControllerMock.instance()},
        {provide: SettingsService, useClass: SettingsServiceMock},
        {provide: HTTP, useClass: HTTPMock},
        {provide: Platform, useClass: PlatformMock},
        {provide: Diagnostic, useClass: DiagnosticMock},
      ]
    })
  }));

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    fixture = TestBed.createComponent(WifiSensorTagPage);
    component = fixture.componentInstance;

    settingsService = fixture.debugElement.injector.get(SettingsService);
    platform = fixture.debugElement.injector.get(Platform);
    diagnostic = fixture.debugElement.injector.get(Diagnostic);
    http = fixture.debugElement.injector.get(HTTP);
    toastController = fixture.debugElement.injector.get(ToastController);

    fixture.autoDetectChanges(true);

    ipAddress = fixture.debugElement.query(By.css('ion-footer p:nth-child(1)'));
    status = fixture.debugElement.query(By.css('ion-footer p:nth-child(2)'));
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should be created', () => {
    expect(component instanceof WifiSensorTagPage).toBe(true);
  });

  it('should have expected init status and ip address', (done) => {
    spyOn(settingsService, 'getSetting').and.callThrough();

    settingsService.getSetting(SettingKeys.IP_ADDRESS).then(expectedIP => {
      expect(status.nativeElement.textContent.trim()).toBe("Status: -");
      expect(ipAddress.nativeElement.textContent.trim()).toBe("IP-Address: " + expectedIP);
      done();
    })
  });

  it('platform not ready', (done) => {
    spyOn(platform, 'ready').and.returnValue(Promise.reject(null));

    spyOn(diagnostic, 'isWifiAvailable');

    spyOn(http, 'get');

    let refreshButton = fixture.debugElement.query(By.css('ion-footer button'));
    refreshButton.triggerEventHandler('click', null);

    setTimeout(() => {
        expect(platform.ready).toHaveBeenCalled();
        expect(diagnostic.isWifiAvailable).not.toHaveBeenCalled();
        expect(http.get).not.toHaveBeenCalled();
        expect(status.nativeElement.textContent.trim()).toBe("Status: Platform not ready!");
        done();
      }, 100
    );
  });

  it('Reject isWifiAvailable', (done) => {
    spyOn(platform, 'ready').and.returnValue(Promise.resolve());

    let errorMessage = 'error';

    spyOn(diagnostic, 'isWifiAvailable').and.returnValue(Promise.reject(errorMessage));

    spyOn(http, 'get');

    let refreshButton = fixture.debugElement.query(By.css('ion-footer button'));
    refreshButton.triggerEventHandler('click', null);

    setTimeout(() => {
        expect(platform.ready).toHaveBeenCalled();
        expect(diagnostic.isWifiAvailable).toHaveBeenCalled();
        expect(http.get).not.toHaveBeenCalled();
        expect(status.nativeElement.textContent.trim()).toBe("Status: Error during check if wifi is enabled: "
          + errorMessage);
        done();
      }, 100
    );
  });

  it('Wifi not enabled', (done) => {
    spyOn(platform, 'ready').and.returnValue(Promise.resolve());

    spyOn(diagnostic, 'isWifiAvailable').and.returnValue(Promise.resolve(false));

    let refreshButton = fixture.debugElement.query(By.css('ion-footer button'));
    refreshButton.triggerEventHandler('click', null);

    spyOn(http, 'get');

    setTimeout(() => {
        expect(platform.ready).toHaveBeenCalled();
        expect(diagnostic.isWifiAvailable).toHaveBeenCalled();
        expect(http.get).not.toHaveBeenCalled();
        expect(toastController.create).toHaveBeenCalledWith({
          message: 'Please enable wifi!',
          duration: 4000
        });
        expect(status.nativeElement.textContent.trim()).toBe("Status: -");
        done();
      }, 100
    );
  });

  it('404 page not found', (done) => {
    spyOn(platform, 'ready').and.returnValue(Promise.resolve());

    spyOn(diagnostic, 'isWifiAvailable').and.returnValue(Promise.resolve(true));

    let refreshButton = fixture.debugElement.query(By.css('ion-footer button'));
    refreshButton.triggerEventHandler('click', null);

    spyOn(http, 'get').and.returnValue(Promise.reject(
      {
        status: 404,
        error: 'Not Found',
      }
    ));

    setTimeout(() => {
        expect(platform.ready).toHaveBeenCalled();
        expect(diagnostic.isWifiAvailable).toHaveBeenCalled();
        expect(http.get).toHaveBeenCalled();
        expect(status.nativeElement.textContent.trim()).toBe("Status: 404 - Not Found");
        done();
      }, 100
    );
  });


  it('should parse the html file correctly', (done) => {
    spyOn(platform, 'ready').and.returnValue(Promise.resolve());

    spyOn(diagnostic, 'isWifiAvailable').and.returnValue(Promise.resolve(true));

    let refreshButton = fixture.debugElement.query(By.css('ion-footer button'));
    refreshButton.triggerEventHandler('click', null);

    spyOn(http, 'get').and.callFake(() => {
      return Promise.resolve({
          status: 200,
          data:
          '<body>\n' +
          '  <p id="tmp">090C 0D04 18.09 26.03</p>\n' +
          '  <p id="hum">80DC 66F0 50.34 26.35</p>\n' +
          '  <p id="bar">70F7A0 81F500 26.45 943.48</p>\n' +
          '  <p id="gyr">FEFE 005D 0086 -1.97 0.71 1.02</p>\n' +
          '  <p id="acc">1028 0019 FEAD 1.01 0.01 -0.08</p>\n' +
          '  <p id="opt">059F 14.39</p>\n' +
          '  <p id="mag">00A2 01D6 FE9F 162 470 -353</p>\n' +
          '  <p id="key">7</p>\n' +
          '  <p id="syn">35</p>\n' +
          '</body>'
        }
      );

    });

    let ambientTemperature = fixture.debugElement.query(By.css('ion-content ion-list:nth-of-type(1) ion-item:nth-of-type(1) p'));
    let irTemperature = fixture.debugElement.query(By.css('ion-content ion-list:nth-of-type(1) ion-item:nth-of-type(2) p'));
    let humidity = fixture.debugElement.query(By.css('ion-content ion-list:nth-of-type(1) ion-item:nth-of-type(3) p'));
    let pressure = fixture.debugElement.query(By.css('ion-content ion-list:nth-of-type(1) ion-item:nth-of-type(4) p'));

    let acceleration = fixture.debugElement.query(By.css('ion-content ion-list:nth-of-type(2) ion-item:nth-of-type(1) p'));
    let gyroscope = fixture.debugElement.query(By.css('ion-content ion-list:nth-of-type(2) ion-item:nth-of-type(2) p'));
    let magnetometer = fixture.debugElement.query(By.css('ion-content ion-list:nth-of-type(2) ion-item:nth-of-type(3) p'));

    let keyPressed = fixture.debugElement.query(By.css('ion-content ion-list:nth-of-type(3) ion-item:nth-of-type(1) p'));
    let illuminance = fixture.debugElement.query(By.css('ion-content ion-list:nth-of-type(3) ion-item:nth-of-type(2) p'));


    setTimeout(() => {
        expect(platform.ready).toHaveBeenCalled();
        expect(diagnostic.isWifiAvailable).toHaveBeenCalled();
        expect(http.get).toHaveBeenCalled();
        expect(status.nativeElement.textContent.trim()).toBe("Status: 200");

        expect(ambientTemperature.nativeElement.textContent).toEqual('26.03 ℃');
        expect(irTemperature.nativeElement.textContent).toEqual('18.09 ℃');
        expect(humidity.nativeElement.textContent).toEqual('50.34 %rH');
        expect(pressure.nativeElement.textContent).toEqual('943.48 mBar');

        expect(acceleration.nativeElement.textContent).toEqual('X: 1.01 Y: 0.01 Z: -0.08 [G]');
        expect(gyroscope.nativeElement.textContent).toEqual('X: -1.97 Y: 0.71 Z: 1.02 [°/s]');
        expect(magnetometer.nativeElement.textContent).toEqual('X: 162 Y: 470 Z: -353 [uT]');

        expect(keyPressed.nativeElement.textContent).toEqual('left key right key reed relay');
        expect(illuminance.nativeElement.textContent).toEqual('14.39 Lux');

        done();
      }, 500
    );

  });


});
