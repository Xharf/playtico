/* eslint-disable camelcase */
const mapDBtoModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  cover,
  song,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  cover,
  song,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = { mapDBtoModel };
