const router = require('express').Router();
const Chat = require('../../../models/chat');
const User = require('../../../models/account');
const Error = require('../util/error');

const findAllChats = async (user) => {
	const logs = [];
	
	// 자신의 아이디를 조회
	const my = await User.findOne({ id: user });
	
	// 자신이 보낸 메세지 or 귓속말로 받은 메세지만 출력
	const chats = await Chat.find().or([{ toUser: my }, { user: my }, { toUser: { $exists: false } }])
		.populate(['user', 'toUser']).sort('createAt');
	
	chats.forEach((array) => {
		const toUserId = array.toUser ? array.toUser.id : '';
		
		logs.push({
			user: array.user.id,
			toUser: toUserId,
			type: array.type,
			message: array.message
		});
	})
	
	return logs;
}

const addChat = async (req) => {
	const data = req.body;
	
	const user = await User.findOne({ id: data.user });
	data.user = user._id;
	
	if (data.toUser) {
		const toUser = await User.findOne({ id: data.toUser });
		data.toUser = toUser._id;
	}
	
	const isAdd = await Chat.create(data);
	
	return true;
}

router.get('/init', async (req, res, next) => {
	try {
		const ret = await findAllChats(req.query.username);
		res.send(ret);
	} catch (err) {
		console.error(err);
		// next(err);
	}
});

router.post('/message', async (req, res, next) => {
	try {
		const ret = await addChat(req);
		res.send(ret);
	} catch (err) {
		console.error(err);
		// next(err);
	}
})

module.exports = router;