import { useRoutes } from 'react-router-dom';
import Home from './pages/Home';
import SelectTarget from './pages/SelectTarget';
import TradeArea from './pages/TradeArea';
import TradeNews from './pages/TradeNews';
import Login from './pages/Login';
import Asset from './pages/Asset';
import PdfViewer from './pages/Pdf';
import Useradmin from './pages/Useradmin';

const App: React.FC = () => {
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: 'trade', element: <SelectTarget /> },
    { path: 'login', element: <Login /> },
    { path: 'asset', element: <Asset /> },
    { path: 'trade/area/:id', element: <TradeArea /> },
    { path: 'trade/news/:id', element: <TradeNews /> },
    { path: 'useradmin', element: <Useradmin /> },
    { path: 'pdfview', element: <PdfViewer />},
  ]);

  return routes;
};

export default App;
