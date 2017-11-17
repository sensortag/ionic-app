import {MovementSensor} from "../../pages/bluetooth-model/movment-sensor";

describe('movement-sensor', () => {
  let movementSensor: MovementSensor;

  beforeEach(() => {
    movementSensor = new MovementSensor();
  });

  it('should have the configuration value 0xFF', () => {
    expect(movementSensor.getConfigurationValue().byteLength).toBe(2);

    let config = new Uint8Array(movementSensor.getConfigurationValue());
    expect(config[0]).toBe(0x00FF);
  });

  it('movement should be zero', () => {
    let data = new Int16Array(9);

    movementSensor.convertData(data);

    expect(movementSensor.getGyroscopeAsString()).toBe('X: 0.00, Y: 0.00, Z: 0.00 [°/s]');
    expect(movementSensor.getAccelerometerAsString()).toBe('X: 0.00, Y: 0.00, Z: 0.00 [G]');
    expect(movementSensor.getMagnetometerAsString()).toBe('X: 0, Y: 0, Z: 0 [uT]');
  });

  it('movement should be converted correctly', () => {
    let data = new Int16Array(9);

    // gyroscope values
    function convertGyro(number: number) {
      return number * (65536 / 500);
    }

    data[0] = convertGyro(-1.90);
    data[1] = convertGyro(0.71);
    data[2] = convertGyro(1.11);

    // accelerometer values
    function convertAcc(number: number) {
      return number * (32768 / (Math.pow(2, MovementSensor.accelerometerRange + 1)));
    }

    data[3] = convertAcc(2.15);
    data[4] = convertAcc(1.40);
    data[5] = convertAcc(-0.17);

    // magnetometer values
    data[6] = 162;
    data[7] = 470;
    data[8] = -353;

    movementSensor.convertData(data);

    expect(movementSensor.getGyroscopeAsString()).toBe('X: -1.90, Y: 0.71, Z: 1.11 [°/s]');
    expect(movementSensor.getAccelerometerAsString()).toBe('X: 2.15, Y: 1.40, Z: -0.17 [G]');
    expect(movementSensor.getMagnetometerAsString()).toBe('X: 162, Y: 470, Z: -353 [uT]');
  });

});
