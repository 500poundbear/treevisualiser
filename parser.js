var jsonfile = require('jsonfile');

var fs = require('fs');
var filename = "actors";
var data = [];
var theRes = {count:0, objects: []};
// or read line by line:
var array = fs.readFileSync('./files/'+filename+'.txt').toString().split("\n");

data = array;

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
console.log("DONE");
//Do insertion sort

for (var q = 1; q< cnt; q++) {
    var curpt = q;

    while(curpt > 0 && theRes.objects[curpt].characteristics.length > theRes.objects[curpt - 1].characteristics.length) {
        var temp = theRes.objects[curpt];
        theRes.objects[curpt] = theRes.objects[curpt - 1];
        theRes.objects[curpt - 1] = temp;
        curpt--;
    }
}

jsonfile.writeFile('output.json', theRes, function(err) {});
console.log(JSON.stringify(theRes));

function read(ind) {
return data[ind];
}

