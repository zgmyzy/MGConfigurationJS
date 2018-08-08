/*
show the related info for the pcc-rule in the reference tab
*/

function showRef(treeId, node, refId)
{
    if(node.text.startsWith("policy-rule-unit "))
    {
        res = getPolicyRuleUnitRef(treeId, node, refId);
    }
    // else if(node.text.startsWith("policy-rule "))
    // {
    //     getPolicyRuleRef(treeId, node, refId);
    // }


 }



function getPolicyRuleUnitRef(treeId, node, refId)
{
    var treeCtrl = $("#" + treeId);
    // node = treeCtrl.treeview("getNode", [34959, {silent: true}]);
    var res =
    {
        pru     : null,
        layer   : "",   //L3/4/7
        pr      : null,   //policy-rule
        prb     : [],   //policy-rule-base
        flow    : [],   //pru description
        aacg    : null,   //aa-charging-group
        appg    : null,   //app-group
        app     : null,   //application
        appf    : [],   //app-filter
    }

    var flowinfo = getPRUDes(node);
    res.pru = node;
    res.flow = flowinfo[0];
    res.layer = flowinfo[1];

    if("L7" == res.layer)
    {
        var aacg = flowinfo[2];
        res.aacg = getAACGOfPRU(treeCtrl, aacg);
        res.app = getAPPOfAACG(treeCtrl, res.aacg);
        res.appg = getAPPGFromAPP(treeCtrl, res.app);
        res.appf = getAPPFOfAPP(treeCtrl, res.app);
    }
    res.pr = getPROfPRU(treeCtrl, node);
    if(res.pr)
    {
        res.prb = getPRBofPR(treeCtrl, res.pr);
    }
    
    showPRUInRef(treeId, res, refId);
}

function getPROfPRU(treeCtrl, node)
{
    var prnode = treeCtrl.treeview("search", [node.text, {ignoreCase: false, revealResults: false}]);
    if(prnode.length <= 1)
        return null;
    return prnode[1];
}

function getPRBofPR(treeCtrl, node)
{
    var prbnodes = [];
    var re = new RegExp('(policy-rule ".*") policy-rule-unit .*');
    var group = node.text.match(re);
    var prname = group[1];
    var prnode = treeCtrl.treeview("search", [prname, {ignoreCase: false, revealResults: false}]);
    if(prnode.length <=1)
        return null;
    for(let n of prnode)
    {
        if(n == node)
            continue;
        pnode = treeCtrl.treeview("getParent", [n, {silent: true}]);
        prbnodes.push(pnode);
    }
    return prbnodes;
}

function getPRUDes(node)
{
    var flow = [];
    var layer = "L3/4";
    var aacg = null;
    for(let n of node.nodes)
    {
        var txt = n.text;
        if(txt.startsWith("flow-description "))
        {
            for(let m of n.nodes)
            {
                txt += " " + m.text;
                if(m.text.startsWith("match"))
                {
                    for(let l of m.nodes)
                    {
                        if(l.text.startsWith("aa-charging-group "))
                        {
                            layer = "L7";
                            aacg = l;
                        }
                        txt += " " + l.text;
                    }
                }
            }
        }
        if(txt.startsWith("qos "))
        {
            for(let m of n.nodes)
            {
                txt += " " + m.text;
            }
        }
        flow.push(txt);
    }
    return [flow, layer, aacg];
}

function getAACGOfPRU(treeCtrl, node)
{
    var cgname = node.text.substring(19, node.text.length - 1);

    var cgres = treeCtrl.treeview("search", [cgname, {ignoreCase: false, revealResults: false}]);
    for(let r of cgres)
    {
        if(r.text == 'charging-group "' + cgname + '"')
            return r;
    }
}

function getAPPGOfAACG(treeCtrl, node)
{
    return treeCtrl.treeview("getSiblings", [node, {silent: true}]);
}

function getAPPOfAACG(treeCtrl, node)
{
    return treeCtrl.treeview("getParent", [node, {silent: true}]);
}

function getAPPGFromAPP(treeCtrl, node)
{
    for(let n of node.nodes)
    {
        if(n.text.startsWith("app-group"))
            return n;
    }
}

function getAPPFOfAPP(treeCtrl, node)
{
    var appname = node.text.substring(0, node.text.length - 7);
    var appnodes = treeCtrl.treeview("search", [appname, {ignoreCase: false, revealResults: false}]);
    var entries = [];
    var entriesdes = [];

    for (let n of appnodes)
    {
        if(n != node)
        {
            entries.push(treeCtrl.treeview("getParent", [n, {silent: true}]));
        }
    }
    for (let n of entries)
    {
        txt = n.text;
        for(let m of n.nodes)
        {
            txt += " " + m.text;
        }
        entriesdes.push(txt);
    }

    return [entries, entriesdes];
}

 function showPRUInRef(treeId, res, refId)
 {
    var strHTML = "";
    var pre = "<li>"
    var post = "</li>"
    strHTML += generateLi(treeId, res.pru);
    strHTML += pre + res.layer + post;
    if(res.pr)
    {
        strHTML += generateLi(treeId, res.pr);
    }
    for(let n of res.prb)
    {
        strHTML += generateLi(treeId, n);
    }
    for(let n of res.flow)
    {
        strHTML += pre + n + post;
    }

    if("L7" == res.layer)
    {
        strHTML += generateLi(treeId, res.aacg);
        strHTML += generateLi(treeId, res.app);
        strHTML += generateLi(treeId, res.appg);
        for(var i=0; i<res.appf[0].length; i++)
        {
            strHTML += generateLi(treeId, res.appf[0][i], res.appf[1][i]);
        }
    }

    document.getElementById(refId).style.height = window.screen.availHeight - 265 + "px";
    document.getElementById(refId).innerHTML = strHTML;
 }