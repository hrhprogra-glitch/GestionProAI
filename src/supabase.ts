import { createClient } from '@supabase/supabase-js';

// ESTAMOS PONIENDO LAS CLAVES DIRECTAMENTE PARA FORZAR LA CONEXIÓN
const supabaseUrl = 'https://pccwjkjmaapjmaxgarce.supabase.co';
const supabaseKey = 'sb_publishable_3KcKXLIu2eSno-3ZSR9Kgg_tS9WtiNy';

export const supabase = createClient(supabaseUrl, supabaseKey);