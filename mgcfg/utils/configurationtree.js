/*
To construct the tree
*/

//to identify whether the string is endwith specific word

LIST_LIMIT = 500;
CHUNK_SIZE = 10*1024;


String.prototype.startSpaceNum = function() {
    let nSpace = 0;
    let i = 0;
    while(i < this.length)
    {
        if(this.charAt(i++) == " ")
            nSpace++;
        else
            break;
    }
    return nSpace;
};

function concatenate(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (let arr of arrays) {
        totalLength += arr.length;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
};

function constructTree(treeId, resId, refId, file)
{

    var fr = new FileReader();
    var offset = 0;
    var remain = new Uint8Array();

    var nSpaceInit = 0;
    var bBegin = false;
    var rootnode = null;
    var data = [];

    var s = new stack();

    seek();

    fr.onload = function()
    {
        let buffer = new Uint8Array(fr.result);
        let tBegin = 0;
        buffer = concatenate(Uint8Array, remain, buffer);
        let bCon = true;

        for(let i=0; i<buffer.length; i++)
        {
            if(buffer[i] == 10 || buffer[i] == 13)
            {
                // \n=10  and \r=13
                if(i - tBegin <= 0)
                {
                    tBegin = i + 1;
                    continue;
                }
                let snippet = new TextDecoder('utf-8').decode(buffer.slice(tBegin, i));
                bCon = generateFromLine(snippet);
                if(!bCon)
                {
                    generateTree();
                    return;
                }
                tBegin = i + 1;
            }
        }
        remain = buffer.slice(tBegin, buffer.length);

        seek();
    }

    fr.onerror = function()
    {
        alert("Failed when opening the file " + files[0].name + "! ")
    }

    function seek()
    {
        if(offset >= file.size)
        {
            let snippet = new TextDecoder('utf-8').decode(remain);
            generateFromLine(snippet);
            generateTree();
            return;
        }
        let slice = file.slice(offset, offset += CHUNK_SIZE);
        fr.readAsArrayBuffer(slice);
    }

    function generateFromLine(line)
    {
        if(line != "" && line.length > nSpaceInit + 1)
        {
            if(!bBegin && !line.endsWith("exit all", line.length))
                return true;
            else if(!bBegin && line.endsWith("exit all", line.length))
            {
                bBegin = true;
                nSpaceInit = line.startSpaceNum();
            }
            else if(bBegin && line.endsWith("exit all", line.length))
                return false;

            if(line.indexOf("#") == nSpaceInit)
                return true;
            else if(-1 != line.indexOf("echo"))
                return true;
            else if(-1 != line.indexOf("exit"))
                return true;

            nSpace = line.startSpaceNum();

            var treeNode =
            {
                text : line.substring(nSpace, line.length),
                state : {
                    expanded : false,
                },
            }
            var stackNode = new stackData(treeNode, nSpace);

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
            return true;
        }
        return true;
    }

    function generateTree()
    {
        var control = $("#" + treeId);
        control.treeview(
        {
            data : data,
            showBorder : false,
            highlightSearchResults : false,
        }).on("nodeSelected", function(event, node)
        {
            showRef(treeId, node, refId);
        });

        clearDoc(resId);
        clearDoc(refId);
        document.getElementById(treeId).style.height = window.screen.availHeight - 270 + "px";
    }
}

///in the treeview, if the nodes number is too large, the expanding will be slow.
///So set LIST_LIMIT(currently 500) to optimize the tree.

function addNode(treenode, node)
{
    if(!treenode.nodes)
    {
        treenode.nodes = [];
        treenode.nodes.push(node);
        return;
    }

    let len = treenode.nodes.length;

    if(treenode.nodes[0].text != "1 ...")
    {
        if(len + 1 <= LIST_LIMIT)
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
        let len2 = treenode.nodes[len - 1].nodes.length;
        if(len2 + 1 <= LIST_LIMIT)
        {
            treenode.nodes[len - 1].nodes.push(node);
        }
        else
        {
            var newnode = {
                text : len * LIST_LIMIT + 1 + " ...", 
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

function clearDoc(id)
{
    document.getElementById(id).innerHTML = "";
}

