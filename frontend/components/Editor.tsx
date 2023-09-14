import EditorJS, { OutputData } from '@editorjs/editorjs';
import React from 'react';

interface EditorProps {
	onChange: (blocks: OutputData['blocks']) => void;
	initialBlocks?: OutputData['blocks'];
}

// 02. Выносим Едитор в отдельную компоненту чтобы его динамически подгружать с задержкой, чтобы он загружался не на сервере (ssr), а в браузере на клиенте.
export const Editor: React.FC<EditorProps> = ({ onChange, initialBlocks }) => {
	React.useEffect(() => {
		// эта настоящая компонента для загрузки на клиенте
		const editor = new EditorJS({
			holder: 'editor',
			data: {
				blocks: initialBlocks,
			},
			placeholder: 'Введите текст вашей статьи',
			async onChange() {
				const { blocks } = await editor.save();
				onChange(blocks);
			},
		});

		// чистим мусор после создания
		return () => {
			editor.isReady
				.then(() => {
					editor.destroy();
				})
				.catch((e) => console.error('ERROR editor cleanup', e));
		};
	}, []);

	// возвращается фейковая пустой компонент чтоб он отрендерился на сервере.
	return <div id='editor' />;
};
