import type { Campaign, Product, Survey, Notification, Review, Platform, Season } from '@/types';

export const platforms: Platform[] = ['Instagram', 'Google Ads', 'YouTube', 'Facebook', 'Twitter/X', 'LinkedIn'];
export const seasons: Season[] = ['Summer', 'Rainy', 'Winter', 'Festival'];

export const products: Product[] = [
  { _id: 'p1', name: 'Sunscreen Pro', category: 'Beauty', season_peak: 'Summer', sales: 45000 },
  { _id: 'p2', name: 'Rain Jacket Elite', category: 'Apparel', season_peak: 'Rainy', sales: 32000 },
  { _id: 'p3', name: 'Thermal Mug', category: 'Home', season_peak: 'Winter', sales: 28000 },
  { _id: 'p4', name: 'Gift Hamper Deluxe', category: 'Gifts', season_peak: 'Festival', sales: 67000 },
  { _id: 'p5', name: 'Fitness Tracker X', category: 'Electronics', season_peak: 'Summer', sales: 53000 },
  { _id: 'p6', name: 'Umbrella Ultra', category: 'Accessories', season_peak: 'Rainy', sales: 19000 },
  { _id: 'p7', name: 'Wool Sweater', category: 'Apparel', season_peak: 'Winter', sales: 41000 },
  { _id: 'p8', name: 'Party Lights Set', category: 'Decor', season_peak: 'Festival', sales: 38000 },
];

export const campaigns: Campaign[] = [
  { _id: 'c1', user_id: 'u1', platform: 'Instagram', budget: 5000, revenue: 18000, ROI: 260, success_rate: 87, season: 'Summer', product_id: 'p1', name: 'Summer Glow Campaign', status: 'Active', created_at: '2024-06-01' },
  { _id: 'c2', user_id: 'u1', platform: 'Google Ads', budget: 8000, revenue: 24000, ROI: 200, success_rate: 92, season: 'Festival', product_id: 'p4', name: 'Festival Gift Rush', status: 'Active', created_at: '2024-10-15' },
  { _id: 'c3', user_id: 'u1', platform: 'YouTube', budget: 12000, revenue: 31000, ROI: 158, success_rate: 78, season: 'Winter', product_id: 'p7', name: 'Winter Fashion Series', status: 'Completed', created_at: '2024-12-01' },
  { _id: 'c4', user_id: 'u1', platform: 'Facebook', budget: 3000, revenue: 9500, ROI: 217, success_rate: 81, season: 'Rainy', product_id: 'p2', name: 'Monsoon Ready Ads', status: 'Active', created_at: '2024-07-10' },
  { _id: 'c5', user_id: 'u1', platform: 'Twitter/X', budget: 2000, revenue: 5800, ROI: 190, success_rate: 73, season: 'Summer', product_id: 'p5', name: 'Fitness Summer Push', status: 'Paused', created_at: '2024-05-20' },
  { _id: 'c6', user_id: 'u1', platform: 'LinkedIn', budget: 6000, revenue: 19000, ROI: 217, success_rate: 89, season: 'Festival', product_id: 'p8', name: 'B2B Festival Outreach', status: 'Active', created_at: '2024-11-01' },
  { _id: 'c7', user_id: 'u1', platform: 'Instagram', budget: 4500, revenue: 14000, ROI: 211, success_rate: 84, season: 'Winter', product_id: 'p3', name: 'Cozy Winter Vibes', status: 'Completed', created_at: '2024-01-15' },
  { _id: 'c8', user_id: 'u1', platform: 'Google Ads', budget: 7000, revenue: 21000, ROI: 200, success_rate: 90, season: 'Rainy', product_id: 'p6', name: 'Stay Dry Search Ads', status: 'Active', created_at: '2024-08-05' },
  { _id: 'c9', user_id: 'u1', platform: 'YouTube', budget: 15000, revenue: 42000, ROI: 180, success_rate: 85, season: 'Summer', product_id: 'p1', name: 'Sun Protection Tutorial', status: 'Active', created_at: '2024-06-20' },
  { _id: 'c10', user_id: 'u1', platform: 'Facebook', budget: 5500, revenue: 16500, ROI: 200, success_rate: 79, season: 'Festival', product_id: 'p4', name: 'Holiday Special Deals', status: 'Completed', created_at: '2024-12-20' },
];

export const surveys: Survey[] = [
  { _id: 's1', user_id: 'u1', type: 'Product Survey', rating: 4.5, answers: { quality: 'Excellent', value: 'Good', recommend: 'Yes' }, campaign_id: 'c1', created_at: '2024-06-15' },
  { _id: 's2', user_id: 'u1', type: 'User Purchase Survey', rating: 3.8, answers: { ease: 'Easy', satisfaction: 'Satisfied', repeat: 'Likely' }, campaign_id: 'c2', created_at: '2024-10-25' },
  { _id: 's3', user_id: 'u1', type: 'Marketing Feedback Survey', rating: 4.2, answers: { reach: 'Wide', engagement: 'High', creativity: 'Very Good' }, campaign_id: 'c3', created_at: '2024-12-10' },
  { _id: 's4', user_id: 'u1', type: 'Product Survey', rating: 4.0, answers: { quality: 'Good', value: 'Good', recommend: 'Maybe' }, campaign_id: 'c4', created_at: '2024-07-20' },
  { _id: 's5', user_id: 'u1', type: 'User Purchase Survey', rating: 4.7, answers: { ease: 'Very Easy', satisfaction: 'Very Satisfied', repeat: 'Definitely' }, campaign_id: 'c5', created_at: '2024-06-01' },
  { _id: 's6', user_id: 'u1', type: 'Marketing Feedback Survey', rating: 3.5, answers: { reach: 'Moderate', engagement: 'Medium', creativity: 'Good' }, campaign_id: 'c6', created_at: '2024-11-15' },
];

export const notifications: Notification[] = [
  { _id: 'n1', message: 'Campaign "Summer Glow" created successfully', user_id: 'u1', triggered_by: 'system', timestamp: '2024-06-01T10:00:00Z', read_status: false },
  { _id: 'n2', message: 'ROI updated for Festival Gift Rush: 200%', user_id: 'u1', triggered_by: 'system', timestamp: '2024-10-20T14:30:00Z', read_status: false },
  { _id: 'n3', message: 'New survey response received', user_id: 'u1', triggered_by: 'system', timestamp: '2024-12-10T09:15:00Z', read_status: true },
  { _id: 'n4', message: 'Campaign "Winter Fashion Series" completed', user_id: 'u1', triggered_by: 'system', timestamp: '2024-12-31T18:00:00Z', read_status: false },
  { _id: 'n5', message: 'AI suggestion: Increase budget for LinkedIn campaigns', user_id: 'u1', triggered_by: 'ai', timestamp: '2025-01-05T08:00:00Z', read_status: false },
];

export const reviews: Review[] = [
  { _id: 'r1', name: 'Sarah Johnson', feedback: 'MarketPulse helped us increase ROI by 40% in just 3 months!', ROI_change: 40 },
  { _id: 'r2', name: 'Mike Chen', feedback: 'The platform comparison feature saved us thousands in ad spend.', ROI_change: 25 },
  { _id: 'r3', name: 'Emily Davis', feedback: 'Real-time analytics changed how we approach seasonal campaigns.', ROI_change: 55 },
];

export const platformColors: Record<string, string> = {
  'Instagram': '#E1306C',
  'Google Ads': '#4285F4',
  'YouTube': '#FF0000',
  'Facebook': '#1877F2',
  'Twitter/X': '#000000',
  'LinkedIn': '#0A66C2',
};
