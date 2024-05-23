
import Header from '../components/Header';
import AnimatedComponent from '../components/AnimatedComponent';
import { useParams, useLocation, useNavigate, useMatch } from 'react-router-dom';
import { useEffect } from 'react';

declare global {
    interface Window {
        TradingView: any;
    }
}
const TradeNews: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const areaMatch = useMatch(`/trade/area/${id}`);
    const newsMatch = useMatch(`/trade/news/${id}`);
    const { stockName, username } = location.state as { stockName: string, username?: string };

    const handleNavigate = (path: string) => {
        navigate(path, { state: { stockName: stockName, username } });
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            new window.TradingView.widget({
                "autosize": true,
                "symbol": "BINANCE:BTCUSDT",
                "interval": "240",
                "timezzone": "Etc/Utc",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": true,
                "withdateranges": false,
                "hide_side_toolbar": true,
                "allow_symbol_change": true,
                "watchlist": [
                    "BINANCE:BTCUSDT",
                    "BINANCE:ETHUSDT"
                ],
                "details": true,
                "hotlist": true,
                "calendar": true,
                "studies": [
                    "STD;SMA"
                ],
                "container_id": "chart",
                "show_popup_button": true,
                "popup_width": "1000",
                "popup_height": "650"
            });
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);
    return (
        <>
            <AnimatedComponent y={-100} opacity={0} duration={0.8}>
                <Header />
            </AnimatedComponent>
            <AnimatedComponent y={0} opacity={0} duration={1.5} delay={0.6}>
                <div className="container mx-auto">
                    <div className="h-12 flex justify-center items-center">
                        {/* Buttons for navigation */}
                        <button
                            className={`link-hover-gradient px-4 py-1 rounded mr-4 ${areaMatch ? 'border-red-300 border' : ''}`}
                            onClick={() => handleNavigate(`/trade/area/${id}`)}
                        >
                            價格區
                        </button>
                        <button
                            className={`link-hover-gradient px-4 py-1 rounded mr-4 ${newsMatch ? 'border-red-300 border' : ''}`}
                            onClick={() => handleNavigate(`/trade/news/${id}`)}
                        >
                            資訊區
                        </button>
                    </div>
                    <div className="breathing-divider"></div>
                    <div className="h-[500px]">
                        {/* 左侧区块 */}
                        <div id="chart" className="w-full h-full"></div>
                        <div className="text-right mt-2">
                            <a href="https://www.tradingview.com/" className="text-blue-600 hover:text-blue-800" rel="noopener noreferrer" target="_blank">
                                Track all markets on Tradingview
                            </a>
                        </div>
                    </div>
                </div>
            </AnimatedComponent>
        </>
    );
};

export default TradeNews;
