import { useRoutes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SelectTarget from './pages/SelectStock';
import StockPrice from './pages/StockPrice';
import Asset from './pages/Asset';
import StockFinance from './pages/StockFinance';
import PdfViewer from './pages/Pdf';
import StockInfo from './pages/StockInfo';
import Useradmin from './pages/Useradmin';
import QuestionnaireForm from './pages/Question';
import Asset_backtrade from './pages/Asset_backtrade';

const App: React.FC = () => {
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: 'trade', element: <SelectTarget /> },
    { path: 'login', element: <Login /> },
    { path: 'asset', element: <Asset /> },
    { path: 'trade/price/:id', element: <StockPrice /> },
    { path: 'trade/info/:id', element: <StockInfo /> },
    { path: 'trade/finance/:id', element: <StockFinance /> },
    { path: 'useradmin', element: <Useradmin /> },
    { path: 'pdfview', element: <PdfViewer />},
    { path: 'question', element: <QuestionnaireForm />},
    {path: 'asset_backtrade', element: <Asset_backtrade />},
  ]);

  return routes;
};

export default App;
