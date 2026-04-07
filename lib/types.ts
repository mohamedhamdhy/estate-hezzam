// lib/types.ts
export interface Profile {
  id: string;
  username: string | null;
  email: string | null;
  phone: string | null;
  profile_image: string | null;
  created_at: string;
  updated_at: string | null;
}