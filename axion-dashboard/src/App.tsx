import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CryptoProvider } from './context/CryptoContext';
import Dashboard from './pages/Dashboard';
import TokenDetail from './pages/TokenDetail';
import Layout from './components/layout/Layout';

function App() {
    return (
        <ThemeProvider>
            <CryptoProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/token/:id" element={<TokenDetail />} />
                        </Routes>
                    </Layout>
                </Router>
            </CryptoProvider>
        </ThemeProvider>
    );
}

export default App;