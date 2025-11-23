-- Insert default admin user
-- Email: admin@partnerpay.com
-- Password: admin123
INSERT INTO users (id, email, password, role, balance, authentication_status, authenticated_at)
VALUES (
  'admin-001', 
  'admin@partnerpay.com', 
  '$2a$10$xlGBKJMWf2fCBaeBrjQJ4OBfBgmH.k4mwWS17NanEoWuEyC2hA0lK', 
  'admin', 
  0, 
  'authenticated', 
  now()
)
ON CONFLICT (email) DO NOTHING;
