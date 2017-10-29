import {HumiditySensor} from "../../../pages/model/humidity-sensor";

describe('humidity-sensor', () => {
  let humiditySensor: HumiditySensor;

  beforeEach(() => {
    humiditySensor = new HumiditySensor();
  });

  it('should have the configuration value 0x01', () => {
    expect(humiditySensor.getConfigurationValue().byteLength).toBe(1);

    let config = new Int8Array(humiditySensor.getConfigurationValue());
    expect(config[0]).toBe(0x01);
  });

  it('temperature and humidity should be zero', () => {
    let data = new Uint16Array(2);
    data[0] = (0 + 40) / 165 * 65536;
    data[1] = 0;

    humiditySensor.convertData(data);

    expect(humiditySensor.getTemperatureAsString()).toBe('-0.00 ℃');
    expect(humiditySensor.getHumidityAsString()).toBe('0.0 %RH');
  });

  it('should convert the temperature and humidity', () => {
    let data = new Uint16Array(2);
    data[0] = (26.50 + 40) / 165 * 65536;
    data[1] = (45 * 65536) / 100;

    humiditySensor.convertData(data);

    expect(humiditySensor.getTemperatureAsString()).toBe('26.50 ℃');
    expect(humiditySensor.getHumidityAsString()).toBe('45.0 %RH');
  });

});
