const PlaylistsongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  register: async (server, {
    playlistsongsService, songsService, playlistsService, validator,
  }) => {
    const playlistsongsHandler = new PlaylistsongsHandler(
      playlistsongsService, songsService, playlistsService, validator,
    );

    server.route(routes(playlistsongsHandler));
  },
};
