import { Match } from '../models/match.model';

export interface IResourceResponse {
    AwayTeam: string;
    HomeTeam: string;
    Date: string;
    FTHG: number;
    FTAG: number;
}

export const transformApiDataToMatch = ({ AwayTeam, HomeTeam, Date, FTHG, FTAG }: IResourceResponse): Match => ({
    ownTeam: HomeTeam,
    ownGoals: FTHG,
    guest: AwayTeam,
    guestGoals: FTAG,
    date: Date.split('/').reverse().join('-')
});

export const isMatchValid = ({ ownTeam, ownGoals, guest, guestGoals, date }: Match): boolean => !!(ownTeam && ownGoals && guest && guestGoals && date);

