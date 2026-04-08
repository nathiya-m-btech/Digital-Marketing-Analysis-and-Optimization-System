export type Platform = 'Instagram' | 'Google Ads' | 'YouTube' | 'Facebook' | 'Twitter/X' | 'LinkedIn';
export type Season = 'Summer' | 'Rainy' | 'Winter' | 'Festival';
export type UserRole = 'Admin' | 'Marketing Manager' | 'Business Owner' | 'Freelancer' | 'Digital Marketing Specialist' | 'CMO';
export type SurveyType = 'Product Survey' | 'User Purchase Survey' | 'Marketing Feedback Survey';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  profile_image?: string;
}

export interface Campaign {
  _id: string;
  user_id: string;
  platform: Platform;
  budget: number;
  revenue: number;
  ROI: number;
  success_rate: number;
  season: Season;
  product_id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Completed';
  created_at: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  season_peak: Season;
  sales: number;
}

export interface Survey {
  _id: string;
  user_id: string;
  type: SurveyType;
  rating: number;
  answers: Record<string, string>;
  campaign_id: string;
  created_at: string;
}

export interface Notification {
  _id: string;
  message: string;
  user_id: string;
  triggered_by: string;
  timestamp: string;
  read_status: boolean;
}

export interface Review {
  _id: string;
  name: string;
  feedback: string;
  ROI_change: number;
}
