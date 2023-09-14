import {
	Button,
	Dialog,
	DialogContent,
	DialogContentText,
	TextField,
	Typography,
} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import React from 'react';
import styles from './AuthDialog.module.scss';
import LoginForm from './forms/Login';
import MainForm from './forms/main';
import RegisterForm from './forms/Register';

interface AuthDialogProps {
	onClose: () => void;
	visible: boolean;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ onClose, visible }) => {
	const [formType, setFormType] = React.useState<'main' | 'login' | 'register'>('main');
	return (
		<Dialog open={visible} onClose={onClose} fullWidth maxWidth='xs'>
			<DialogContent>
				<DialogContentText>
					<div className={styles.content}>
						<Typography className={styles.title}>
							{formType === 'main' ? (
								'Вход в TJ'
							) : (
								<p onClick={() => setFormType('main')} className={styles.backTitle}>
									<ArrowBackIos /> К авторизации
								</p>
							)}
						</Typography>

						{formType === 'main' && <MainForm onOpenLogin={() => setFormType('login')} />}
						{formType === 'login' && <LoginForm onOpenRegister={() => setFormType('register')} />}
						{formType === 'register' && (
							<RegisterForm
								onOpenRegister={() => setFormType('register')}
								onOpenLogin={() => setFormType('login')}
							/>
						)}
					</div>
				</DialogContentText>
			</DialogContent>
		</Dialog>
	);
};

export default AuthDialog;
