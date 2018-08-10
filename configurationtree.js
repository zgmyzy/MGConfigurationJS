/*
To construct the tree
*/

//to identify whether the string is endwith specific word

listLimit = 500;


String.prototype.startSpaceNum = function() {
    var nSpace = 0;
    var i = 0;
    while(i < this.length)
    {
        if(this.charAt(i) == " ")
            nSpace++;
        else
            break;
        i++;
    }
    return nSpace;
};


function constructTreeData(fileData)
{
    var nSpaceInit = 0;
    var bBegin = false;
    var rootnode = null;
    var data = [];

    var s = new stack();

    var lines = fileData.trim().split("\n");
    for(let line of lines)
    {
        if(line != "" && line.length > nSpaceInit + 1)
        {
            // console.log(line);
            // console.log(line.length);
            var pos;
            if(!bBegin && !line.endsWith("exit all", line.length-1))
            {
                continue;
            }
            else if(!bBegin && line.endsWith("exit all", line.length-1))
            {
                bBegin = true;
                nSpaceInit = line.startSpaceNum();
            }
            else if(bBegin && line.endsWith("exit all", line.length-1))
            {
                break;
            }

            if(line.indexOf("#") == nSpaceInit)
                continue;
            else if(-1 != line.indexOf("echo"))
                continue;
            else if(-1 != line.indexOf("exit"))
                continue;

            nSpace = line.startSpaceNum();

            var treeNode = {
                text : line.substring(nSpace, line.length - 1), 
                // nodes : [], 
                state : {
                    expanded : false,
                },
                // selectable: false
            }
            var stackNode = new stackData(treeNode, nSpace);

            if(s.isEmpty())
            {
                //if stack is empty, root node. so add to data. 
                treeNode.state.expanded = true;
                s.push(stackNode);
                data.push(treeNode);
            }
            else
            {
                //if stack is not empty, find the parent node
                while((!s.isEmpty()) && (s.top().space >= nSpace))
                {
                    s.pop();
                }
                if(s.isEmpty())
                {
                    treeNode.state.expanded = true;
                    s.push(stackNode);
                    data.push(treeNode);
                }
                else
                {
                    var tmpStackNode = s.top();
                    addNode(tmpStackNode.treenode, treeNode);
                    s.push(stackNode);
                }

            }
        }
    }
    // console.log(data);
    return data;
}

///in the treeview, if the nodes number is too large, the expanding will be slow. 
///So set listLimit(curently 500) to reconstruct the tree.

function addNode(treenode, node)
{
    if(!treenode.nodes)
    {
        treenode.nodes = [];
        treenode.nodes.push(node);
        return; 
    }

    var len = treenode.nodes.length;

    if(treenode.nodes[0].text != "1 ...")
    {
        if(len + 1 <= listLimit)
        {
            treenode.nodes.push(node);
        }
        else
        {
            var tmpnodes = treenode.nodes; 
            var tmpnode = {
                text : "1 ...", 
                nodes: tmpnodes, 
                state : {
                    expanded : false,
                }
            }
            treenode.nodes = [];
            treenode.nodes.push(tmpnode);
        }
    }
    else
    {
        var len2 = treenode.nodes[len - 1].nodes.length;
        if(len2 + 1 <= listLimit)
        {
            treenode.nodes[len - 1].nodes.push(node);
        }
        else
        {
            var newnode = {
                text : len * listLimit + 1 + " ...", 
                nodes: [], 
                state : {
                    expanded : false,
                }
            }
            newnode.nodes.push(node);
            treenode.nodes.push(newnode);
        }
    }

}

function treeView(treeid, data, resid, refid)
{
    var control = $("#" + treeid);
    document.getElementById(treeid).style.height = window.screen.availHeight - 225 + "px";

    var treedata = constructTreeData(data);

    control.treeview(
    {
        data : treedata,
        showBorder : false,
    }).on("nodeSelected", function(event, node)
    {
        showRef(treeid, node, refid);
    });

    clearDoc(resid);
    clearDoc(refid)
}

function clearDoc(id)
{
    document.getElementById(id).innerHTML = "";
}

