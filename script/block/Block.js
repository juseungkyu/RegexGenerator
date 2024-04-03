import { convertJsonToBlock, blockBFS } from '../util/util.js';

export class Block {
    constructor({
        title, 
        prev, 
        next, 
        children, 
        type,
        value,
        style,
        isBasic,
    }) {
        this.title = title;
        this.prev = prev;
        this.next = next;
        this.children = children ?? [];
        this.value = value ?? "";
        this.type = type ?? "parent";
        this.style = style ?? "";
        this.isBasic = isBasic ?? false;

        this.block = document.createElement('div');
        this.block.classList.add('block');
        this.block.classList.add('dropable-area');
        
        this.block.addEventListener('mousedown', this.onMouseDown.bind(this));

        if (this.style) {
            this.block.classList.add(this.style);
        }

        this.render();
    }

    onMouseUp(e) {
        e.stopPropagation();
        e.preventDefault();

        this.children.push(window.app.currrentSelectBlock);
        window.app.currrentSelectBlock.block.style.left = '0px';
        window.app.currrentSelectBlock.block.style.top = '0px';
        window.app.currrentSelectBlock.block.style.position = 'relative';
        this.render();

        window.app.currrentSelectBlock = null;
    }

    onMouseDown(e) {
        e.stopPropagation();

        if (e.target.tagName === 'INPUT') {
            return;
        }

        let block = null;
        if (this.isBasic) {
            const copyedBlock = JSON.parse(JSON.stringify(this))
            block = convertJsonToBlock(copyedBlock);

            blockBFS(block, (current)=>{
                current.isBasic = false;
            });

            window.app.blockMap.dropArea.push(block);
            window.app.dropArea.appendChild(block.block);
        } else {
            block = this;
        }
        
        const rectInfo = this.block.getBoundingClientRect();
        window.app.elementMouseDownPosition = {
            x: e.clientX - rectInfo.x,
            y: e.clientY - rectInfo.y,
        };

        block.block.style.position = 'absolute';
        block.block.style.left = (e.clientX - window.app.elementMouseDownPosition.x) + 'px';
        block.block.style.top = (e.clientY - window.app.elementMouseDownPosition.y) + 'px';
        window.app.dropArea.appendChild(block.block);
        window.app.currrentSelectBlock = block;

        for (const rootBlock of window.app.blockMap.dropArea) {
            blockBFS(rootBlock, (current) => {
                if (current.children.includes(block)) {
                    current.children = current.children.filter(x=>x.block!==block.block);
                    window.app.blockMap.dropArea.push(block);
                    return true;
                }
                return false;
            });
        }
    }

    render() {
        this.block.innerHTML = `
            <div class="block-header">${this.title}</div>
            <div class="block-content">
                <pre class="command">${this.prev}</pre>
                ${
                    this.type === 'parent' 
                    ? `<div class="children-block"></div>`
                    : `<input class="command" type="text" placeholder="문자열" value="${this.value}">`
                }
                <pre class="command">${this.next}</pre>
            </div>
        `;

        const childrenBlock = this.block.querySelector('.children-block');
        if (childrenBlock) {
            for (const child of this.children) {
                console.log(child);
                childrenBlock.appendChild(child.block);
            }
        }

    }
}