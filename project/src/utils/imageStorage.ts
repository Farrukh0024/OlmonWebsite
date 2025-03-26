import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ImageData {
  id: string;
  section: string;
  url: string;
  alt: string;
  description?: string;
}

interface ImageDB extends DBSchema {
  images: {
    key: string;
    value: ImageData;
    indexes: { 'by-section': string };
  };
}

class ImageStorage {
  private db: Promise<IDBPDatabase<ImageDB>>;

  constructor() {
    this.db = openDB<ImageDB>('image-store', 1, {
      upgrade(db) {
        const store = db.createObjectStore('images', { keyPath: 'id' });
        store.createIndex('by-section', 'section');
      },
    });
  }

  async getImagesBySection(section: string): Promise<ImageData[]> {
    const db = await this.db;
    const tx = db.transaction('images', 'readonly');
    const index = tx.store.index('by-section');
    return index.getAll(section);
  }

  async saveImage(image: ImageData): Promise<void> {
    const db = await this.db;
    await db.put('images', image);
  }

  async deleteImage(id: string): Promise<void> {
    const db = await this.db;
    await db.delete('images', id);
  }

  async clearSection(section: string): Promise<void> {
    const db = await this.db;
    const tx = db.transaction('images', 'readwrite');
    const index = tx.store.index('by-section');
    const keys = await index.getAllKeys(section);
    await Promise.all(keys.map(key => tx.store.delete(key)));
    await tx.done;
  }
}

export const imageStorage = new ImageStorage();