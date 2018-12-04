//tab plugins manager


var revealedNode = null;

function onRes(treeId, nodeId)
{
    var treeCtrl = $("#" + treeId);
    if(revealedNode && revealedNode.style)
    {
        revealedNode.style.color = "#000000";
    }
    treeCtrl.treeview("revealNode", [nodeId, {silent: true}]);
    revealedNode = document.getElementById(nodeId);
    revealedNode.style.color = "OrangeRed";
}


function tabPlugin(treeId, resId)
{
    this.treeId = treeId;
    this.resId = resId;
    this.res = null;
    this.treeCtrl = $("#" + this.treeId);

    this.getNode = function(node)
    {
        this.node = node;
    }

    this.run = function()
    {
        this.generateRes();
        this.showRes()
    }

    this.generateRes = function()
    {
        this.res = null;
    }

    this.showRes = function()
    {
        this.showResult();
    }

    this.showResult = function(iniText = "")
    {
       if(!this.treeId || !this.res || !this.resId) return;
       var strHTML = iniText;
       for (let r in this.res)
       {
           //special handling
           if(r == "appf" && this.res[r] && this.res[r].length >= 1)
           {
               for(var i=0; i<this.res[r][0].length; i++)
               {
                   strHTML += this.generateLi(this.res[r][0][i], this.res[r][1][i]);
               }
           }

           //common handling
           else if(this.res[r] instanceof Array)
           {
               for(let a of this.res[r])
               {
                   strHTML += this.generateLi(a, a);
               }
           }
           else
           {
               strHTML += this.generateLi(this.res[r], this.res[r]);
           }
       }

       document.getElementById(this.resId).style.height = window.screen.availHeight - 310 + "px";
       document.getElementById(this.resId).innerHTML = strHTML;
    }

    this.generateLi = function(node, text = null)
    {
        var str = "";
        if(node && node.text && node.nodeId && node.Id)
        {
            var pres = "<li onclick='onRes(" + '"' + this.treeId + '", '
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

}