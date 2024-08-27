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
  ]);

  return routes;
};

export default App;
