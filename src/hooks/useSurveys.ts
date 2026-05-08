import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Survey {
  _id: string;
  user_id: string;
  type: string;
  rating: number;
  feedback: string | null;
  campaign_name: string | null;
  answers: Record<string, string>;
  created_at: string;
}

export function useSurveys() {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user) { setSurveys([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase.from('surveys').select('*').order('created_at', { ascending: false });
    if (error) { console.error(error); setSurveys([]); }
    else {
      setSurveys((data || []).map((r: any) => ({
        _id: r.id, user_id: r.user_id, type: r.type, rating: Number(r.rating) || 0,
        feedback: r.feedback, campaign_name: r.campaign_name,
        answers: (r.answers as Record<string, string>) || {},
        created_at: r.created_at?.slice(0, 10) || '',
      })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { refetch(); }, [refetch]);

  return { surveys, loading, refetch };
}
