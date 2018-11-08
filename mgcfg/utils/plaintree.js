/*show the plain text for the selected node */
plainRes = null;
start = 0; 
end = 0;
TRUNKCATED_SIZE = 6000;
SCROLL_STEP = 2000;

function showPlain(treeId, node, plainId)
{
    var treeCtrl = $("#" + treeId);

    getPlain(treeCtrl, node);

    showPlainRes(plainId);

    $("#" + plainId).scroll(function()
    {
        autoShowPlainRes(plainId);
    })

}

function getPlain(treeCtrl, node)
{
    if (!node || !treeCtrl) return;
    if (!node.nodes) plainRes = node.text;
    let s = [];
    plainRes = "";

    let i = 0;
    s.push(new stackData(node, i));
    while(s.length)
    {
        let tmp = s.shift();
        for(let j=0; j<tmp.index; j++)
        {
            plainRes += "&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        plainRes += tmp.treenode.text + "<br>";

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
    // return plainRes;
}

function showPlainRes(plainId)
{
    document.getElementById(plainId).innerHTML = plainRes.substring(0, TRUNKCATED_SIZE);
    document.getElementById(plainId).style.height = window.screen.availHeight - 310 + "px";
    end = plainRes.length > TRUNKCATED_SIZE ? TRUNKCATED_SIZE : plainRes.length;
}

function autoShowPlainRes(plainId)
{
    var scrollTop = $("#" + plainId).scrollTop();
    var scrollHeight = $("#" + plainId).prop("scrollHeight");
    var windowHeight = $("#" + plainId).height();


    if (scrollTop + windowHeight > scrollHeight-50)
    {
        end = end + SCROLL_STEP > plainRes.length ? plainRes.length : end + SCROLL_STEP;
        document.getElementById(plainId).innerHTML = plainRes.substring(start, end);
    }
    // else if(scrollTop < 50)
    // {
    //     start = start - SCROLL_STEP > 0 ? start - SCROLL_STEP : 0;
    //     end -= SCROLL_STEP;
    //     document.getElementById(plainId).innerHTML = plainRes.substring(start, end);
    // }
    // return end;

}

