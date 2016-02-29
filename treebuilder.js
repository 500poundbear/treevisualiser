var jsonfile = require('jsonfile');
var util = require('util');
var _ = require('underscore');
 
var file = 'output.json'
var treeNode = {};
jsonfile.readFile(file, function(err, obj) {
    buildTree(obj);

    //Clean tree
    var cleantree = cleanTree(treeNode);
    jsonfile.writeFile("tree.json", cleantree, function(err) {
        console.error(err); 
    });
});
function cleanTree(tree) {
    if (tree === undefined) {
        return {};
    } 
    
    if (tree.children.length === 0) {
        //LEAF NODE. IGNORE
    } 
    if (tree.children[0] === null) {
        tree.children[0] = {};
    } else {
        cleanTree(tree.children[0]);    
    }

    if (tree.children[1] === null) {
        tree.children[1] = {};
    } else {
        cleanTree(tree.children[1]);
    }
    return tree;
}

function buildTree(obj) {
    var rootset = false;
    
    var objlength = obj.objects.length;
    for (var q = 0; q < objlength; q++) {
        var question = obj.objects[q];
        console.log(question);

        var prevpt = null;
        var currpt = treeNode;

        for (var w = 0; w < question.characteristics.length; w++) {
            var currentProperty = question.characteristics[w];

            /* Add if root is empty */
            if (!rootset) {
                var newObj = {name: '', parent: "null", children: [null, null]};
                newObj.name = currentProperty;
                treeNode = newObj;

                prevpt = treeNode;
                currpt = null;

                rootset = true;
                continue;
            }


            console.log(prevpt);
            console.log(currpt);
            while (currpt !== null && currpt.name !== currentProperty) {
                if (containsProperty(question.characteristics, currpt.name)) {
                    //RIGHT
                    prevpt = currpt;
                    currpt = currpt.children[1];
                } else {
                    //LEFT
                    console.log("LEFT");
                    prevpt = currpt;
                    currpt = currpt.children[0];
                }
            }

            
            if (currpt === null) {
                var newNode = {name: '', parent: "null", children: [null, null]};
                newNode.name = currentProperty;
               

                newNode.parent = prevpt.name;

                currpt = newNode;
                if (containsProperty(question.characteristics, prevpt.name)) {
                    prevpt.children[1] = newNode;
                } else {
                    prevpt.children[0] = newNode;
                }
            }

            if (containsProperty(question.characteristics, currpt.name)) {
                prevpt = currpt;
                currpt = currpt.children[1];
            } else {
                prevpt = currpt;
                currpt = currpt.children[0];
            }

        }
        while(currpt != null) {
            prevpt = currpt;
            currpt = currpt.children[0];
        }

        var newLeaf = {name: '', parent: [], children: []};
        newLeaf.name = question.name;
        newLeaf.parent = prevpt.name;
        if (containsProperty(question.characteristics, prevpt.name)) {
            prevpt.children[1] = newLeaf;
        } else {
            prevpt.children[0] = newLeaf;
        }
    }
}
function containsProperty(list, value) {
    var res = _.find(list, function(num) {return num == value;});
    return (res === undefined || res === null) ? false : true;
}
