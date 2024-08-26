import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from './slice/selectstockSlice'; 
import stocksPriceReducer from "./slice/stockPriceSlice";
import aiReducer from './slice/aiSlice'
import userDataReducer from './slice/userdataSlice'
import assetsReducer from './slice/assetsSlice'
import stockOperationsReducer from './slice/stockOperationsSlice'
import favoritesReducer from './slice/favoritesSlice';
import sheetDataReducer from './slice/sheetSlice';
import vipReducer from './slice/vipSlice';
import valueDataReducer from './slice/valueSlice'

export const store = configureStore({
  reducer: {
    stocks: stocksReducer, 
    stocksPrice: stocksPriceReducer,
    ai: aiReducer,
    userData: userDataReducer,
    assets: assetsReducer,
    stockOperations: stockOperationsReducer,
    favorites: favoritesReducer,
    sheetData: sheetDataReducer,
    vip: vipReducer,
    valueData: valueDataReducer,
  },
  // 如果需要添加 Redux DevTools 配置或中间件，可以在这里添加
});

// TypeScript 类型，用于更好地与组件和额外的 Redux Hooks 集成
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;