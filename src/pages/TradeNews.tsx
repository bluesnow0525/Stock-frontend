
import Header from '../components/Header';
import AnimatedComponent from '../components/AnimatedComponent';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

declare global {
    interface Window {
      TradingView: any;
    }
  }
const TradeNews: React.FC = () => {
    const { id } = useParams<{ id: string }>();
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
                        <NavLink to={`/trade/area/${id}`} className={({ isActive }) => isActive ? "link-hover-gradient px-4 py-1 border border-red-300 rounded mr-4" : "link-hover-gradient mr-4"}>
                            價格區
                        </NavLink>
                        <NavLink to={`/trade/news/${id}`} className={({ isActive }) => isActive ? "link-hover-gradient px-4 py-1 border border-red-300 rounded mr-4" : "link-hover-gradient"}>
                            新聞區
                        </NavLink>
                    </div>
                    <div className="breathing-divider"></div>
                    <div className="grid grid-cols-[5fr,3fr]">
                        <div className="h-120">
                            {/* 左侧区块 */}
                            <div id="chart" className="w-full h-full"></div>
                            <div className="text-right mt-2">
                                <a href="https://www.tradingview.com/" className="text-blue-600 hover:text-blue-800" rel="noopener noreferrer" target="_blank">
                                    Track all markets on Tradingview
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-rows-2">
                            <div className="bg-green-500 h-60">
                                {/* 右上区块 */}
                            </div>
                            <div className="bg-yellow-500 h-60">
                                {/* 右下区块 */}
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedComponent>
        </>
    );
};

export default TradeNews;
