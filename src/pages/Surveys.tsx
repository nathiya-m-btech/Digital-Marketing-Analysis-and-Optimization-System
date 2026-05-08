import { useState } from 'react';
import { useSurveys } from '@/hooks/useSurveys';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { SurveyType } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';

const surveyTypes: SurveyType[] = ['Product Survey', 'User Purchase Survey', 'Marketing Feedback Survey'];
const COLORS = ['#7C3AED', '#06B6D4', '#F59E0B'];

export default function Surveys() {
  const { user } = useAuth();
  const { surveys, loading, refetch } = useSurveys();
  const [activeType, setActiveType] = useState<SurveyType | 'All'>('All');
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<SurveyType>('Product Survey');
  const [rating, setRating] = useState(4);
  const [feedback, setFeedback] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filtered = activeType === 'All' ? surveys : surveys.filter(s => s.type === activeType);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in.'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('surveys').insert({
      user_id: user._id, type, rating, feedback, campaign_name: campaignName || null,
      answers: { feedback: feedback || '—' },
    });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else {
      toast.success('Survey submitted!');
      setShowForm(false); setFeedback(''); setCampaignName('');
      refetch();
    }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('surveys').delete().eq('id', id);
    if (error) toast.error(error.message); else { toast.success('Deleted'); refetch(); }
  };

  const typeStats = surveyTypes.map(t => ({
    type: t.replace(' Survey', ''),
    count: surveys.filter(s => s.type === t).length,
  }));

  const ratingDist = [1, 2, 3, 4, 5].map(r => ({
    rating: `${r}★`,
    count: surveys.filter(s => Math.round(s.rating) === r).length,
  }));

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Surveys</h1>
          <p className="text-muted-foreground">Manage and analyze survey responses</p>
        </div>
        {user && (
          <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-primary-foreground border-0">
            {showForm ? 'Close' : 'New Survey'}
          </Button>
        )}
      </div>

      {showForm && user && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8 animate-slide-up">
          <h3 className="font-display font-semibold mb-4">Submit Survey Response</h3>
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Survey Type</Label>
              <select value={type} onChange={e => setType(e.target.value as SurveyType)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1">
                {surveyTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <Label>Rating (1-5)</Label>
              <Input type="number" min={1} max={5} step={0.1} value={rating} onChange={e => setRating(Number(e.target.value))} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label>Campaign (optional)</Label>
              <Input value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="Campaign name" className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label>Feedback</Label>
              <textarea value={feedback} onChange={e => setFeedback(e.target.value)} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 min-h-[80px]" placeholder="Your feedback..." />
            </div>
            <Button type="submit" disabled={submitting} className="gradient-primary text-primary-foreground border-0">
              {submitting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}Submit
            </Button>
          </form>
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setActiveType('All')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeType === 'All' ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>All</button>
        {surveyTypes.map(t => (
          <button key={t} onClick={() => setActiveType(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeType === t ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>{t}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Responses by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={typeStats} cx="50%" cy="50%" outerRadius={80} dataKey="count" label={({ type }) => type}>
                {typeStats.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display font-semibold mb-4">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ratingDist}>
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-12">No surveys yet. {user ? 'Submit your first response above.' : 'Sign in to submit a survey.'}</div>
          )}
          {filtered.map(s => (
            <div key={s._id} className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{s.type}</span>
                {s.campaign_name && <span className="text-xs ml-2 text-muted-foreground">{s.campaign_name}</span>}
                <p className="text-sm mt-2">{s.feedback || '—'}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold">{s.rating}★</span>
                <span className="text-xs text-muted-foreground">{s.created_at}</span>
                {user && s.user_id === user._id && (
                  <Button size="sm" variant="ghost" onClick={() => remove(s._id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
