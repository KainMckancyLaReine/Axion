import { StarIcon } from '@heroicons/react/24/solid';
import { useCrypto } from '../../context/CryptoContext';
import SparklineChart from '../charts/SparklineChart';
import { Cryptocurrency } from '../../types/crypto';

type TokenTableProps = {
    cryptocurrencies: Cryptocurrency[];
    currency: string;
    favorites: string[];
};

const TokenTable = ({ cryptocurrencies, currency, favorites }: TokenTableProps) => {
    const { toggleFavorite } = useCrypto();

    const formatPrice = (price: number) => {
        if (price < 1) return price.toPrecision(4);
        return price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatMarketCap = (cap: number) => {
        if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
        if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
        if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
        return `$${cap.toLocaleString()}`;
    };

    const getChangeColor = (value: number) => {
        if (value > 0) return 'text-green-500';
        if (value < 0) return 'text-red-500';
        return 'text-gray-500';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Coin
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        1h
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        24h
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        7d
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        24h Volume
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Market Cap
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Last 7 Days
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {cryptocurrencies.map((crypto) => (
                    <tr key={crypto.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {crypto.market_cap_rank}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <button
                                    onClick={() => toggleFavorite(crypto.id)}
                                    className="mr-2"
                                >
                                    <StarIcon
                                        className={`h-5 w-5 ${favorites.includes(crypto.id) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`}
                                    />
                                </button>
                                <div className="flex-shrink-0 h-10 w-10">
                                    <img className="h-10 w-10 rounded-full" src={crypto.image} alt={crypto.name} />
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {crypto.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {crypto.symbol.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {currency.toUpperCase()} {formatPrice(crypto.current_price)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getChangeColor(crypto.price_change_percentage_1h_in_currency)}`}>
                            {crypto.price_change_percentage_1h_in_currency?.toFixed(1) || '0.0'}%
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getChangeColor(crypto.price_change_percentage_24h_in_currency)}`}>
                            {crypto.price_change_percentage_24h_in_currency?.toFixed(1) || '0.0'}%
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getChangeColor(crypto.price_change_percentage_7d_in_currency)}`}>
                            {crypto.price_change_percentage_7d_in_currency?.toFixed(1) || '0.0'}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatMarketCap(crypto.total_volume)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatMarketCap(crypto.market_cap)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-32 h-10">
                                <SparklineChart
                                    data={crypto.sparkline_in_7d?.price || []}
                                    priceChange={crypto.price_change_percentage_7d_in_currency || 0}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TokenTable;