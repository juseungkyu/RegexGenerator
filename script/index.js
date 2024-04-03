import { generate } from "./util/generator.js";
import { convertJsonToBlock, blockBFS, blockDFS, checkContainMouseInBlock, checkContainMouseInElement } from './util/util.js';

window.addEventListener('load', async ()=>{
    window.app = {};

    const dropArea = document.querySelector('#drop-area');
    const output = document.querySelector('#output');
    const blockList = document.querySelector('#block-list');

    window.app.dropArea = dropArea;
    window.app.output = output;
    window.app.blockList = blockList;
    window.app.blockMap = {};
    window.app.blockMap.blockList = [];
    window.app.blockMap.dropArea = [];
    window.app.currrentSelectBlock = null;
    window.app.elementMouseDownPosition = {x:0, y:0};

    await loadBasicBlock();
    for (const block of window.app.blockMap.blockList) {
        window.app.blockList.appendChild(block.block);
    }

    window.addEventListener('mousemove', (e) => {
        if (window.app.currrentSelectBlock === null) {
            return;
        }
        drag(e, window.app.currrentSelectBlock);
    })
    window.addEventListener('mouseup', (e) => {
        if (window.app.currrentSelectBlock === null) {
            return;
        }
        dragStop();
    })
    window.addEventListener('mouseleave', (e) => {
        if (window.app.currrentSelectBlock === null) {
            return;
        }
        dragStop();
    })
    document.querySelector('#generate').addEventListener('click', ()=>{
        output.innerText = generate(window.app.dropArea);
    });
    dropArea.addEventListener('mouseup', (e) => {
        if (window.app.currrentSelectBlock === null) {
            return;
        }
        drop(e);
    });
});

function reRender() {
    for (const rootBlock of window.app.blockMap.dropArea) {
        blockBFS(rootBlock, (current)=>{
            current.render();
        });
    }
}

function drop(e) {
    console.log(checkContainMouseInElement(document.querySelector('#trash')));

    if (checkContainMouseInElement(document.querySelector('#trash'), e.clientX, e.clientY)) {
        remove();
        return;
    }

    let mostDeepBlock = null;

    for (const rootBlock of window.app.blockMap.dropArea) {
        if (rootBlock.type === 'parent' && rootBlock !== window.app.currrentSelectBlock && checkContainMouseInBlock(rootBlock, e.clientX, e.clientY)) {
            mostDeepBlock = rootBlock;

            blockDFS(rootBlock, (current, index, list) => {
                if (
                    current.type === 'parent',
                    current !== window.app.currrentSelectBlock && 
                    checkContainMouseInBlock(current, e.clientX, e.clientY)
                ) {
                    mostDeepBlock = current;
                }
            });

            break;
        }
    }

    if (mostDeepBlock) {
        window.app.blockMap.dropArea = window.app.blockMap.dropArea.filter(x=>x!==window.app.currrentSelectBlock);
        mostDeepBlock.onMouseUp(e);
    }

    console.log(window.app.blockMap.dropArea);
}

function remove() {
    window.app.currrentSelectBlock.block.remove();

    for (let i = window.app.blockMap.dropArea.length - 1; i > -1 ; i--) {
        const block = window.app.blockMap.dropArea[i];
        if (block === window.app.currrentSelectBlock) {
            window.app.blockMap.dropArea.splice(i, 1);
            break;
        }
        blockDFS(block, (current, index, list)=>{
            if (current === window.app.currrentSelectBlock) {
                list.splice(index, 1);
            }
        });
    }

    window.app.currrentSelectBlock = null;
    reRender();
}

function drag(event, block) {
    console.log(event.clientX, window.app.elementMouseDownPosition.x);
    block.block.style.left = (event.clientX - window.app.elementMouseDownPosition.x) + 'px';
    block.block.style.top = (event.clientY - window.app.elementMouseDownPosition.y) + 'px';
}

function dragStop() {
    window.app.currrentSelectBlock.block.style.left = '0px';
    window.app.currrentSelectBlock.block.style.top = '0px';
    window.app.currrentSelectBlock.block.style.position = 'relative';
    window.app.currrentSelectBlock = null;
}

async function loadBasicBlock () {
    const json = await(await fetch("./basicBlock.json", {method: 'GET'})).json();
    for (const obj of json) {
        window.app.blockMap.blockList.push(convertJsonToBlock(obj));
    }
    for(const block of window.app.blockMap.blockList) {
        blockBFS(block, (current)=>{
            current.isBasic = true;
        });
    }
}
