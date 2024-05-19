class LocalStorageService {
  constructor() {}

  getValue(key) {
    return localStorage.getItem(key);
  }

  setValue(key, value) {
    return localStorage.setItem(key, value);
  }

  deleteValue(key) {
    return localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}

const localStorageService = new LocalStorageService();
export default localStorageService;
