-- Migration to add unique username to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Optional: Populate existing users with a default username if needed
-- UPDATE user_profiles SET username = LOWER(REPLACE(full_name, ' ', '_')) || floor(random() * 1000)::text WHERE username IS NULL;

-- Make it mandatory for new profiles
-- ALTER TABLE user_profiles ALTER COLUMN username SET NOT NULL;
