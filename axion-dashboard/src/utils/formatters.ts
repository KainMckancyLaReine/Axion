// src/utils/formatters.ts

/**
 * Formatteer een prijs met de juiste currency notatie
 * @param value - De numerieke waarde
 * @param currency - Valuta code (bijv. 'usd', 'eur', 'btc')
 * @param maximumFractionDigits - Maximum aantal decimalen
 * @returns Geformatteerde prijs string
 */
export const formatPrice = (
    value: number,
    currency: string = 'usd',
    maximumFractionDigits: number = 6
): string => {
    if (currency.toLowerCase() === 'btc') {
        return `${value.toFixed(8)} BTC`;
    }

    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: value < 1 ? 4 : 2,
        maximumFractionDigits: value < 1 ? 6 : maximumFractionDigits
    }).format(value);
};

/**
 * Formatteer een percentage waarde
 * @param value - De numerieke waarde
 * @param digits - Aantal decimalen
 * @returns Geformatteerd percentage met +/-
 */
export const formatPercentage = (value: number, digits: number = 2): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`;
};

/**
 * Formatteer een grote numerieke waarde (market cap, volume)
 * @param value - De numerieke waarde
 * @returns Geformatteerde string met suffix (B, M, K)
 */
export const formatLargeNumber = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
};

/**
 * Formatteer een timestamp naar leesbare datum/tijd
 * @param timestamp - Unix timestamp in milliseconden
 * @returns Geformatteerde datum string
 */
export const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Krijg een kleurklasse gebaseerd op waarde (positief/negatief)
 * @param value - Numerieke waarde
 * @returns Tailwind CSS kleurklasse
 */
export const getValueColorClass = (value: number): string => {
    if (value > 0) return 'text-green-500 dark:text-green-400';
    if (value < 0) return 'text-red-500 dark:text-red-400';
    return 'text-gray-500 dark:text-gray-400';
};

/**
 * Verkort een crypto adres
 * @param address - Volledig crypto adres
 * @param startLength - Aantal chars aan het begin
 * @param endLength - Aantal chars aan het eind
 * @returns Verkort adres (bijv. 0xabcd...1234)
 */
export const shortenAddress = (
    address: string,
    startLength: number = 6,
    endLength: number = 4
): string => {
    return `${address.substring(0, startLength)}...${address.substring(
        address.length - endLength
    )}`;
};