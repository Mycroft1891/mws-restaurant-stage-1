const data = {
  'version': 1,
  'dbname': 'EXAMPLE_DB',
  'store': 'products'
}
class IDB {
  static supported() {
    if(window.indexedDB) return true;
    return false;
  }

  static getItems(callback) {
    var count
    var request = window.indexedDB.open(data.dbname, data.version);
    request.onsuccess = function(event) {
      var db = event.target.result;
      var transaction = db.transaction(data.store, 'readwrite');
      var restaurantStore = transaction.objectStore(data.store);
      var restaurantRequest = restaurantStore.getAll();
      restaurantRequest.onsuccess = function() {
        callback(restaurantRequest.result)
      }
    };
    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var restaurantStore = db.createObjectStore(data.store, {keyPath: 'id'});
    };
  }

  static saveRecord(item) {
    var request = window.indexedDB.open(data.dbname, data.version);
    request.onsuccess = function(event) {
      var db = event.target.result;
      var transaction = db.transaction(data.store, 'readwrite');
      var restaurantStore = transaction.objectStore(data.store);
      restaurantStore.add(item)
    };
    request.onerror = function(event) {
      console.log('[onerror]', request.error);
    };
    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var restaurantStore = db.createObjectStore(data.store, {keyPath: 'id'});
    };
  }

  static updateRecord(item, id) {
    console.log('ID: ', id);
    console.log('Adding Review: ', item);
    var request = window.indexedDB.open(data.dbname, data.version);
    request.onsuccess = function(event) {
      var db = event.target.result;
      var transaction = db.transaction(data.store, 'readwrite');
      var restaurantStore = transaction.objectStore(data.store);
      restaurantStore.put(item);
    };
    request.onerror = function(event) {
      console.log('[onerror]', request.error);
    };
    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var restaurantStore = db.createObjectStore(data.store, {keyPath: 'id'});
    };
  }
}
