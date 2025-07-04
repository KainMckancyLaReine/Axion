import { MarketData } from '../../types/crypto';

type MarketOverviewProps = {
    data: MarketData;
    currency: string;
};

const MarketOverview = ({ data, currency }: MarketOverviewProps) => {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };

    const formatPercentage = (num: number) => {
        return `${num.toFixed(2)}%`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 shadow">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Market Cap</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                    {formatNumber(data.total_market_cap[currency])}
                </p>
                <p className={`text-sm ${data.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatPercentage(data.market_cap_change_percentage_24h_usd)}
                </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 shadow">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">24h Volume</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                    {formatNumber(data.total_volume[currency])}
                </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 shadow">
                <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">Active Cryptocurrencies</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                    {data.active_cryptocurrencies}
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-300">
                    {data.markets} Markets
                </p>
            </div>
        </div>
    );
};

export default MarketOverview;