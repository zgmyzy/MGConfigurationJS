/*
generate the Li tag and click event for the tab.
*/


function generateLi(treeId, node, text = null)
{
    var str = "";
    if(node && node.text && node.nodeId && node.Id)
    {
        var pres = "<li onclick='onRes(" + '"' + treeId + '", '
        var mid1 = ")'><a href='#"
        var mid2 = "'>";
        var post = "</a></li>";
        str = pres + node.nodeId + mid1 + node.Id + mid2 + (typeof text == "string" ? text : node.text) + post;
    }
    else if(typeof text == "string")
    {
        var pres = "<li>"
        var post = "</li>"
        str = pres + text + post;
    }

    return str;
}

 function showResult(treeId, res, resId, iniText = "")
 {
    if(!treeId || !res || !resId) return;
    var strHTML = iniText;
    for (let r in res)
    {
        //special handling
        if(r == "appf" && res[r].length >= 1)
        {
            for(var i=0; i<res[r][0].length; i++)
            {
                strHTML += generateLi(treeId, res[r][0][i], res[r][1][i]);
            }
        }

        //common handling
        else if(res[r] instanceof Array)
        {
            for(let a of res[r])
            {
                strHTML += generateLi(treeId, a, a);
            }
        }
        else
        {
            strHTML += generateLi(treeId, res[r], res[r]);
        }
    }

    document.getElementById(resId).style.height = window.screen.availHeight - 265 + "px";
    document.getElementById(resId).innerHTML = strHTML;
 }


function onRes(treeId, nodeId)
{
    var treeCtrl = $("#" + treeId);
    treeCtrl.treeview("revealNode", [nodeId, {silent: true}]);
}