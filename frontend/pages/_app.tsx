import Head from 'next/head';

import { Header } from '../components/Header';

import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { theme } from '../theme';

import 'macro-css';
import { AppProps } from 'next/app';
import { parseCookies } from 'nookies';
import { Component } from 'react';
import { Provider } from 'react-redux';
import { setUserData } from '../redux/slices/user';
import { store, wrapper } from '../redux/store';
import '../styles/globals.scss';
import { Api } from '../utils/api';
import { UserApi } from '../utils/api/user';

function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>VC</title>
				<link rel='icon' href='/favicon.ico' />
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
				<link
					href='https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400;1,500;1,700;1,900&display=swap'
					rel='stylesheet'
				/>
			</Head>
			<MuiThemeProvider theme={theme}>
				<CssBaseline />
				<Header />
				<Component {...pageProps} />
			</MuiThemeProvider>
		</>
	);
}

// делаем связь index.js с редаксом. Берем враппер который создали, у него есть специальные методы, берем метод getServerSideProps(), это нужно для того, чтобы наш const getServerSideProps через логику wrapper.getServerSideProps() мог корректно получать данные из редакса и работать с редаксом.

App.getInitialProps = wrapper.getInitialAppProps((store) => async ({ ctx, Component }) => {
	try {
		const userData = await Api(ctx).user.getMe();

		store.dispatch(setUserData(userData));
		// по умолчанию любой getServerSideProps должен веруть props
	} catch (err) {
		if (ctx.asPath === '/write') {
			ctx.res.writeHead(302, {
				Location: '/403',
			});
			ctx.res.end();
		}
		console.log(err);
	}
	return {
		pageProps: Component.getInitialProps ? await Component.getInitialProps({ ...ctx, store }) : {},
	};
});

// оборачиваем корневое приложение в враппер (nextJS+redux)
export default wrapper.withRedux(App);
