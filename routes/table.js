var express = require('express');
var router = express.Router();

router.get('*', function (req, res, next) {


	var data = {
		tables : [
			{
				id : 'table1',
				name : "gym",
				content : {
					headers : [
						"name",
						"set 1",
						"set 2",
						"set 3",
						"set 4"
					],
					rows : [
						[
							"哑铃卧推",
							"12-25lbs",
							"12-35lbs",
							"12-35lbs",
							"12-30lbs"
						],
						[
							"俯卧撑",
							12,
							12,
							10,
							10
						],
						[
							"坐姿推胸",
							12,
							12,
							12,
							10
						]
					]
				}

			}

		] 
	};

    res.render('table');
});

module.exports = router;