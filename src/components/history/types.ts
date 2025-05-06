
// Define the interface for search history items
export interface SearchHistoryItem {
  id: string;
  keyword: string;
  created_at: string;
  min_views: number;
  min_subscribers: number;
  country: string;
  language: string;
  include_shorts: boolean;
  max_results: number;
  channel_age: string | null; // String | null to match DB
  user_id: string;
}
