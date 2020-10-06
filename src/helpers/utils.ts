import { Match } from '../matches/match.model';

export const transformApiDataToMatch = ({ AwayTeam, HomeTeam, Date, FTHG, FTAG }) : Match => ({
    ownTeam: HomeTeam,
    ownGoals: FTHG,
    guest: AwayTeam,
    guestGoals: FTAG,
    date: Date.split('/').reverse().join('-')
});
