import { IResourceResponse } from '../modules/matches/matches.service';
import { Match } from '../models/match.model';

export const transformApiDataToMatch = ({ AwayTeam, HomeTeam, Date, FTHG, FTAG }: any) : Match => ({
    ownTeam: HomeTeam,
    ownGoals: FTHG,
    guest: AwayTeam,
    guestGoals: FTAG,
    date: Date.split('/').reverse().join('-')
});
