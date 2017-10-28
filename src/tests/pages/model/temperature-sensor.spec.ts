import {TemperatureSensor} from "../../../pages/model/temperature-sensor";

describe('temperature-sensor', () => {
  let temperatureSensor: TemperatureSensor;

  beforeEach(() => {
    temperatureSensor = new TemperatureSensor();
  });

  it('should have the configuration value 0x01', () => {
    expect(temperatureSensor.getConfigurationValue().byteLength).toBe(1);

    let config = new Int8Array(temperatureSensor.getConfigurationValue());
    expect(config[0]).toBe(0x01);
  });

  it('should convert the temperature', () => {
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

    temperatureSensor.convertData(data);
    expect(temperatureSensor.getTemperatureAsString()).toBe('24.50 ℃');
    expect(temperatureSensor.getPressureAsString()).toBe('980 mBar');
  });

});
