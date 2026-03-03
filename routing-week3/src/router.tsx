import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
// import StockDetail from './pages/StockDetail';
import Watchlist from './pages/Watchlist';
// import Login from './pages/Login';
import NotFound from './pages/NotFound';
import StockLayout from './pages/stocks/StockLayout';
import Overview from './pages/stocks/Overview';
import News from './pages/stocks/News';
import Financials from './pages/stocks/Financials';

export default function AppRouter() {
    return (
        <Routes>
            <Route path='/' element={<Layout />}> {/* parent layout */}
                <Route index element={<Dashboard />} /> 
                <Route path='stock/:symbol' element={<StockLayout />}> 
                    <Route index element={<Navigate to='overview' replace />} />
                        <Route path='overview' element={<Overview />} />
                        <Route path='financials' element={<Financials />} />
                        <Route path='news' element={<News />} />
                </Route> 
                <Route path='watchlist' element={<Watchlist />} /> 
                {/* <Route path='login' element={<Login />} /> /login */}
            </Route>
            <Route path='*' element={<NotFound />} /> {/* 404 */}
        </Routes>
    );
}