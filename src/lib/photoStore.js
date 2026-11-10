const DATABASE_NAME = 'shikha-memory-garden';
const STORE_NAME = 'photos';
const DATABASE_VERSION = 1;

function openPhotoDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('This browser does not support saving photos locally.'));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open local photo storage.'));
  });
}

function runTransaction(mode, operation) {
  return openPhotoDatabase().then((database) => new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const result = operation(transaction.objectStore(STORE_NAME));
    transaction.oncomplete = () => {
      database.close();
      resolve(result?.result);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || new Error('Could not save your photo.'));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error('Photo storage was interrupted.'));
    };
  }));
}

export async function getSavedPhotos() {
  const result = await runTransaction('readonly', (store) => store.getAll());
  return result || [];
}

export function savePhoto(photo) {
  return runTransaction('readwrite', (store) => store.put(photo));
}

export function deleteSavedPhoto(id) {
  return runTransaction('readwrite', (store) => store.delete(id));
}
