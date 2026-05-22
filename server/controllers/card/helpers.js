// Helper to parse date string in local timezone to avoid timezone shifting
export const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    const cleanStr = typeof dateStr === "string" ? dateStr.split("T")[0] : dateStr;
    const parts = cleanStr.toString().split("-");
    if (parts.length === 3) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    return new Date(dateStr);
};
