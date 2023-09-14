import { NextPage } from 'next';
import { Post } from '../components/Post';
import { MainLayout } from '../layouts/MainLayout';
import { Api } from '../utils/api';
import { PostItem } from '../utils/api/types';

interface HomeProps {
	posts: PostItem[];
}

const Home: NextPage<HomeProps> = ({ posts }) => {
	// console.log(posts);
	return (
		<MainLayout>
			{posts.map((obj) => (
				<Post key={obj.id} id={obj.id} title={obj.title} description={obj.description} />
			))}
			{/* <Post key='1' id={2} title='Cnfnmz' description='fgd' /> */}
		</MainLayout>
	);
};

// возвращаем все посты
// враппер не делаем т.к проверка на авторизацию не нужна
export const getServerSideProps = async (ctx) => {
	try {
		// не передаем контекст т.к куки не нужны тут
		const posts = await Api().post.getAll();
		return {
			props: {
				posts,
			},
		};
	} catch (err) {
		console.log(err);
	}
	// getServerSideProps всегда должен возвращать пропс

	return {
		props: {
			// в nextJS нельзя в пропсы передавать undefined, надо передавать null, иначе ошибка будет
			posts: null,
		},
	};
};

export default Home;
