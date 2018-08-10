/*
show the related info for the pcc-rule in the reference tab
*/

function showRef(treeId, node, refId)
{
    var treeCtrl = $("#" + treeId);
    var res = null;
    if(node.text.startsWith("policy-rule-unit "))
    {
        res = getPolicyRuleUnitRef(treeCtrl, node);
    }
    else
    {
        res = getRef(treeCtrl, node);
    }

    showResult(treeId, res, refId);

    treeCtrl.treeview("clearSearch");

 }

 function getRef(treeCtrl, node)
 {
    if(!treeCtrl || !node || !node.text) return;
    var re = /"(.*?)"/g;
    var group = node.text.match(re);
    if(group)
    {
        var res = [];
        for(let g of group)
        {
            var r = treeCtrl.treeview("search", [g, {ignoreCase: false, revealResults: false}]);
            for(let n of r)
            {
                if(res.indexOf(n) == -1) res.push(n);

            }
        }
        return res;
    }


 }

function getPolicyRuleUnitRef(treeCtrl, node)
{
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
    if(flowinfo instanceof Array)
    {
        res.pru = node;
        res.flow = flowinfo[0];
        res.layer = flowinfo[1];
    }


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

    return res;
}

function getPROfPRU(treeCtrl, node)
{
    if(!treeCtrl || !node || !node.text) return;
    var prnode = treeCtrl.treeview("search", [node.text, {ignoreCase: false, revealResults: false}]);
    if(prnode.length <= 1)
        return null;
    return prnode[1];
}

function getPRBofPR(treeCtrl, node)
{
    if(!treeCtrl || !node || !node.text) return;
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
    if(!node || !node.nodes) return;
    var flow = [];
    var layer = "L3/4";
    var aacg = null;

    for(let n of node.nodes)
    {
        var txt = n.text;
        if(txt.startsWith("flow-description ") && n.nodes)
        {
            for(let m of n.nodes)
            {
                txt += " " + m.text;
                if(m.text.startsWith("match") && m.nodes)
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
        if(txt.startsWith("qos ") && n.nodes)
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
    if(!treeCtrl || !node || !node.text) return;
    var cgname = node.text.substring(19, node.text.length - 1);

    var cgres = treeCtrl.treeview("search", [cgname, {ignoreCase: false, revealResults: false}]);
    for(let r of cgres)
    {
        if(r.text == 'charging-group "' + cgname + '"')
            return r;
    }
}

function getAPPOfAACG(treeCtrl, node)
{
    if(!treeCtrl || !node) return;
    return treeCtrl.treeview("getParent", [node, {silent: true}]);
}

function getAPPGFromAPP(treeCtrl, node)
{
    if(!treeCtrl || !node || !node.nodes) return;
    for(let n of node.nodes)
    {
        if(n.text.startsWith("app-group"))
            return n;
    }
}

function getAPPFOfAPP(treeCtrl, node)
{
    if(!treeCtrl || !node || !node.text) return;
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

