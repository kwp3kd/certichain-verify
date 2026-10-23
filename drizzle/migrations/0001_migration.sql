ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet text;
GRANT INSERT, DELETE ON public.certificates TO authenticated;
CREATE POLICY cert_insert ON public.certificates FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin') AND issuer_id = auth.uid());
CREATE POLICY cert_delete ON public.certificates FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
GRANT INSERT ON public.activities TO authenticated;
CREATE POLICY activity_insert ON public.activities FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE OR REPLACE FUNCTION public.get_public_certificate(_id text)
RETURNS TABLE(id text, student_name text, student_nim_masked text, activity_name text, activity_type text, organizer text, event_date date, issued_at date, file_hash text, transaction_id text, block_number bigint, issuer_wallet text, recorded_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT c.id, c.student_name,
    CASE WHEN length(c.student_nim) > 4 THEN left(c.student_nim,2) || repeat('•', length(c.student_nim)-4) || right(c.student_nim,2) ELSE '••••' END,
    c.activity_name, c.activity_type, c.organizer, c.event_date, c.issued_at, c.file_hash, c.transaction_id, c.block_number, c.issuer_wallet, c.recorded_at
  FROM public.certificates c WHERE upper(c.id) = upper(trim(_id)) LIMIT 1
$$;
REVOKE ALL ON FUNCTION public.get_public_certificate(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_certificate(text) TO anon, authenticated;
CREATE OR REPLACE FUNCTION public.public_stats()
RETURNS TABLE(total bigint, recorded bigint, activities bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT count(*), count(transaction_id), count(DISTINCT activity_name) FROM public.certificates
$$;
REVOKE ALL ON FUNCTION public.public_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_stats() TO anon, authenticated;