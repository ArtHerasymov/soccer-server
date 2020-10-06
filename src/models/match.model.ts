import { Schema } from 'mongoose';

export const MatchSchema = new Schema({
  date: Date,
  ownTeam: String,
  ownGoals: Number,
  guest: String,
  guestGoals: Number,
});

export interface Match {
  id?: string;
  date: Date,
  guest: string,
  guestGoals: number,
  ownTeam?: string;
  ownGoals: number,
}