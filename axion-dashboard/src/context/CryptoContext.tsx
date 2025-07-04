import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CoinGeckoService } from '../services/CoinGeckoService';
import type { Cryptocurrency, MarketData } from '../types/crypto';

export interface Cryptocurrency {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
    total_volume: number;
    sparkline_in_7d?: {
        price: number[];
    };
    price_change_percentage_1h_in_currency?: number;
    price_change_percentage_24h_in_currency?: number;
    price_change_percentage_7d_in_currency?: number;
}

export interface MarketData {
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
}

interface CryptoContextType {
    cryptocurrencies: Cryptocurrency[];
    loading: boolean;
    error: string | null;
    favorites: string[];
    currency: string;
    setCurrency: (currency: string) => void;
    toggleFavorite: (id: string) => void;
    refreshData: () => void;
    marketData: MarketData | null;
}

interface CryptoProviderProps {
    children: ReactNode;
}

const CryptoContext = createContext<CryptoContextType>({
    cryptocurrencies: [],
    loading: false,
    error: null,
    favorites: [],
    currency: 'usd',
    setCurrency: () => {},
    toggleFavorite: () => {},
    refreshData: () => {},
    marketData: null,
});

export const CryptoProvider: React.FC<CryptoProviderProps> = ({ children }) => {
    const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [currency, setCurrency] = useState<string>('usd');
    const [marketData, setMarketData] = useState<MarketData | null>(null);

    useEffect(() => {
        const savedFavorites = localStorage.getItem('cryptoFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }

        const savedCurrency = localStorage.getItem('currency') || 'usd';
        setCurrency(savedCurrency);

        void fetchData();
        void fetchGlobalData();
    }, [currency]);

    const fetchData = async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const data = await CoinGeckoService.getTopCryptocurrencies(currency);
            setCryptocurrencies(data);
        } catch (err) {
            setError('Failed to fetch data. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchGlobalData = async (): Promise<void> => {
        try {
            const data = await CoinGeckoService.getGlobalMarketData();
            setMarketData(data);
        } catch (err) {
            console.error('Failed to fetch global data:', err);
        }
    };

    const toggleFavorite = (id: string): void => {
        const newFavorites = favorites.includes(id)
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];
        setFavorites(newFavorites);
        localStorage.setItem('cryptoFavorites', JSON.stringify(newFavorites));
    };

    const refreshData = (): void => {
        void fetchData();
        void fetchGlobalData();
    };

    const handleSetCurrency = (newCurrency: string): void => {
        setCurrency(newCurrency);
        localStorage.setItem('currency', newCurrency);
    };

    const contextValue: CryptoContextType = {
        cryptocurrencies,
        loading,
        error,
        favorites,
        currency,
        setCurrency: handleSetCurrency,
        toggleFavorite,
        refreshData,
        marketData,
    };

    return (
        <CryptoContext.Provider value={contextValue}>
            {children}
        </CryptoContext.Provider>
    );
};

export const useCrypto = (): CryptoContextType => {
    const context = useContext(CryptoContext);
    if (context === undefined) {
        throw new Error('useCrypto must be used within a CryptoProvider');
    }
    return context;
};