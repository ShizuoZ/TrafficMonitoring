/*
    created by Yichen 'edward' on Dec.2.2016
    Here implemented a priority queue to help search best route
 */

// Node Object
function Node (data, priority){
    this.data = data;
    this.priority = priority;
}
Node.prototype.getPriority = function(){return this.priority;}
Node.prototype.getData = function(){return this.data;}
Node.prototype.toString = function(){return this.priority;}

function PriorityQueue(arr){
    this.heap = [];
    if (arr) for (i = 0; i< arr.length; i++)
        this.push(arr[i].data, arr[i].priority);
}

PriorityQueue.prototype = {
    DEFAULT_COMPARATOR: function(a,b) {
        if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        } else {
            a = a.toString();
            b = b.toString();

            if (a == b) return 0;

            return (a > b) ? 1 : -1;
        }
    },

    size: function(){
        return this.heap.length;
    },

    isEmpty: function(){
        return this.heap.length == 0;
    },

    push: function(data, priority){
        var tmpNode = new Node(data, priority);
        this.swim(this.heap.push(tmpNode) - 1);
    },

    pop: function(){
        if(this.isEmpty()) return;
        var top = this.heap[0].data;
        this.heap[0] = this.heap.pop();
        this.sink(0);
        return top;
    },

    swap: function(i,j){
        var temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    },

    swim: function(i){
        while(i > 0 && this.isLessThan(i, i >> 1)){
            this.swap(i, i >> 1);
            i = i >> 1;
        }
    },

    sink: function(i){
        while(i * 2 < this.heap.length - 1){
            var j = i * 2;
            if(j < this.heap.length && this.isLessThan(j + 1, j)) j++;
            if(this.isLessThan(i, j)) break;
            this.swap(i, j);
            i = j;
        }
    },

    isLessThan: function(i,j){
        return this.heap[i].priority < this.heap[j].priority;
    }
}

/********** test ***********/
var queue = new PriorityQueue();
queue.push({p:'two'}, 2);
queue.push({p:'three'}, 3);
queue.push({p:'five'}, 5);
queue.push({p:'1st one'}, 1);
queue.push({p:'zero'}, 0);
queue.push({p:'nine'}, 9);
queue.push({p:'2nd one'}, 1);

console.log(queue.heap.toString()); // => 0,1,1,3,2,9,5

console.log(queue.pop()); // => {p:'zero'}
console.log(queue.pop()); // => {p:'1st one'}
console.log(queue.heap.toString()); // => 1,2,9,3,5

queue.push({p:'one-half'}, 0.5);
console.log(queue.heap.toString());
