export function shuffleArray(array: any[]) {
    let currentIndex = array.length;
    let randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

export function flipIndex(armyIndex: number): number {
    return Math.abs(armyIndex - 1);
}

export function getRandomNumber(numOfDigits: number) {
    const min = Math.pow(10, numOfDigits - 1);
    const max = Math.pow(10, numOfDigits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getDateTime(date: Date) {
    const year = date.getFullYear().toString().slice(2); // Get last two digits of the year
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Format month as two digits
    const day = ('0' + date.getDate()).slice(-2); // Format day as two digits
    const hours = ('0' + date.getHours()).slice(-2); // Format hours as two digits
    const minutes = ('0' + date.getMinutes()).slice(-2); // Format minutes as two digits
    const seconds = ('0' + date.getSeconds()).slice(-2); // Format seconds as two digits
    return `${day}/${month}/${year}/ ${hours}:${minutes}:${seconds}`;
}
