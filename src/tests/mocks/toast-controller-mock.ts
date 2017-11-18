import {ToastMock} from './toast-mock';

export class ToastControllerMock {
  public static instance(toast?: ToastMock): any {

    let instance = jasmine.createSpyObj('ToastController', ['create']);
    instance.create.and.returnValue(toast || ToastMock.instance());

    return instance;
  }
}
