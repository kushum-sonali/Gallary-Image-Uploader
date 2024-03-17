import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, } from 'redux-persist';
import localStorage from 'redux-persist/es/storage';
import { setupListeners } from '@reduxjs/toolkit/query';
import userSlice from './userSlice';

const persistConfig = {
  key: 'root',
  storage: localStorage, // choose storage engine
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    user: userSlice,
  }),
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

const persistor = persistStore(store);

export { store, persistor };
