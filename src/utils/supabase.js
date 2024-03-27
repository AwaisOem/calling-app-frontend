import { createClient } from "@supabase/supabase-js";

export const supabase =  createClient(
    // eslint-disable-next-line no-undef
    process.env.REACT_APP_SUPABASE_URL,
    // eslint-disable-next-line no-undef
    process.env.REACT_APP_SUPABASE_ANON_KEY
)


            