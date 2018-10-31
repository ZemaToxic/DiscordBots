var StringDecoder = require('string_decoder').StringDecoder;
var http = require('https');

module.exports.parseData = function(options) {
	return webData = new Promise(function(resolve, reject) {
		
		if (options != null) {
			var dataOut;
			var req = http.request(options, function (res) {
				var decoder = new StringDecoder('utf8'); 
				var body = '';
				res.setEncoding('utf8');
	
				res.on('data', function (chunk) {
					body += decoder.write(chunk);
				});
	
				res.on('end', function () {
					dataOut = JSON.parse(body);
				});
			});
			
			req.end();
			resolve(dataOut);
		} else {
			reject('Failed');
		}
	});
};
