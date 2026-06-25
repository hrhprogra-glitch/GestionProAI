import { createClient } from '@supabase/supabase-js';

// ESTAMOS PONIENDO LAS CLAVES DIRECTAMENTE PARA FORZAR LA CONEXIÓN
const supabaseUrl = 'https://xdgxlhhnzliorznxbkjv.supabase.co';
const supabaseKey = 'sb_publishable_NKf6p7E_LEY-uLIxunLQaA_k1Bkmrec';

export const supabase = createClient(supabaseUrl, supabaseKey);