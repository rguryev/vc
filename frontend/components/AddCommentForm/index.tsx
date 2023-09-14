import { Button } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import { is } from 'immer/dist/internal';
import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectUserData } from '../../redux/slices/user';
import { Api } from '../../utils/api';
import { CommentItem } from '../../utils/api/types';
import styles from './AddCommentForm.module.scss';

interface AddCommentFormProps {
	postId: number;
	onSuccessAdd: (obj: CommentItem) => void;
}

export const AddCommentForm: React.FC<AddCommentFormProps> = ({ postId, onSuccessAdd }) => {
	const isAuth = useAppSelector(selectUserData);
	const [clicked, setClicked] = React.useState(false);
	const [isLoading, setLoading] = React.useState(false);
	const [text, setText] = React.useState('');

	const onAddComment = async () => {
		try {
			setLoading(true);
			const comment = await Api().comment.create({ postId, text });
			onSuccessAdd(comment);
			setClicked(false);
			setText('');
		} catch (error) {
			console.warn('Add comment', error);
			alert('Ошибка при отправке комментария');
		} finally {
			setLoading(false);
		}
	};

	if (!isAuth) {
		return null;
	}

	return (
		<div className={styles.form}>
			<Input
				disabled={isLoading}
				onChange={(e) => setText(e.target.value)}
				value={text}
				onFocus={() => setClicked(true)}
				minRows={clicked ? 5 : 1}
				classes={{ root: styles.fieldRoot }}
				placeholder='Написать комментарий...'
				fullWidth
				multiline
			/>
			{clicked && (
				<Button
					disabled={isLoading}
					onClick={onAddComment}
					className={styles.addButton}
					variant='contained'
					color='primary'>
					Опубликовать
				</Button>
			)}
		</div>
	);
};
