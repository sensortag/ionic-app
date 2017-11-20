import {OpticalSensor} from "../../model/bluetooth/optical-sensor";

describe('optical-sensor', () => {
  let opticalSensor: OpticalSensor;

  beforeEach(() => {
    opticalSensor = new OpticalSensor();
  });

  it('should have the configuration value 0x01', () => {
    expect(opticalSensor.getConfigurationValue().byteLength).toBe(1);

    let config = new Int8Array(opticalSensor.getConfigurationValue());
    expect(config[0]).toBe(0x01);
  });

  it('lux should be zero', () => {
    let data = new Uint16Array(1);
    data[0] = 0;

    opticalSensor.convertData(data);

    expect(opticalSensor.getIlluminanceAsString()).toBe('0.00 lx');
  });

  it('should convert the optical value to lux', () => {
    let data = new Uint16Array(1);
    data[0] = 9942;

    opticalSensor.convertData(data);

    expect(opticalSensor.getIlluminanceAsString()).toBe('70.00 lx');
  });

});
