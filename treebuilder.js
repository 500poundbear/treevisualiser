var jsonfile = require('jsonfile');
var util = require('util');
 
var file = 'output.json'
var treeNode = {};
jsonfile.readFile(file, function(err, obj) {
    buildTree(obj);
    console.dir(treeNode);
});

function buildTree(obj) {
    var rootset = false;
    
    var objlength = obj.objects.length;
    for (var q = 0; q < objlength; q++) {
        var question = obj.objects[q];

        var prevpt = null;
        var currpt = treeNode;

        for (var w = 0; w < question.characteristics.length; w++) {
            var currentProperty = question.characteristics[w];

            console.log(currentProperty);

            /* Add if root is empty */
            if (!rootset) {
                var newObj = {name: '', children: [null, null]};
                newObj.name = currentProperty;
                treeNode = newObj;

                prevpt = treeNode;
                currpt = null;

                rootset = true;
                continue;
            }

            while (currpt != null && currpt.name != currentProperty) {
                
            }
        }

        console.log("ADD LEAF");
    }
}
function containsProperty(list, value) {

}
