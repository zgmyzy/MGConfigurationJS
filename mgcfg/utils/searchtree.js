function searchPlugin(treeId, tabId, searchTxtId)
{
    tabPlugin.call(this, treeId, tabId);


    this.txtCtrl = $("#" + searchTxtId);

    this.generateRes = function()
    {
        this.txt = this.txtCtrl.val();
        if(this.txt == "")
        {
            alert("Search value is null. ");
            return;
        }

        if(!this.treeCtrl.data('treeview'))
        {
            alert("Search tree is null. ");
            return;
        }

        this.res = this.treeCtrl.treeview("search", [this.txt, {ignoreCase: true, revealResults: false}]);
    }

    this.showRes = function()
    {
        strlist = "<li style='font-size: 120%'><i>" + this.res.length + ' match(es) "' + this.txt + '"</i><li>';
        this.showResult(strlist);
    }

}


function onSearchTree()
{
    if(!se)
    {
        alert("Search tree is null. ");
        return;
    }

    se.run();

}


function onKeyDown(event)
{
     var e = event || window.event || arguments.callee.caller.arguments[0];
     if(e && e.keyCode==27){ // Esc

     }
    if(e && e.keyCode==113){ // F2

     }
     if(e && e.keyCode==13){ // enter
          onSearchTree();
     }
}