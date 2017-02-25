//下载试卷
router.get('/download/:filename', function (req, res, next) {
    let file = filePath + '/' + req.params.filename + '.docx';
    res.download(file); // Set disposition and send it.
});

//删除试卷
router.get('/paper/:id/delete', function (req, res, next) {
    Paper.findOne({_id: req.params.id}, function (err, doc) {
        if (err) {
            res.end('err', err);
            return next();
        }

        doc.remove();
        res.redirect('/paper-bank')
    })
})
//生成word

//上传图片
router.post('/upload', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.file);
    console.log(req.body);

    res.end("上传成功");
})

