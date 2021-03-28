import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { offerReducer, handleDiffMiddleware } from "../features/offer";

export const store = configureStore({
  reducer: {
    offer: offerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(handleDiffMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
