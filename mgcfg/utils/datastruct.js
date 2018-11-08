function stack(){
    this.dataStore = []
    this.length    = 0;
    this.push   = function(element)
    {
        this.dataStore[this.length++] = element;
    }
    this.pop    = function()
    {
        return this.dataStore[--this.length];
    }
    this.isEmpty = function()
    {
        return (this.length == 0);
    }
    this.clear = function()
    {
        this.length = 0;
    }
    this.top = function()
    {
        return this.dataStore[this.length - 1];
    }
}


// TO BE STORED IN stack.dataStore
function stackData(treenode = null, index = 0)
{
    this.treenode = treenode;
    this.index = index;
}


function queue() {
    this.dataStore = [];
    this.enqueue = function (element) {
        this.dataStore.push(element)
    }
    this.dequeue = function() {
        return this.dataStore.shift();
    }
    this.front = function(){
        return this.dataStore[0];
    }
    this.back = function(){
        return this.dataStore[this.dataStore.length - 1]
    }
    this.isEmpty = function()
    {
        if (this.dataStore.length == 0) {
            return true;
        } else {
            return false;
        }
    }
}

function queueData(treenode = null, child = 0)
{
    this.treenode = treenode;
    this.child = child;
}