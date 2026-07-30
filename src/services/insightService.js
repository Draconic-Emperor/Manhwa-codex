import { supabase } from '../supabase';
import { withRetry, unwrap } from './withRetry';

export const insightService = {
  async list() {
    return unwrap(
      await withRetry(() =>
        supabase.from('insights').select('*').order('created_at', { ascending: false })
      )
    );
  },

  async create(payload) {
    const data = unwrap(
      await withRetry(() => supabase.from('insights').insert([payload]).select())
    );
    return data?.[0];
  },

  async remove(id) {
    unwrap(await withRetry(() => supabase.from('insights').delete().eq('id', id)));
    return true;
  },
};
