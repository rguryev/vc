import { AxiosInstance } from 'axios';
import { CreateUserDto, LoginDto, ResponseUser } from './types';

export const UserApi = (instance: AxiosInstance) => ({
	async getAll() {
		const { data } = await instance.get<ResponseUser[]>('/users');
		return data;
	},

	// делаем async потому что мы получаем с бэка данные
	async register(dto: CreateUserDto) {
		// Axios говорит что если хочешь типизировать ответ, чтобы он был таким, каким хочешь, то передай сначала в post-запросе саму post-информацию с ее типом (CreateUserDto) и передай в объекте с data ( { data: ResponseUser } ) то, что я получу в const { data }
		const { data } = await instance.post<CreateUserDto, { data: ResponseUser }>(
			'/auth/register',
			dto,
		);
		return data;
	},
	async login(dto: LoginDto) {
		const { data } = await instance.post<LoginDto, { data: ResponseUser }>('/auth/login', dto);
		return data;
	},
	async getMe() {
		const { data } = await instance.get<ResponseUser>('/users/me');
		return data;
	},
});
