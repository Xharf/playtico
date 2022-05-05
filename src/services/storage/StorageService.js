/* eslint-disable no-underscore-dangle */
const admin = require('firebase-admin');
const NotFoundError = require('../../exceptions/NotFoundError');

class StorageService {
  constructor() {
    // eslint-disable-next-line global-require
    const serviceAccount = require('./playtico-0123-firebase-adminsdk-zu7mx-a3d122a3e0.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.STORAGE_BUCKET,
    });
    this._bucket = admin.storage().bucket();
  }

  async writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    await this._bucket.file(filename).save(file._data);
    await this._bucket.file(filename).makePublic();

    return filename;
  }

  async deleteFile(filename) {
    try {
      await this._bucket.file(filename).delete();
    } catch (error) {
      if (error.code === 404) {
        throw new NotFoundError('File tidak ditemukan');
      }
      throw error;
    }
  }
}

module.exports = StorageService;
