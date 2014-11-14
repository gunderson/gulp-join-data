var _ = require("underscore");
var joinData = require("../index");


var expected = {"data0":{"name":"data0.json"},"data1":{"name":"data1.json"},"data2":{"name":"data2.json"}};
var result = joinData.processFiles([
		"./tests/data0.json",
		"./tests/data1.json",
		"./tests/data2.json"
	],
	"./tests/data.json"
)