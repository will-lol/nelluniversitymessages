function getDateAge(date: Date): number {
    return Date.now() - date.valueOf();
}

function stringCreator(word:string, count: number): string {
    if (count > 1) {
        return count + " " + word + "s ago";
    }
    else return count + " " + word + " ago";
}

export function timeElapsedString(date: Date): string {
    const seconds = getDateAge(date)/1000;

    if (seconds < 60) {
        return stringCreator("second", Math.floor(seconds));
    } else if (seconds < 60*60) {
        return stringCreator("minute", Math.floor(seconds/60));
    } else if (seconds < 60*60*24) {
        return stringCreator("hour", Math.floor(seconds/60/60));
    } else if (seconds < 60*60*24*7) {
        return stringCreator("day", Math.floor(seconds/60/60/24));
    } else if (seconds < 60*60*24*7*4.34814285714) {
        return stringCreator("week", Math.floor(seconds/60/60/24/7));
    } else if (seconds < 60*60*24*7*4.34814285714*12) {
        return stringCreator("month", Math.floor(seconds/60/60/24/7/4.34814285714));
    } else {
        return stringCreator("year", Math.floor(seconds/60/60/24/7/4.34814285714/12));
    }
}