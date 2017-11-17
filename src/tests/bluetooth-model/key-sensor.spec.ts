import {KeySensor} from "../../pages/bluetooth-model/key-sensor";

describe('key-sensor', () => {
  let keySensor: KeySensor;

  beforeEach(() => {
    keySensor = new KeySensor();
  });

  it('no key should be pressed', () => {
    let data = new Uint8Array(1);

    keySensor.convertData(data);

    expect(keySensor.getKeyAsString()).toBe('no key pressed')
  });

  it('left key should be pressed', () => {
    let data = new Uint8Array(1);
    // Bit 0: left key (user button)
    data[0] = 0b001;

    keySensor.convertData(data);

    expect(keySensor.getKeyAsString()).toBe('left key');
  });

  it('right key should be pressed', () => {
    let data = new Uint8Array(1);
    // Bit 1: right key (power button)
    data[0] = 0b010;

    keySensor.convertData(data);

    expect(keySensor.getKeyAsString()).toBe('right key')
  });


  it('reed relay should be active', () => {
    let data = new Uint8Array(1);
    // Bit 2: reed relay
    data[0] = 0b100;

    keySensor.convertData(data);

    expect(keySensor.getKeyAsString()).toBe('reed relay')
  });

  it('all keys should be pressed', () => {
    let data = new Uint8Array(1);
    // Bit 2: reed relay
    data[0] = 0b111;

    keySensor.convertData(data);

    expect(keySensor.getKeyAsString()).toBe('left key right key reed relay')
  });

});
