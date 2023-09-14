import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { setCookie } from 'nookies';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../redux/hooks';
import { setUserData } from '../../../redux/slices/user';
import { Api } from '../../../utils/api';
import { LoginDto } from '../../../utils/api/types';
import { UserApi } from '../../../utils/api/user';
import { LoginFormSchema } from '../../../utils/validations';
import FormField from '../../FormField';

interface LoginFormProps {
	onOpenRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onOpenRegister }) => {
	const dispatch = useAppDispatch();
	// выносим ошибку логина в отдельный стейт, чтобы ошибки формы были в форме, а другие ошибки - отдельно от формы
	const [errorMessage, setErrorMessage] = React.useState('');
	const form = useForm({
		mode: 'onChange',
		resolver: yupResolver(LoginFormSchema),
	});

	const onSubmit = async (dto: LoginDto) => {
		try {
			// Функция Api - универсальная, она решает, брать куки из контекста или брать куки из document.cookie который есть в браузере. Если не передадим в Api() ctx, то он будет брать куки из браузра.
			const data = await Api().user.login(dto);
			// если ты используешь для работы с nextJS, тогда нужно передавать null (что мы и сделаем т.к в браузере хранить будем)
			setCookie(null, 'rtoken', data.token, {
				maxAge: 30 * 24 * 60 * 60,
				path: '/',
			});
			// Если все ок, затери ошибку.
			setErrorMessage('');
			// Диспатчим юзера в редакс.
			dispatch(setUserData(data));
		} catch (error) {
			console.warn('Register error', error);
			// проверяем, есть ли ошибка error.response связанная с бэком, если есть - возвращаем
			if (error.response) {
				setErrorMessage(error.response.data.message);
			}
		}
	};

	// console.log(form.formState.errors);

	return (
		<div>
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField name='email' label='Почта' />
					<FormField name='password' label='Пароль' />
					{errorMessage && (
						<Alert severity='error' className='mb-20'>
							{errorMessage}
						</Alert>
					)}
					<div className='d-flex align-center justify-between'>
						<Button
							disabled={!form.formState.isValid || form.formState.isSubmitting}
							type='submit'
							color='primary'
							variant='contained'>
							Войти
						</Button>
						<Button onClick={onOpenRegister} className='ml-10' color='primary' variant='text'>
							Регистрация
						</Button>
					</div>
				</form>
			</FormProvider>
		</div>
	);
};

export default LoginForm;
