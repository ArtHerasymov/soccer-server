import { Schema } from 'mongoose';
import { Match } from '../matches/match.model';

export const TeamSchema = new Schema({
  title: String,
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }]
});

export interface Team {
  id?: string;
  title?: string;
  matches: Match[] | string[];
}

