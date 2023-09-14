import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { WriteForm } from '../../components/WriteForm';
import { MainLayout } from '../../layouts/MainLayout';
import { Api } from '../../utils/api';
import { PostItem } from '../../utils/api/types';

interface WritePageProps {
	post: PostItem;
}

const WritePage: NextPage<WritePageProps> = ({ post }) => {
	return (
		<MainLayout className='main-layout-white' hideComments hideMenu>
			<WriteForm data={post} />
		</MainLayout>
	);
};

// проверяем какой id я хочу взять из статьи
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	try {
		const id = ctx.params.id;
		const post = await Api(ctx).post.getOne(+id);
		const user = await Api(ctx).user.getMe();

		// если юзер не автор и он заходит в редактирование статьи - до того, как отобразим статью, выкидываем из этой статьи
		if (post.user.id !== user.id) {
			return {
				props: {},
				redirect: {
					destination: '/',
					permanent: false,
				},
			};
		}

		// если юзер автор - возвращаем статью
		return {
			props: {
				post,
			},
		};
	} catch (err) {
		console.log('Write page', err);
		return {
			props: {},
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
};

export default WritePage;
