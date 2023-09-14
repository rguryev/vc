import { OutputData } from '@editorjs/editorjs';
import { AxiosInstance } from 'axios';
import { PostItem } from './types';
// import { PostItem } from './types';

type CreatePostDto = {
	title: string;
	body: OutputData['blocks'];
};

type SearchPostDto = {
	title?: string;
	body?: string;
	views?: 'DESC' | 'ASC';
	limit?: number;
	take?: number;
	tag?: string;
};

export const PostApi = (instance: AxiosInstance) => ({
	async getAll() {
		const { data } = await instance.get<PostItem[]>('/posts');
		return data;
	},
	async search(query: SearchPostDto) {
		const { data } = await instance.get<{ items: PostItem[]; totla: number }>('/posts/search', {
			params: query,
		});
		return data;
	},

	async getOne(id: number) {
		const { data } = await instance.get<PostItem>(`/posts/${id}`);
		return data;
	},
	async create(dto: CreatePostDto) {
		// говорим axios, чтомы ты передаешь в бэкенд объект CreatePostDto, а фронт возвращает { data: Post }
		const { data } = await instance.post<CreatePostDto, { data: PostItem }>('/posts', dto);
		return data;
	},
	// указываем id т.к меняем его после обновления
	async update(id: number, dto: CreatePostDto) {
		const { data } = await instance.patch<CreatePostDto, { data: PostItem }>(`/posts/${id}`, dto);
		return data;
	},
	// async getAll() {
	// 	const { data } = await instance.get<PostItem[]>('/posts');
	// 	return data;
	// },
	// async search(query: SearchPostDto) {
	// 	const { data } = await instance.get<{ items: PostItem[]; totla: number }>('/posts/search', {
	// 		params: query,
	// 	});
	// 	return data;
	// },
});
