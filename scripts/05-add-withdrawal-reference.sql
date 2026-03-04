-- Add reference column to withdrawal_requests to store Pesapal tracking IDs
ALTER TABLE withdrawal_requests ADD COLUMN IF NOT EXISTS reference VARCHAR(100);
