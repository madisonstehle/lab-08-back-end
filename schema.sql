DROP TABLE IF EXISTS locations;
-- DROP TABLE IF EXISTS weather;
-- DROP TABLE IF EXISTS eventful;


CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  searchquery VARCHAR(255),
  formattedquery VARCHAR(255),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7)
);

-- CREATE TABLE weather (
--   id SERIAL PRIMARY KEY,
--   forecast VARCHAR(255), 
--   time VARCHAR(255)
-- );

-- CREATE TABLE eventful (
--   id SERIAL PRIMARY KEY,
--   link VARCHAR(255), 
--   date VARCHAR(255),
--   summary VARCHAR(255)
-- );