export class StorageService {
  static get(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (err) {
      return null;
    }
  }
  static set(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {}
  }
}
