/**
 * Used to parse the raw value of the pressed key.
 */
export class KeyModel {
  private leftKey: boolean = false;
  private rightKey: boolean = false;
  private reedRelay: boolean = false;

  getKeyAsString(): string {
    let keys: string = '';
    if (this.leftKey) keys += 'left key ';
    if (this.rightKey) keys += 'right key ';
    if (this.reedRelay) keys += 'reed relay';
    if (keys === '') keys = 'no key pressed';
    return keys.trim();
  }

  /**
   * Converts the key data.
   *
   * @param data 1 Byte
   */
  convertData(data: any) {
    let rawData = new Uint8Array(data);
    //Bit 0: left key (user button)
    this.leftKey = (rawData[0] & 0x01) == 0x01;
    //Bit 1: right key (power button)
    this.rightKey = (rawData[0] & 0x02) == 0x02;
    //Bit 2: reed relay
    this.reedRelay = (rawData[0] & 0x04) == 0x04;
  }

}
