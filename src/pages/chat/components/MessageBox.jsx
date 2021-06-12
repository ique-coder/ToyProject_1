import React from 'react';
import { DropdownToggle, UncontrolledDropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';

import style from './MessageBox.scss';

class MessageBox extends React.Component {
	constructor(props) {
		super(props);
		const { me, user, message, type, toUser } = this.props;
	}

	render() {
		const { me, user, message, type, toUser } = this.props;
		
		return (
			<div className={style.MessageBox}>
				{ me !== user ? <div className={style.MessageBox__user}>{user}</div> : '' }
				<div className={
					style.MessageBox__message + " " + (
						me === user ? style.MessageBox__me :
							type === 'public' ? style.MessageBox__public : style.MessageBox__private
					)
				} >
					{ type === 'public' ? message : toUser + ': ' + message }
				</div>
			</div>
		);
	}
}

export default MessageBox;