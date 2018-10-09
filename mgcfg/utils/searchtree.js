
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
    constructResList(resultId, res, txt, treeId);

}

function constructResList(resultId, res, txt, treeId)
{
    strlist = "<li style='font-size: 120%'><i>" + res.length + ' match(es) "' + txt + '"</i><li>';
    showResult(treeId, res, resultId, strlist);
}

function onKeyDown(event, treeId, searchTxtId, resultId, tabId)
{
     var e = event || window.event || arguments.callee.caller.arguments[0];
     if(e && e.keyCode==27){ // Esc

     }
    if(e && e.keyCode==113){ // F2

     }
     if(e && e.keyCode==13){ // enter
          onSearchTree(treeId, searchTxtId, resultId, tabId);
     }
}