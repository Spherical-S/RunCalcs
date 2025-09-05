export default function formatSecToTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const secondsRaw = time % 60;

    const seconds = `${Math.floor(secondsRaw).toString().padStart(2, '0')}.${(secondsRaw % 1).toFixed(2).slice(2)}`;

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hours > 0) {
        return `${hours}:${pad(minutes)}:${seconds}`;
    } else if (minutes > 0) {
        return `${minutes}:${seconds}`;
    } else{
        return `${seconds}`;
    }
}