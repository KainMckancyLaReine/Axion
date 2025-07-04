const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 shadow-sm mt-8">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} Axion Dashboard. Data provided by CoinGecko API.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;