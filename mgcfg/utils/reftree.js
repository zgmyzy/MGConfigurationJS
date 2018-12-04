/*
show the related info for the clicked item in the reference tab
*/

function refPlugin(treeId, refId)
{
    tabPlugin.call(this, treeId, refId);
    
    this.generateRes = function()
    {
        this.res = null;
        if(this.node.text.startsWith("policy-rule-unit "))
        {
            this.res = this.getPolicyRuleUnitRef();
        }
        else
        {
            this.res = this.getRef();
        }

    }
}

refPlugin.prototype.getRef = function()
{
    if(!this.treeCtrl || !this.node || !this.node.text) return;
    var re = /"(.*?)"/g;
    var group = this.node.text.match(re);
    if(group)
    {
        var resTemp = [];
        for(let g of group)
        {
            var r = this.treeCtrl.treeview("search", [g, {ignoreCase: false, revealResults: false}]);
            for(let n of r)
            {
                if(resTemp.indexOf(n) == -1) resTemp.push(n);

            }
        }
        return resTemp;
    }
};

refPlugin.prototype.getPolicyRuleUnitRef = function()
{
    var resTemp =
    {
        pru     : null,
        layer   : "",   //L3/4/7
        // prb     : [],   //policy-rule-base
        flow    : [],   //pru description
        aacg    : null,   //aa-charging-group
        appg    : null,   //app-group
        app     : null,   //application
        appf    : [],   //app-filter
        pr      : null,   //policy-rule

    }

    var flowinfo = this.getPRUDes();
    if(flowinfo instanceof Array)
    {
        resTemp.pru = this.node;
        resTemp.flow = flowinfo[0];
        resTemp.layer = flowinfo[1];
    }


    if("L7" == resTemp.layer)
    {
        var aacg = flowinfo[2];
        resTemp.aacg = this.getAACGOfPRU(aacg);
        resTemp.app = this.getAPPOfAACG(resTemp.aacg);
        resTemp.appg = this.getAPPGFromAPP(resTemp.app);
        resTemp.appf = this.getAPPFOfAPP(resTemp.app);
    }
    resTemp.pr = this.getPROfPRU();
    // if(res.pr)
    // {
    //     res.prb = getPRBofPR(treeCtrl, res.pr);
    // }

    return resTemp;
}

refPlugin.prototype.getPROfPRU = function()
{
    if(!this.treeCtrl || !this.node || !this.node.text) return;
    var prnode = this.treeCtrl.treeview("search", [this.node.text, {ignoreCase: false, revealResults: false}]);
    if(prnode.length <= 1)
        return null;

    return prnode.slice(1);
}

refPlugin.prototype.getPRBofPR = function()
{
    if(!this.treeCtrl || !this.node || !this.node.text) return;
    var prbnodes = [];
    var re = new RegExp('(policy-rule ".*") policy-rule-unit .*');
    var group = this.node.text.match(re);
    var prname = group[1];
    var prnode = this.treeCtrl.treeview("search", [prname, {ignoreCase: false, revealResults: false}]);
    if(prnode.length <=1)
        return null;
    for(let n of prnode)
    {
        if(n == this.node)
            continue;
        pnode = this.treeCtrl.treeview("getParent", [n, {silent: true}]);
        prbnodes.push(pnode);
    }
    return prbnodes;
}

refPlugin.prototype.getPRUDes = function()
{
    if(!this.node || !this.node.nodes) return;
    var flow = [];
    var layer = "L3/4";
    var aacg = null;

    for(let n of this.node.nodes)
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

refPlugin.prototype.getAACGOfPRU = function(node)
{
    if(!this.treeCtrl || !node || !node.text) return;
    var cgname = node.text.substring(19, node.text.length - 1);

    var cgres = this.treeCtrl.treeview("search", [cgname, {ignoreCase: false, revealResults: false}]);
    for(let r of cgres)
    {
        if(r.text == 'charging-group "' + cgname + '"')
            return r;
    }
}

refPlugin.prototype.getAPPOfAACG = function(node)
{
    if(!this.treeCtrl || !node) return;
    return this.treeCtrl.treeview("getParent", [node, {silent: true}]);
}

refPlugin.prototype.getAPPGFromAPP = function(node)
{
    if(!this.treeCtrl || !node || !node.nodes) return;
    for(let n of node.nodes)
    {
        if(n.text.startsWith("app-group"))
            return n;
    }
}

refPlugin.prototype.getAPPFOfAPP = function(node)
{
    if(!this.treeCtrl || !node || !node.text) return;
    var appname = node.text.substring(0, node.text.length - 7);
    var appnodes = this.treeCtrl.treeview("search", [appname, {ignoreCase: false, revealResults: false}]);
    var entries = [];
    var entriesdes = [];

    for (let n of appnodes)
    {
        if(n != node)
        {
            entries.push(this.treeCtrl.treeview("getParent", [n, {silent: true}]));
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
