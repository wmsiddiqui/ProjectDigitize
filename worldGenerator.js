var Block = require('./worldGenerator/models/block');

exports.generateWorld = function() {
	var test = new Block('TestName', 10, 20, 30, 15);
	test.print();
	console.log(test.getName());
};
