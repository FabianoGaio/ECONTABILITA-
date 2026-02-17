-- ═══════════════════════════════════════════════════════════
-- FIX: Ricrea trigger handle_new_user
-- Eseguire nel Supabase SQL Editor (Dashboard > SQL Editor)
-- ═══════════════════════════════════════════════════════════

-- 1) Rimuovi il vecchio trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2) Ricrea la funzione con SET search_path e gestione errori
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profili (id, nome, cognome)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'cognome', '')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Non bloccare la registrazione se il profilo fallisce
  RAISE WARNING 'handle_new_user failed for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3) Ricrea il trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4) Verifica: il trigger dovrebbe apparire qui
SELECT tgname, tgrelid::regclass, proname
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'auth.users'::regclass;
