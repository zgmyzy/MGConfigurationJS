/*show the plain text for the selected node */

TRUNKCATED_SIZE = 6000;
SCROLL_STEP = 2000;

function plainPlugin(treeId, plainId)
{

    tabPlugin.call(this, treeId, plainId);

    this.start = 0;
    this.end = 0;

    this.generateRes = function()
    {
        var resTemp = "";
        if (!this.node || !this.treeCtrl) return;

        let s = [];

        let i = 0;
        s.push(new stackData(this.node, i));
        while(s.length)
        {
            let tmp = s.shift();
            for(let j=0; j<tmp.index; j++)
            {
                resTemp += "&nbsp;&nbsp;&nbsp;&nbsp;";
            }
            resTemp += tmp.treenode.text + "<br>";

            if(tmp.treenode.tags && tmp.treenode.tags.length > 0)
            {
                //exit
                var exitNode =
                {
                    text : "exit",
                }
                s.unshift(new stackData(exitNode, tmp.index));
            }
            if(tmp.treenode.nodes)
            {
                for(let len = tmp.treenode.nodes.length; len; len--)
                {
                    s.unshift(new stackData(tmp.treenode.nodes[len-1], tmp.index + 1));
                }
            }

        }
        this.res = resTemp;
    }

    this.showRes = function()
    {
        document.getElementById(this.resId).innerHTML = this.res.substring(0, TRUNKCATED_SIZE);
        document.getElementById(this.resId).style.height = window.screen.availHeight - 310 + "px";
        this.end = this.res.length > TRUNKCATED_SIZE ? TRUNKCATED_SIZE : this.res.length;
        $("#" + this.resId).scroll(() =>
        {
            this.autoShowPlainRes();
        })
    }
}

plainPlugin.prototype.autoShowPlainRes = function(){
    var scrollTop = $("#" + this.resId).scrollTop();
    var scrollHeight = $("#" + this.resId).prop("scrollHeight");
    var windowHeight = $("#" + this.resId).height();


    if (scrollTop + windowHeight > scrollHeight-50)
    {
        this.end = this.end + SCROLL_STEP > this.res.length ? this.res.length : this.end + SCROLL_STEP;
        document.getElementById(this.resId).innerHTML = this.res.substring(this.start, this.end);
    }
};