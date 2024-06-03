
import Header from '../components/Header';
import AnimatedComponent from '../components/AnimatedComponent';
import { useParams, useLocation, useNavigate, useMatch } from 'react-router-dom';
import { useEffect } from 'react';

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
                    <div className="h-[650px] grid grid-rows-2 sm:grid-cols-2">
                        <div className="">
                            {/* 柱狀圖 */}

                        </div>
                        <div className="">
                            {/* 數據 */}
                            
                        </div>
                    </div>
                </div>
            </AnimatedComponent>
        </>
    );
};

export default TradeNews;
