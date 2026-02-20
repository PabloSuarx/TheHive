/**
 * Calculates the estimated reading time of a given text.
 * Assumes an average reading speed of 200 words per minute.
 * 
 * @param content The raw markdown or text content.
 * @returns The estimated reading time in minutes (rounded up).
 */
export function calculateReadingTime(content: string): number {
    if (!content) return 0;

    const cleanText = content
        .replace(/<[^>]*>/g, "")
        .replace(/[#*`~\[\]\(\)]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const wordCount = cleanText.split(" ").length;
    const wordsPerMinute = 100;

    return Math.ceil(wordCount / wordsPerMinute);
}
