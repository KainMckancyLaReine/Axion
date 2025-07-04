// src/hooks/useCryptoData.ts
import { useState, useEffect, useCallback } from 'react';
import { CoinGeckoService } from '../services/CoinGeckoService';
import { Cryptocurrency, MarketData } from '../types/crypto';

export const useCryptoData = (currency: string) => {
    const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
    const [marketData, setMarketData] = useState<MarketData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [coins, globalData] = await Promise.all([
                CoinGeckoService.getTopCryptocurrencies(currency),
                CoinGeckoService.getGlobalMarketData()
            ]);

            setCryptocurrencies(coins);
            setMarketData(globalData);
        } catch (err) {
            setError('Failed to fetch cryptocurrency data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currency]);

    const fetchCoinDetails = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const data = await CoinGeckoService.getCoinDetails(id, currency);
            return data;
        } catch (err) {
            console.error(`Failed to fetch details for coin ${id}:`, err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [currency]);

    const fetchCoinMarketChart = useCallback(async (id: string, days: number = 30) => {
        try {
            const data = await CoinGeckoService.getCoinMarketChart(id, currency, days);
            return data;
        } catch (err) {
            console.error(`Failed to fetch market chart for coin ${id}:`, err);
            throw err;
        }
    }, [currency]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        cryptocurrencies,
        marketData,
        loading,
        error,
        refreshData: fetchData,
        fetchCoinDetails,
        fetchCoinMarketChart
    };
};