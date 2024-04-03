export function generate(dropArea) {
    const commandList = dropArea.querySelectorAll('.command');
    const commandBuilder = [];
    for (const commandDom of commandList) {
        if (commandDom.tagName === "INPUT") {
            if (commandDom.value) {
                commandBuilder.push(commandDom.value);
            }
        } else {
            if (commandDom.innerText)  {
                commandBuilder.push(commandDom.innerText);
            }
        }
    }

    return commandBuilder.join('');
}