import React from 'react';

import Header from './containers/Header';
import File from '../file';
import Chat from '../chat';

const Workspace = () => (
	<div>
		<Header />
		<article style={{display: 'flex'}}>
			<File />
			<Chat />
		</article>
	</div>
);

export default Workspace;