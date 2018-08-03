/*
To construct the tree
*/

String.prototype.endWith=function(endStr)
{
    // console.log(this.length + " " + endStr.length + " "+ this.lastIndexOf(endStr))
    var d = this.length - endStr.length - 1;
    return (d >= 0 && this.lastIndexOf(endStr) == d)
}

function constructTree(treeData)
{
    // var data = [];
    // var rootnode = {};
    // rootnode['text'] = "root";
    // rootnode["nodes"] = [];
    // var node1 = {};
    // var node2 = {};
    // node1['text'] = "node1";
    // rootnode["nodes"].push(node1);
    // node2['text'] = "node2";
    // rootnode["nodes"].push(node2);
    // data.push(rootnode);
    // return data;
    var nSpaceInit = 0;
    var bBegin = false;
    treeData.trim().split("\n").forEach(function(line, i)
    {
        if(line.length > nSpaceInit && line != "")
        {
            var pos;
            if(!bBegin && !line.endWith("exit all"))
            {
                return;
            }
            else if(!bBegin && line.endWith("exit all"))
            {
                console.log("enter");
            }

        }
        console.log("enter2");
    });
}


function treeView(treeid, data)
{
    var control = $("#" + treeid);

    console.log(data);
    control.treeview(
    {
        data : data
    }).treeview('collapseAll', {
        silent : true
    });
}

function a()
{
    var treex = "sss" ;
    treedata = constructTree(treex);
    treeView("configurationtree", treedata);
}

