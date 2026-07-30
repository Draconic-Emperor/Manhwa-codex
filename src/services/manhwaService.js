import { supabase } from '../supabase';
import { withRetry, unwrap } from './withRetry';

export const manhwaService = {
  async list() {
    return unwrap(await withRetry(() => supabase.from('manhwa').select('*')));
  },

  async create(payload) {
    const data = unwrap(
      await withRetry(() => supabase.from('manhwa').insert([payload]).select())
    );
    return data?.[0];
  },

  async update(id, payload) {
    const data = unwrap(
      await withRetry(() => supabase.from('manhwa').update(payload).eq('id', id).select())
    );
    return data?.[0];
  },

  async remove(id) {
    unwrap(await withRetry(() => supabase.from('manhwa').delete().eq('id', id)));
    return true;
  },
};
