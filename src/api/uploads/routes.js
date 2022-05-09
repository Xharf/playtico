const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/pictures',
    handler: handler.postUploadPictureHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 1000000,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/upload/pictures/{filename}',
    handler: handler.deletePictureHandler,
  },
  {
    method: 'POST',
    path: '/upload/songs',
    handler: handler.postUploadSongHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 10000000,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/upload/songs/{filename}',
    handler: handler.deleteSongHandler,
  },
];

module.exports = routes;
