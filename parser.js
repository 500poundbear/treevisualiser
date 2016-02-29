var lineReader = require('line-reader');
var jsonfile = require('jsonfile');

var filename = "SmallExample";
var data = [];
var theRes = {count:0, objects: []};
// or read line by line:
lineReader.open('files/'+filename+".txt", function(err, reader) {
  if (err) throw err;
  while (reader.hasNextLine()) {
    reader.nextLine(function(err, line) {
      	console.log(line);
				data.push(line);
    });
  }
  reader.close(function(err) {
    if (err) throw err;
  });

	//Process file here
	var ptr = 0;
	var cnt = data[ptr++];
	var len = data.length;
	theRes.count = cnt;

	while(ptr < len) {
		var obj = {};
		obj.name = read(ptr++);
		obj.characteristics = [];
		var charcnt = read(ptr++);
		for (var i = 0; i < charcnt; i++) {
			obj.characteristics.push(read(ptr++));
		}
		theRes.objects.push(obj);
	}

	//Do insertion sort

	for (var q = 1; q< cnt; q++) {
		var curpt = q;

		while(theRes.objects[curpt].characteristics.length > theRes.objects[curpt - 1].characteristics.length && curpt > 0) {
			var temp = theRes.objects[curpt];
			theRes.objects[curpt] = theRes.objects[curpt - 1];
			theRes.objects[curpt - 1] = temp;
            curpt--;
		}
	}

	jsonfile.writeFile('output.json', theRes, function(err) {
	});
	console.log(JSON.stringify(theRes));
});

function read(ind) {
	return data[ind];
}
