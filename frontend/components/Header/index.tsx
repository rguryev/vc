import { Avatar, Button, IconButton, List, ListItem, Paper } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';

import {
	ExpandMoreOutlined as ArrowBottom,
	Menu as MenuIcon,
	SmsOutlined as MessageIcon,
	NotificationsNoneOutlined as NotificationIcon,
	SearchOutlined as SearchIcon,
	AccountCircleOutlined as UserIcon,
} from '@material-ui/icons';

import { useAppSelector } from '../../redux/hooks';
import { selectUserData } from '../../redux/slices/user';
import { Api } from '../../utils/api';
import { PostItem } from '../../utils/api/types';
import AuthDialog from '../AuthDialog';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
	const userData = useAppSelector(selectUserData);
	const [authVisible, setAuthVisible] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState('');
	const [posts, setPosts] = React.useState<PostItem[]>([]);

	const openAuthDialog = () => {
		setAuthVisible(true);
	};

	const closeAuthDialog = () => {
		setAuthVisible(false);
	};

	React.useEffect(() => {
		if (authVisible && userData) {
			setAuthVisible(false);
		}
	}, [authVisible, userData]);

	const handleChangeInput = async (e) => {
		setSearchValue(e.target.value);
		try {
			const { items } = await Api().post.search({ title: e.target.value });
			setPosts(items);
		} catch (e) {
			console.warn(e);
		}
	};

	return (
		<Paper classes={{ root: styles.root }} elevation={0}>
			<div className={styles.headerBlock}>
				<IconButton>
					<MenuIcon />
				</IconButton>
				<Link href='/'>
					<a className={styles.logo}>
						<img height={50} className='mr-20' src='/static/img/vclogo.png' alt='Logo' />
					</a>
				</Link>
			</div>

			<div className={styles.searchBlock}>
				<SearchIcon />
				<input value={searchValue} onChange={handleChangeInput} placeholder='Поиск' />
				{posts.length > 0 && (
					<Paper className={styles.searchBlockPopup}>
						<List className={styles.searchBlockList}>
							{posts.map((obj) => (
								<Link key={obj.id} href={`/news/${obj.id}`}>
									<a>
										<ListItem button>{obj.title}</ListItem>
									</a>
								</Link>
							))}
						</List>
					</Paper>
				)}
				<Link href='/write'>
					<a>
						<Button variant='contained' className={styles.button}>
							Создать
						</Button>
					</a>
				</Link>
			</div>
			<div className={styles.headerBlock}>
				<IconButton>
					<MessageIcon />
				</IconButton>
				<IconButton>
					<NotificationIcon />
				</IconButton>
				{userData ? (
					<Link href='/profile/1'>
						<a className='d-flex align-center'>
							<Avatar
								className={styles.avatar}
								alt='Remy Sharp'
								src='https://leonardo.osnova.io/5ffeac9a-a0e5-5be6-98af-659bfaabd2a6/-/scale_crop/108x108/-/format/webp/'
							/>
							<ArrowBottom />
						</a>
					</Link>
				) : (
					<div className={styles.loginButton} onClick={openAuthDialog}>
						<UserIcon />
						Войти
					</div>
				)}
			</div>
			<AuthDialog onClose={closeAuthDialog} visible={authVisible} />
		</Paper>
	);
};
