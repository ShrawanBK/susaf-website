export const formatDateTime = (dateValue: string) => {
    const date = new Date(dateValue);

    const formattedDate = date.toLocaleDateString(
        'en-us',
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        },
    );
    const formattedTime = date.toLocaleTimeString();
    return `${formattedTime} ${formattedDate}`;
};

export const getBaseUrl = (url: string) => {
    const matchedUrl = url.match(/^https?:\/\/[^#?/]+/);
    if (!matchedUrl) {
        return '';
    }
    return matchedUrl[0];
};
