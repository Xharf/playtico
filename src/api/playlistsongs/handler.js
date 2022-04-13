/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler {
  constructor(playlistsongsService, songsService, playlistService, validator) {
    this._playlistsongsService = playlistsongsService;
    this._playlistService = playlistService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistsongsHandler = this.postPlaylistsongsHandler.bind(this);
    this.getPlaylistsongsHandler = this.getPlaylistsongsHandler.bind(this);
    this.deletePlaylistsongsHandler = this.deletePlaylistsongsHandler.bind(this);
  }

  async postPlaylistsongsHandler(request, h) {
    try {
      const { playlistId } = request.params;
      this._validator.validatePlaylistSongPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;

      await this._songsService.getSongById(songId);
      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistsongsService.addPlaylistsongs(songId, playlistId);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistsongsHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      const songs = await this._playlistsongsService.getSongsByPlaylist(playlistId);

      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistsongsHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;

      await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistsongsService.deleteSongsfromPlaylist(songId, playlistId);
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}
module.exports = PlaylistSongsHandler;
