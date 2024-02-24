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
