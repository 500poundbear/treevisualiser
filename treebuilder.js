var jsonfile = require('jsonfile');
var util = require('util');
var _ = require('underscore');
 
var file = 'output.json'
var treeNode = {};
jsonfile.readFile(file, function(err, obj) {
    buildTree(obj);

    //Clean tree
    var cleantree = cleanTree(treeNode);
    console.log(JSON.stringify(cleantree, null, 2));
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

            console.log("\n\n\ncurrentProperty: "+currentProperty);

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

            console.log("\n\nDONE\n\n");

            console.log(prevpt);
            console.log(currpt);
            while (currpt !== null && currpt.name !== currentProperty) {
                if (containsProperty(question.characteristics, currpt.name)) {
                    console.log("RIGHT");
                    //RIGHT
                    prevpt = currpt;
                    currpt = currpt.children[1];
                    console.log("prevpt has now: "+JSON.stringify(prevpt));
                    console.log("currpt has now: "+JSON.stringify(currpt));
                } else {
                    //LEFT
                    console.log("LEFT");
                    prevpt = currpt;
                    currpt = currpt.children[0];
                    console.log("prevpt has now: "+JSON.stringify(prevpt));
                    console.log("currpt has now: "+JSON.stringify(currpt));
                }
            }

            console.log("\n\nDONE\n\n");
            
            if (currpt === null) {
                console.log("prevpt: "+JSON.stringify(prevpt, 2, null));
                console.log("currpt: "+JSON.stringify(currpt, 2, null));
                var newNode = {name: '', parent: "null", children: [null, null]};
                newNode.name = currentProperty;
               
                console.log("making node with name: "+newNode.name);

                newNode.parent = prevpt.name;

                currpt = newNode;
                console.log("====");
                console.log(question.characteristics);
                console.log(prevpt.name);
                if (containsProperty(question.characteristics, prevpt.name)) {
                    console.log("connected to right of "+prevpt.name);
                    prevpt.children[1] = newNode;
                } else {
                    console.log("connected to left of "+prevpt.name);
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
        console.log("ADD LEAF");

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
