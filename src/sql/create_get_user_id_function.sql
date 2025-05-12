
-- Create function to get user ID by email
CREATE OR REPLACE FUNCTION get_user_id_by_email(email_input TEXT)
RETURNS TABLE(id UUID) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT auth.users.id 
  FROM auth.users 
  WHERE auth.users.email = email_input;
END;
$$;

