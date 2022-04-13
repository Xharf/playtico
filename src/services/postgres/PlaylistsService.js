/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistService {
  constructor(collaborationsService) {
    if (process.env.NODE_ENV === 'production') {
      this._pool = new Pool({
        connectionString: process.env.PGURI,
        ssl: {
          rejectUnauthorized: false,
        },
      });
    } else {
      this._pool = new Pool();
    }
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist({ name, owner, cover = 'https://storage.googleapis.com/playtico-0123.appspot.com/16497835433630ef32f2605448f80a48f7257415cb116.jpg' }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1,$2,$3,$4) RETURNING id',
      values: [id, name, owner, cover],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Paylist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, playlists.cover, users.username 
      FROM playlists
      LEFT JOIN users ON playlists.owner = users.id
      LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      `,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async updatePlaylist(id, { name, cover = 'https://storage.googleapis.com/playtico-0123.appspot.com/16497835433630ef32f2605448f80a48f7257415cb116.jpg' }) {
    const query = {
      text: 'UPDATE playlists SET name = $1, cover = $2 WHERE id = $3 RETURNING id',
      values: [name, cover, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Paylist gagal diperbarui');
    }
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id=$1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistService;
