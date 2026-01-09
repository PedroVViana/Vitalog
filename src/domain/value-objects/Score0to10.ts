export type Score0to10 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const isValidScore = (score: number): score is Score0to10 => {
    return Number.isInteger(score) && score >= 0 && score <= 10;
};
