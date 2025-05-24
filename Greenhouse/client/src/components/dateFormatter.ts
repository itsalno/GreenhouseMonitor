export const formatTimestamp = (timestamp: string | number | Date): string => {
    if (!timestamp) return "N/A";
    try {
        const date = new Date(timestamp);
        const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };

        const formattedDate = date.toLocaleDateString(undefined, dateOptions);
        const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

        return `${formattedDate}, ${formattedTime}`;
    } catch (error) {
        console.error("Error formatting timestamp:", timestamp, error);
        return "Invalid Date";
    }
};
