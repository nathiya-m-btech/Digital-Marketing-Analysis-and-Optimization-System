import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Campaign, Platform, Season } from '@/types';

interface DbCampaign {
  id: string;
  owner_id: string;
  name: string;
  platform: string;
  season: string;
  status: string;
  budget: number;
  revenue: number;
  roi: number;
  success_rate: number;
  product_name: string | null;
  created_at: string;
  is_demo: boolean;
}

function toCampaign(row: DbCampaign): Campaign & { is_demo?: boolean } {
  return {
    _id: row.id,
    user_id: row.owner_id,
    name: row.name,
    platform: row.platform as Platform,
    season: row.season as Season,
    status: (row.status as Campaign['status']) ?? 'Active',
    budget: Number(row.budget) || 0,
    revenue: Number(row.revenue) || 0,
    ROI: Number(row.roi) || 0,
    success_rate: Number(row.success_rate) || 0,
    product_id: row.product_name ?? '',
    created_at: row.created_at?.slice(0, 10) ?? '',
    is_demo: row.is_demo,
  };
}

/**
 * Fetches campaigns visible to the current user via RLS:
 * - their own + demo rows (most users)
 * - everything (Admin / CMO)
 *
 * If `ownOnly` is true, demo rows are filtered out client-side so the user
 * sees a true per-user dashboard once they've uploaded data.
 */
export function useUserCampaigns(ownOnly = false) {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<(Campaign & { is_demo?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('campaign fetch error', error);
      setCampaigns([]);
    } else {
      let rows = (data as DbCampaign[]).map(toCampaign);
      if (ownOnly && user) {
        const ownRows = rows.filter(r => r.user_id === user._id);
        // Show user's own data when present; otherwise fall back to demo for empty state
        rows = ownRows.length > 0 ? ownRows : rows.filter(r => r.is_demo);
      }
      setCampaigns(rows);
    }
    setLoading(false);
  }, [ownOnly, user]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { campaigns, loading, refetch: fetchCampaigns };
}
