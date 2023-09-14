import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { setCookie } from 'nookies';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppDispatch } from '../../../redux/hooks';
import { setUserData } from '../../../redux/slices/user';
import { CreateUserDto } from '../../../utils/api/types';
import { UserApi } from '../../../utils/api/user';
import { RegisterFormSchema } from '../../../utils/validations';
import FormField from '../../FormField';

interface RegisterFormProps {
	onOpenRegister: () => void;
	onOpenLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onOpenRegister, onOpenLogin }) => {
	const dispatch = useAppDispatch();

	const [errorMessage, setErrorMessage] = React.useState('');

	const form = useForm({
		mode: 'onChange',
		resolver: yupResolver(RegisterFormSchema),
	});

	const onSubmit = async (dto: CreateUserDto) => {
		try {
			const data = await UserApi.register(dto);
			// если ты используешь для работы с nextJS, тогда нужно передавать null (что мы и сделаем т.к в браузере хранить будем)
			setCookie(null, 'authToken', data.token, {
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

	return (
		<div>
			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField name='fullName' label='Имя и фамилия' />
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
							onClick={onOpenRegister}
							type='submit'
							color='primary'
							variant='contained'>
							Зарегистрироваться
						</Button>
						<Button onClick={onOpenLogin} className='ml-10' color='primary' variant='text'>
							Войти
						</Button>
					</div>
				</form>
			</FormProvider>
		</div>
	);
};

export default RegisterForm;
