-- Add important_documents column to borrow_transactions table
ALTER TABLE borrow_transactions
ADD COLUMN important_documents TEXT NULL
COMMENT 'JSON array of important document file paths';