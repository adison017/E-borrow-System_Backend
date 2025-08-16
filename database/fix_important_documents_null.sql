-- Fix important_documents column to allow NULL values
ALTER TABLE borrow_transactions
MODIFY COLUMN important_documents TEXT NULL
COMMENT 'JSON array of important document file paths';