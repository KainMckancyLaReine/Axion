import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CoinGeckoService } from '../services/coingecko';
import { Cryptocurrency, MarketData } from '../types/crypto';

type CryptoContextType = {
    cryptocurrencies: Cryptocurrency[];
    loading: boolean;
    error: string | null;
    favorites: string[];
    currency: string;
    setCurrency: (currency: string) => void;
    toggleFavorite: (id: string) => void;
    refreshData: () => void;
    marketData: MarketData | null;
};

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

export const CryptoProvider = ({ children }: { children: React.ReactNode }) => {
    const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [currency, setCurrency] = useState('usd');
    const [marketData, setMarketData] = useState<MarketData | null>(null);

    useEffect(() => {
        const savedFavorites = localStorage.getItem('cryptoFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }

        const savedCurrency = localStorage.getItem('currency') || 'usd';
        setCurrency(savedCurrency);

        fetchData();
        fetchGlobalData();
    }, [currency]);

    const fetchData = async () => {
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

    const fetchGlobalData = async () => {
        try {
            const data = await CoinGeckoService.getGlobalMarketData();
            setMarketData(data);
        } catch (err) {
            console.error('Failed to fetch global data:', err);
        }
    };

    const toggleFavorite = (id: string) => {
        const newFavorites = favorites.includes(id)
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];
        setFavorites(newFavorites);
        localStorage.setItem('cryptoFavorites', JSON.stringify(newFavorites));
    };

    const refreshData = () => {
        fetchData();
        fetchGlobalData();
    };

    const handleSetCurrency = (newCurrency: string) => {
        setCurrency(newCurrency);
        localStorage.setItem('currency', newCurrency);
    };

    return (
        <CryptoContext.Provider
            value={{
                cryptocurrencies,
                loading,
                error,
                favorites,
                currency,
                setCurrency: handleSetCurrency,
                toggleFavorite,
                refreshData,
                marketData,
            }}
        >
            {children}
        </CryptoContext.Provider>
    );
};

export const useCrypto = () => useContext(CryptoContext);