function treeNode(text="", space=0, parent=null, child=null, sibling=null)
{
    this.text = text;
    this.space = space;
    this.parent = parent;
    this.child = child;
    this.sibling = sibling;
    this.addChild = function(c)
    {
        if (!c) return;
        c.parent = this;
        if(!this.child)
            this.child = c;
        else
            this.child.addSibling(c);
    }
    this.addSibling = function(s)
    {
        if (!s) return;
        s.parent = this.parent;
        if(!this.sibling)
            this.sibling = s;
        else
            this.sibling.addSibling(s);
    }
}

function treeNode(text="", space=0)
{
    this.text = text;
    this.space = space;
}