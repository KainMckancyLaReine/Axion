import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCrypto } from '../context/CryptoContext';
import { useTheme } from '../context/ThemeContext';
import { CoinGeckoService } from '../services/coingecko';
import PriceChart from '../components/charts/PriceChart';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TokenDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { currency, favorites, toggleFavorite } = useCrypto();
    const { theme } = useTheme();
    const [coinData, setCoinData] = useState<any>(null);
    const [priceData, setPriceData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoinData = async () => {
            try {
                setLoading(true);
                const [details, marketChart] = await Promise.all([
                    CoinGeckoService.getCoinDetails(id!, currency),
                    CoinGeckoService.getCoinMarketChart(id!, currency, parseInt(timeRange)),
                ]);
                setCoinData(details);
                setPriceData(marketChart);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch coin data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCoinData();
    }, [id, currency, timeRange]);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(num);
    };

    const formatPercentage = (num: number) => {
        return `${num?.toFixed(2) || '0.00'}%`;
    };

    const getChangeColor = (value: number) => {
        if (value > 0) return 'text-green-500';
        if (value < 0) return 'text-red-500';
        return 'text-gray-500';
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!coinData) return <div className="text-center py-10">No data available</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-700">
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                    <img src={coinData.image.large} alt={coinData.name} className="h-12 w-12 mr-4" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {coinData.name} ({coinData.symbol.toUpperCase()})
                        </h1>
                        <div className="text-gray-500 dark:text-gray-400">
                            Rank #{coinData.market_cap_rank}
                        </div>
                    </div>
                    <button
                        onClick={() => toggleFavorite(coinData.id)}
                        className="ml-4"
                    >
                        <StarIcon
                            className={`h-6 w-6 ${favorites.includes(coinData.id) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`}
                        />
                    </button>
                </div>
                <div className="flex space-x-2">
                    {['1', '7', '30', '90', '365', 'max'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 rounded-md ${timeRange === range
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                        >
                            {range === 'max' ? 'All' : `${range}d`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Price</h2>
                    <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                        {formatNumber(coinData.market_data.current_price[currency])}
                    </div>
                    <div className={`text-lg ${getChangeColor(coinData.market_data.price_change_percentage_24h_in_currency[currency])}`}>
                        {formatPercentage(coinData.market_data.price_change_percentage_24h_in_currency[currency])}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Market Stats</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Market Cap</span>
                            <span className="font-medium">{formatNumber(coinData.market_data.market_cap[currency])}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">24h Trading Volume</span>
                            <span className="font-medium">{formatNumber(coinData.market_data.total_volume[currency])}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Circulating Supply</span>
                            <span className="font-medium">
                {coinData.market_data.circulating_supply.toLocaleString()} {coinData.symbol.toUpperCase()}
              </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Price Change</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">1h</span>
                            <span className={getChangeColor(coinData.market_data.price_change_percentage_1h_in_currency[currency])}>
                {formatPercentage(coinData.market_data.price_change_percentage_1h_in_currency[currency])}
              </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">24h</span>
                            <span className={getChangeColor(coinData.market_data.price_change_percentage_24h_in_currency[currency])}>
                {formatPercentage(coinData.market_data.price_change_percentage_24h_in_currency[currency])}
              </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">7d</span>
                            <span className={getChangeColor(coinData.market_data.price_change_percentage_7d_in_currency[currency])}>
                {formatPercentage(coinData.market_data.price_change_percentage_7d_in_currency[currency])}
              </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Price Chart</h2>
                <div className="h-96">
                    {priceData && (
                        <PriceChart
                            data={priceData.prices}
                            currency={currency}
                            theme={theme}
                        />
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">About {coinData.name}</h2>
                <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: coinData.description.en }}
                />
            </div>
        </div>
    );
};

export default TokenDetail;