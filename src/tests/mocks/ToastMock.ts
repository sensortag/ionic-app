import {NavOptions} from "ionic-angular";

export class ToastMock {

  /**
   * Present the toast instance.
   *
   * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
   * @returns {Promise} Returns a promise which is resolved when the transition has completed.
   */
  present(navOptions?: NavOptions): Promise<any> {
    return Promise.resolve();
  }
}
