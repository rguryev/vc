import * as yup from 'yup';

export const LoginFormSchema = yup.object().shape({
	email: yup.string().email('Неверная почта').required('Почта обязательна'),
	password: yup
		.string()
		.min(6, 'Пароль должен быть больше 6 символов')
		.required('Пароль обязателен'),
});

export const RegisterFormSchema = yup
	.object()
	.shape({
		fullName: yup.string().required('Имя и фамилия обязательны'),
	})
	.concat(LoginFormSchema);
