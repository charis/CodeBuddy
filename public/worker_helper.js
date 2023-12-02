// ----------------------------------------- //
//         C   L   A   S   S   E   S         //
// ----------------------------------------- //
class LinkedList {
    value;
    next;

    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

// ----------------------------------------- //
//     F   U   N   C   T   I   O   N   S     //
// ----------------------------------------- //
function createLinkedList(values) {
    const head = new LinkedList(values[0]);
    let current = head;
    for (let i = 1; i < values.length; i++) {
        const node = new LinkedList(values[i]);
        current.next = node;
        current = node;
    }
    return head;
}

function getListValues(head) {
    const values = [];
    let current = head;
    while (current !== null) {
        values.push(current.value);
        current = current.next;
    }
    return values;
}