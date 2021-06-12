import React from 'react';
import axios from 'axios';

import style from './style.scss';

import MessageBox from './components/MessageBox';

const socket = io.connect("https://mission-codesign--vlciz.run.goorm.io", {
	path: '/socket.io',
	transports: ['websocket'],
});

class Chat extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			user: '',
			toUser: '',
			toSocketId: '',
			type: 'public',
			message: '',
			logs: [],
			userList: []
		};
	}

	componentDidMount() {
		axios.get('/api/account/id').then(({ data }) => {
			this.setState({
				user: data
			});
			
			axios.get(`/api/chat/init?username=${this.state.user}`).then(({ data }) => {
				this.setState({ logs: data });
			});
			
			// userList에 담기 위한 요청 메세지
			socket.emit('joinChat', ({
				username: this.state.user,
			}))
		});
		
		// 유저 리스트 받기
		socket.on('getUserList', (arr) => {
			this.setState({ userList: arr });
		})
		
		// 채팅 메세지 받기
		socket.on('fromMessage', (obj) => { // 잘돼!!
			const temp = this.state.logs;
			temp.push(obj);
			
			this.setState({ logs: temp });
		})
		
	}
	
	// 메세지 변경 핸들러
	handleChangeMessage = (e) => {
		this.setState({ message: e.target.value });
	}
	
	handleSubmitPress = (e) => {
		console.log(e.key);
		if (e.key == 'Enter') {
			sendMessage();
		}
	}
	
	// 귓속말 유저 변경 핸들러
	handleChangeSelect = (e) => {
		if (this.state.userList[e.target.value].username === this.state.user) {
			alert('자신에게 귓속말을 보낼 수 없습니다.');
			e.target.value = 'default';
			return
		}
		
		if (e.target.value !== 'default') {
			const idx = e.target.value;
			
			this.setState({
				type: 'private',
				toUser: this.state.userList[idx].username,
				toSocketId: this.state.userList[idx].socketId
			});
			
		} else {
			this.setState({ type:'public', idx: 0 });
		}
	}
	
	// 메세지 보내는 이벤트
	sendMessage = () => {
		// 현재 state 객체로 저장
		const nowState = {
			user: this.state.user,
			type: this.state.type,
			message: this.state.message
		};
		
		// 만약 귓속말이면 toUser를 추가
		if (this.state.toUser) {
			nowState.toUser = this.state.toUser
		}
		
		axios.post('/api/chat/message', nowState)
			.then(() => {
			
				// 귓속말이라면
				if (this.state.toUser) {
					// socket ID 추가하여 요청 메세지 전달
					nowState.toSocketId = this.state.toSocketId;
				}
			
				// 전체메세지
				socket.emit('toMessage', nowState);
				
				// 초기화
				this.setState({ 
					toUser: '',
					type: 'public',
					message: '',
					toSocketId: ''
				});
			})
			.catch((error) => {
				console.error(error);
			})
	}

	render() {
		const logs = this.state.logs.map((chat, idx) => (
			<MessageBox 
				me={this.state.user}
				user={chat.user} 
				message={chat.message}
				type={chat.type}
				toUser={chat.toUser}
				key={idx} 
			/>
		));
		
		const userList = this.state.userList.map((user, idx) => (
			<option calssName="whisper" value={idx} key={idx}>{user.username}</option>
		));
		
		return (
			<div className={style.Chat}>
				<div className={style.Chat__chat_board}>
					{logs}
				</div>
				<div className="chat_input input-group mb-3">
					<select 
						className="whisper_box" 
						onChange={this.handleChangeSelect}
					>
						<option clssName="whisper" value="default" key="default">귓속말</option>
						{userList}
					</select>
					<input 
						type="text" 
						className="form-control" 
						placeholder="전송할 메세지를 적어주세요." 
						aria-label="Recipient's username" 
						aria-describedby="button-addon2" 
						value={this.state.message}
						onChange={this.handleChangeMessage}
						onKeyPress={this.handleSubmitPress}
					/>
					<button 
						className="btn btn-outline-success" 
						type="button" 
						id="button-addon2" 
						onClick={this.sendMessage}
					>전송</button>
				</div>
			</div>
		);
	}
}

export default Chat;