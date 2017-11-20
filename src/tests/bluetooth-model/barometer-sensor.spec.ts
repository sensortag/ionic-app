import {BarometerSensor} from "../../model/bluetooth/barometer-sensor";

describe('barometer-sensor', () => {
  let barometerSensor: BarometerSensor;

  beforeEach(() => {
    barometerSensor = new BarometerSensor();
  });

  it('should have the configuration value 0x01', () => {
    expect(barometerSensor.getConfigurationValue().byteLength).toBe(1);

    let config = new Int8Array(barometerSensor.getConfigurationValue());
    expect(config[0]).toBe(0x01);
  });

  it('should convert the temperature and pressure', () => {
    let tempData = new Uint32Array(1);
    tempData[0] = 2450; //24.50 ℃

    let pressureData = new Uint32Array(1);
    pressureData[0] = 98000; //980 hPa mBar

    let data = new Uint8Array(6);
    // [0:7]
    data[0] = tempData[0] & 0xFF;
    // [8:15]
    data[1] = (tempData[0] & 0xFF00) >>> 8;
    // [16:23]
    data[2] = (tempData[0] & 0xFF0000) >>> 16;

    // [0:7]
    data[3] = pressureData[0] & 0xFF;
    // [8:15]
    data[4] = (pressureData[0] & 0xFF00) >>> 8;
    // [16:23]
    data[5] = (pressureData[0] & 0xFF0000) >>> 16;

    barometerSensor.convertData(data);
    expect(barometerSensor.getTemperatureAsString()).toBe('24.50 ℃');
    expect(barometerSensor.getPressureAsString()).toBe('980 mBar');
  });

});
