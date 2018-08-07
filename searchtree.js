
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

    var res = treeCtrl.treeview("search", [txt, {ignoreCase: true, revealResults: false}]);
    constructResList(resultId, res, txt, treeId);

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
    treeCtrl.treeview("revealNode", [nodeId, {silent: true}]);
}