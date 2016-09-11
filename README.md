<h1>接口文档</h1>
<h3>1. 注册用户</h3>
	post /api/register
	{
		"username":"xiaohui1",
		"password":"123456"
	}
注册成功返回

		status:200
	{
		"username":"xiaohui1",
		"password":"***"
	}
	
<h3>2. 用户登陆</h3>
	post /api/login
	{
		"username":"xiaohui1",
		"password":"123456"
	}
成功登陆后返回

		status:200
	[
		{
			"_id": "57d4a1940ba293301761bad6",
			"username": "xiaohui1",
			"password":"e10adc3949ba59abbe56e057f20f883e",
			"__v": 0
		}
	]
<h3>3. 修改密码</h3>
	post /api/:id/set-password
	{
		"oldPassword":"123456",
		"newPassword":"qwertyu"
	}
修改成功返回

		status:200
	{
		"message": "change password success"
	}
<h3>4. 新增题目</h3>
	post /api/bank/:user_id/create
	{
		"type": "选择题",
		"subject": "物理",
		"isOption": true,
		"question": "为什么清婉",
		"options": "A.B.C.D",
		"answer": "A",
		"level":2

	}
成功返回

		status:200
	{
		message": "success"
	}
<h3>5. 查询题库</h3>
	get /api/bank/:user_id/list

<br>

	［
		{
		"_id": "57d3ddf3924fa52e1983d924",
		"user_id": "57d2d2398ee92f26da30a487",
		"type": "选择",
		"subject": "物理",
		"isOption": true,
		"question": "抛物线",
		"options": "A.B.C.D",
		"answer": "A",
		"level": 2,
		"__v": 0
		},
		{
		"_id": "57d3de499f35fc2e261c6640",
		"user_id": "57d2d2398ee92f26da30a487",
		"type": "简答",
		"subject": "物理",
		"isOption": false,
		"question": "解释力的相互作用",
		"options": "",
		"answer": "....",
		"level": 1,
		"__v": 0
		}
	］

<h3>6. 修改题目</h3>
	post /api/bank/:id/update

	{,
		"question": "题库",
		"answer": "...",
		"level":10

	}
修改成功返回

		status:200
	{
		"message": "update success"
	}
<h3>7. 删除题目</h3>
	get /api/bank/:id/delete
<br>

	{
		"message": "delete success"
	}