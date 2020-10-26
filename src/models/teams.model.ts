import { Schema } from 'mongoose';
import { Match } from '../repositories/match.repository';

export const TEAM_SCHEMA_TYPE = 'Team';

export const TeamSchema = new Schema({
  title: String,
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }]
});

export interface Team {
  id?: string;
  title?: string;
  matches: Match[] | string[];
}

