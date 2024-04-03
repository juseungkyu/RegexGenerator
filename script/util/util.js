import { Block } from "../block/Block.js";

export function convertJsonToBlock(obj) {
    return new Block( {
        title: obj.title,
        prev: obj.prev,
        next: obj.next,
        children: obj.children.map(child => convertJsonToBlock(child)),
        type: obj.type,
        value: obj.value,
        style: obj.style,
        isBasic: false,
    })
}

export function blockBFS(block, func) {
    const queue = [block];
    while (queue.length !== 0) {
        const current = queue.shift();
        if (func(current)) {
            return true;
        }
        queue.push(...current.children);
    }
}

export function blockDFS(block, func) {
    for (let i = block.children.length - 1; i > -1 ; i--) {
        func(block.children[i], i, block.children);
        blockDFS(block.children[i], func);
    }
}

export function checkContainMouseInBlock(block, x, y) {
    return checkContainMouseInElement(block.block, x, y);
}

export function checkContainMouseInElement(element, x, y) {
    let result = false;

    const rectInfo = element.getBoundingClientRect();
    if (
        rectInfo.top <= y && rectInfo.bottom >= y &&
        rectInfo.left <= x && rectInfo.right >= x
    ) {
        result = true;
    }

    return result;
}