declare var M: any;

export class MaterialService {
  static toast(messages: string, classes: string = 'toast') {
    M.toast({ html: messages, classes });
  }
}
