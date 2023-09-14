import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import { userReducer } from './slices/user';

export function makeStore() {
	return configureStore({
		reducer: {
			user: userReducer,
		},
	});
}

export const store = makeStore();

// Связываем nextjs редакс с редаксом на клиенте
export type RootStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<RootStore['getState']>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;

// Пишем враппер - прослойка чтобы использовать для работы с nextjs
export const wrapper = createWrapper<RootStore>(makeStore, { debug: true });
