
function onSearchTree(treeId, searchTxtId, resultId)
{
    var treeCtrl = $("#" + treeId);
    var txtCtrl = $("#" + searchTxtId);

    var txt = txtCtrl.val();
    if(txt == "")
    {
        alert("Search value is null. ");
        return;
    }

    if(!treeCtrl.data('treeview'))
    {
        alert("Search tree is null. ");
        return;
    }
    // var treeData = treeCtrl.data('treeview').getNode(0);
    // console.log(treeData);
    var res = getHitNodes(treeCtrl, txt);
    constructResList(resultId, res, txt, treeId);
    
}

function getHitNodes(treeCtrl, txt)
{
    var res = [];

    var nodeId = 0;
    node = treeCtrl.treeview('getNode', [nodeId, {silent: true}])
    while(node.text.indexOf)
    {

        if(-1 != node.text.indexOf(txt))
        {
            res.push(node);
        }
        node = treeCtrl.treeview('getNode', [++ nodeId, {silent: true}])
       
    }
    return res;
}

function constructResList(resultId, res, txt, treeId)
{
    var strlist = "";
    var pres = "<li onclick='onRes(" + '"' + treeId + '", '
    var mid1 = ")'><a href='#"
    var mid2 = "'>";
    var post = "</a></li>";
    strlist = "<li style='font-size: 120%'><i>" + res.length + ' match(es) "' + txt + '"</i><li>';

    if(res.length != 0)
    {
        for(let r of res)
        {
            strlist += pres + r.nodeId + mid1 + r.Id + mid2 + r.text + post;
        }
    }

    document.getElementById(resultId).innerHTML = strlist;
}

function onRes(treeId, nodeId)
{
    var treeCtrl = $("#" + treeId);

    var tmpnode = treeCtrl.treeview('getNode', [nodeId, {silent: true}]);
    console.log(nodeId);
    console.log(tmpnode);

    while(tmpnode.parentId)
    {
        tmpnode = treeCtrl.treeview('getNode', [tmpnode.parentId, {silent: true}]);
        if(!tmpnode.state.expanded)
        {
            treeCtrl.treeview('expandNode', [tmpnode, {silent: true}]);
        }
    }

    treeCtrl.treeview('selectNode', [nodeId, {silent: true}]);
}