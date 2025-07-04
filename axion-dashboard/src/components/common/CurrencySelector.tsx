type CurrencySelectorProps = {
    currency: string;
    setCurrency: (currency: string) => void;
};

const CurrencySelector = ({ currency, setCurrency }: CurrencySelectorProps) => {
    const currencies = [
        { value: 'usd', label: 'USD' },
        { value: 'eur', label: 'EUR' },
        { value: 'btc', label: 'BTC' },
    ];

    return (
        <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-800"
        >
            {currencies.map((curr) => (
                <option key={curr.value} value={curr.value}>
                    {curr.label}
                </option>
            ))}
        </select>
    );
};

export default CurrencySelector;