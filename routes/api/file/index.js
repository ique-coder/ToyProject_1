const router = require('express').Router();
const multer = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs');
const rimraf = require('rimraf');

const upload = require('../../../upload');

router.post('/upload', async (req, res, next) => {
	try {
		// 파일 저장 및 압축 풀기
		upload(req, res, function(err) {
			if (err instanceof multer.MulterError) {
			  return next(err);
			} else if (err) {
			  return next(err);
			}
			
			// 압축 풀기
			const filePath = req.file.path;
			const zip = new AdmZip(filePath); // file위치로 AdmZip 오브젝트를 생성합니다.
			const target = './upload/' + req.session.user.id; // 압축이 해제될 위치를 지정합니다.
			
			// 폴더 삭제 & 생성
			rimraf.sync(target);
			zip.extractAllTo(target, true);
			
			return res.json(true);
		});
	} catch (err) {
		console.error(err);
	}
});

router.get('/contents', async (req, res, next) => {
	try {
		const { filename } = req.query;
		const contents = fs.readFileSync('./upload/' + req.session.user.id + '/' + filename ,'utf8');
		res.send(contents);
	} catch (err) {
		console.err(err);
	}
})

router.post('/contents', async (req, res, next) => {
	try {
		const {filename, contents} = req.body;
		
		fs.writeFileSync('./upload/' + req.session.user.id + '/' + filename , contents , 'utf8', (error) => { 
			console.log('write end');
		});
		
		res.send(true);
	} catch (err) {
		console.err(err);
	}
})

module.exports = router;