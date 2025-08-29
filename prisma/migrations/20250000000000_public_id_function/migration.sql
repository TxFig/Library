CREATE OR REPLACE FUNCTION generate_public_id(id_length INT DEFAULT 8)
RETURNS TEXT AS $$
DECLARE
    characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := '';
BEGIN
    SELECT string_agg(substr(characters, floor(random() * length(characters) + 1)::int, 1), '')
    INTO result
    FROM generate_series(1, id_length);

    RETURN result;
END;
$$ LANGUAGE plpgsql;
