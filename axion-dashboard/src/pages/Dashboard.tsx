import { useState, useEffect } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { useTheme } from '../context/ThemeContext';
import TokenTable from '../components/crypto/TokenTable';
import MarketOverview from '../components/crypto/MarketOverview';
import SearchBar from '../components/common/SearchBar';
import CurrencySelector from '../components/common/CurrencySelector';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
    const {
        cryptocurrencies,
        loading,
        error,
        favorites,
        currency,
        setCurrency,
        refreshData,
        marketData,
    } = useCrypto();
    const { theme, toggleTheme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [filteredCryptos, setFilteredCryptos] = useState<Cryptocurrency[]>([]);

    useEffect(() => {
        let result = cryptocurrencies;

        if (searchTerm) {
            result = result.filter(crypto =>
                crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (activeTab === 'favorites') {
            result = result.filter(crypto => favorites.includes(crypto.id));
        }

        setFilteredCryptos(result);
    }, [cryptocurrencies, searchTerm, activeTab, favorites]);

    const handleRefresh = () => {
        refreshData();
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Axion Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <CurrencySelector currency={currency} setCurrency={setCurrency} />
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="p-2 rounded-lg bg-blue-500 text-white flex items-center space-x-1"
                        >
                            <ArrowPathIcon className="h-5 w-5" />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {marketData && <MarketOverview data={marketData} currency={currency} />}

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <button
                                className={`py-2 px-4 font-medium text-sm ${activeTab === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => setActiveTab('all')}
                            >
                                All Coins
                            </button>
                            <button
                                className={`py-2 px-4 font-medium text-sm ${activeTab === 'favorites' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
                                onClick={() => setActiveTab('favorites')}
                            >
                                Favorites
                            </button>
                        </div>
                    </div>

                    {loading && <LoadingSpinner />}
                    {error && <ErrorMessage message={error} />}
                    {!loading && !error && (
                        <TokenTable
                            cryptocurrencies={filteredCryptos}
                            currency={currency}
                            favorites={favorites}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;