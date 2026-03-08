import { content } from '../data/predefinedContent';

export const generateDailyRoutine = () => {
    const dateSeed = new Date().toDateString();

    // Simple hashing function to get a consistent number from a string
    const hashString = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    };

    const seed = hashString(dateSeed);

    const getItem = (arr, s) => arr[s % arr.length];

    return {
        date: dateSeed,
        workout: getItem(content.workouts, seed),
        breathing: getItem(content.breathing, seed + 1),
        meal: getItem(content.meals, seed + 2),
    };
};
