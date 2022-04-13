/* eslint-disable no-console */
// import dotenv dan menjalankan konfigurasi di .env
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
// const path = require('path');

// const bucket = admin.storage().bucket();

// bucket.upload('./src/api/uploads/file/pictures/1626747718878flower.jpg', (err, file) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('uploaded successfully');
//   }
// });
// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsServices');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const playlistsValidator = require('./validator/playlists');

// playlists
const playlistsongs = require('./api/playlistsongs');
const PlaylistsongsService = require('./services/postgres/PlaylistsongsService');
const playlistsongsValidator = require('./validator/playlistsongs');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const collaborationsValidator = require('./validator/collaborations');

// upload files
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistsongsService = new PlaylistsongsService();
  const storageService = new StorageService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST !== 'production' ? 'localhost' : '0.0.0.0',,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('songsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: playlistsValidator,
      },
    },
    {
      plugin: playlistsongs,
      options: {
        playlistsongsService,
        songsService,
        playlistsService,
        validator: playlistsongsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: collaborationsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
