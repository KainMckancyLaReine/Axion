import axios from 'axios';
import { Cryptocurrency } from '../types/crypto';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

interface GlobalMarketData {
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
}

interface CoinDetails {
  id: string;
  name: string;
  symbol: string;
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    price_change_percentage_24h: number;
  };
}

interface MarketChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export const CoinGeckoService = {
    getTopCryptocurrencies: async (currency: string = 'usd', perPage: number = 100): Promise<Cryptocurrency[]> => {
        try {
            const response = await axios.get<Cryptocurrency[]>(`${API_BASE_URL}/coins/markets`, {
                params: {
                    vs_currency: currency,
                    order: 'market_cap_desc',
                    per_page: perPage,
                    page: 1,
                    sparkline: true,
                    price_change_percentage: '1h,24h,7d',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching top cryptocurrencies:', error);
            throw error;
        }
    },

    getGlobalMarketData: async (): Promise<GlobalMarketData> => {
        try {
            const response = await axios.get<{ data: GlobalMarketData }>(`${API_BASE_URL}/global`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching global market data:', error);
            throw error;
        }
    },

    getCoinDetails: async (id: string, currency: string = 'usd'): Promise<CoinDetails> => {
        try {
            const response = await axios.get<CoinDetails>(`${API_BASE_URL}/coins/${id}`, {
                params: {
                    localization: false,
                    tickers: false,
                    market_data: true,
                    community_data: false,
                    developer_data: false,
                    sparkline: false,
                    vs_currency: currency,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching details for coin ${id}:`, error);
            throw error;
        }
    },

    getCoinMarketChart: async (id: string, currency: string = 'usd', days: number = 30): Promise<MarketChartData> => {
        try {
            const response = await axios.get<MarketChartData>(`${API_BASE_URL}/coins/${id}/market_chart`, {
                params: {
                    vs_currency: currency,
                    days: days,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching market chart for coin ${id}:`, error);
            throw error;
        }
    },
};