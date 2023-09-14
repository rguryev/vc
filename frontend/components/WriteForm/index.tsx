// 01. Библиотека Editor.js расчитана только под браузер (требует window), она не расчитана под ssr, поэтому мы должны выполнять импорт не сразу (т.к он тогда будет рендериться на сервере, а с задержкой). Поэтому мы из nextJS берем dynamic, она позволяет динамически подгружать какие-то компоненты/библиотеки. Импортируем Едитор и с помощью такой записи подгружаем его динамически после того, когда он будет не на сервере (ssr: false).

import { Button, Input } from '@material-ui/core';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { Api } from '../../utils/api';
import { PostItem } from '../../utils/api/types';
import styles from './WriteForm.module.scss';

const Editor = dynamic(() => import('../Editor').then((m) => m.Editor), { ssr: false });

interface WriteFormProps {
	data?: PostItem;
}

export const WriteForm: React.FC<WriteFormProps> = ({ data }) => {
	const router = useRouter();
	const [isLoading, setLoading] = React.useState(false);
	const [title, setTitle] = React.useState(data?.title || '');
	const [blocks, setBlocks] = React.useState(data?.body || []);

	const onAddPost = async () => {
		try {
			setLoading(true);
			const obj = {
				title,
				body: blocks,
			};
			// проверка, если data нет - значит создаем статью (метод create), если есть - редактируем статью (метод update)
			if (!data) {
				const post = await Api().post.create(obj);
				await router.push(`/write/${post.id}`);
			} else {
				await Api().post.update(data.id, obj);
			}
		} catch (err) {
			console.warn('Create post', err);
			alert(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<Input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				classes={{ root: styles.titleField }}
				placeholder='Заголовок'
			/>
			<div className={styles.editor}>
				<Editor initialBlocks={data?.body} onChange={(arr) => setBlocks(arr)} />
			</div>
			<Button
				disabled={isLoading || !blocks.length || !title}
				onClick={onAddPost}
				variant='contained'
				color='primary'>
				{data ? 'Сохранить' : 'Опубликовать'}
			</Button>
		</div>
	);
};
