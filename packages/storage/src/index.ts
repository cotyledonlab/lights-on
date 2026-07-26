export interface ObjectStorageProvider {
  delete(key: string): Promise<void>;
  put(key: string, value: Uint8Array): Promise<void>;
}

export class DisabledObjectStorageProvider implements ObjectStorageProvider {
  delete(key: string): Promise<void> {
    void key;
    return Promise.reject(new Error("Object storage is disabled in Phase 1."));
  }

  put(key: string, value: Uint8Array): Promise<void> {
    void key;
    void value;
    return Promise.reject(new Error("Object storage is disabled in Phase 1."));
  }
}

export const objectStorageProvider: ObjectStorageProvider =
  new DisabledObjectStorageProvider();
