import { supabase } from '../supabase';
import { withRetry, unwrap } from './withRetry';

export const characterService = {
  async list() {
    return unwrap(await withRetry(() => supabase.from('characters').select('*')));
  },

  async create(payload) {
    const data = unwrap(
      await withRetry(() => supabase.from('characters').insert([payload]).select())
    );
    return data?.[0];
  },

  async update(id, payload) {
    const data = unwrap(
      await withRetry(() => supabase.from('characters').update(payload).eq('id', id).select())
    );
    return data?.[0];
  },

  async remove(id) {
    unwrap(await withRetry(() => supabase.from('characters').delete().eq('id', id)));
    return true;
  },
};
