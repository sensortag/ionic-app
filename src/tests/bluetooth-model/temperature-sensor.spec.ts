import {TemperatureSensor} from "../../pages/model/bluetooth/temperature-sensor";

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

  it('temperature should be zero', () => {
    let data = new Uint8Array(4);

    temperatureSensor.convertData(data);

    expect(temperatureSensor.getAmbientTemperatureAsString()).toBe('0.00 ℃');
    expect(temperatureSensor.getAmbientTemperatureAsString()).toBe('0.00 ℃');
  });

  it('should convert the temperature', () => {
    let ambientTemp = new Uint16Array(1);
    ambientTemp[0] = (26.50 / 0.03125) << 2;

    let irTemperature = new Uint16Array(1);
    irTemperature[0] = (19.13 / 0.03125) << 2;

    let data = new Uint16Array(2);
    data[0] = irTemperature[0];
    data[1] = ambientTemp[0];

    temperatureSensor.convertData(data);

    expect(temperatureSensor.getAmbientTemperatureAsString()).toBe('26.50 ℃');
    expect(temperatureSensor.getInfraRedTemperatureAsString()).toBe('19.13 ℃');
  });

});
