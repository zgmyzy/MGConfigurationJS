
function onSearchTree(treeId, searchTxtId, resultId, tabId)
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
    // document.getElementById(tabId).style.display="block"; 
    // document.getElementById("tab2").style.display="none"; 
    constructResList(resultId, res, txt, treeId);

}

function constructResList(resultId, res, txt, treeId)
{
    // var strlist = "";
    // var pres = "<li onclick='onRes(" + '"' + treeId + '", '
    // var mid1 = ")'><a href='#"
    // var mid2 = "'>";
    // var post = "</a></li>";
    strlist = "<li style='font-size: 120%'><i>" + res.length + ' match(es) "' + txt + '"</i><li>';

    if(res.length != 0)
    {
        for(let r of res)
        {
            // strlist += pres + r.nodeId + mid1 + r.Id + mid2 + r.text + post;
            strlist += generateLi(treeId, r);
        }
    }
    document.getElementById(resultId).style.height = window.screen.availHeight - 265 + "px";
    document.getElementById(resultId).innerHTML = strlist;
}

function generateLi(treeId, node, text = null)
{
    var str = "";
    var pres = "<li onclick='onRes(" + '"' + treeId + '", '
    var mid1 = ")'><a href='#"
    var mid2 = "'>";
    var post = "</a></li>";
    str = pres + node.nodeId + mid1 + node.Id + mid2 + (text ? text : node.text) + post;
    return str;
}


function onRes(treeId, nodeId)
{
    var treeCtrl = $("#" + treeId);
    treeCtrl.treeview("revealNode", [nodeId, {silent: true}]);
}