import data from "./data.json" assert {type: "json"};
import templates from "./templates.json" assert {type: "json"};

const canvas = document.getElementById("canvas");
const form = document.querySelector("form");
const gridSize = 20;

const mouseGridPos = { x: 0, y: 0 };

canvas.addEventListener("click", (e) => {
    const template = document.querySelector("input:checked")?.value || "none";
    mouseGridPos.x = Math.floor((e.x / (canvas.width.baseVal.value / 14) * gridSize - 2) / gridSize);
    mouseGridPos.y = Math.floor((e.y / (canvas.height.baseVal.value / 4) * gridSize - 2) / gridSize);

    setRail(mouseGridPos, template)
    refreshDisplay();
})

refreshTemplates();
refreshDisplay();

function setRail(pos, template) {
    let railObj = {
        x: pos.x,
        y: pos.y,
        template: template
    };

    if (template.includes("+") || template.includes("-")) {
        railObj.switchIndex = "X";
        railObj.locked = false;
    }

    let existingRailIndex = data.rails.findIndex(r => r.x === pos.x && r.y === pos.y);

    if (existingRailIndex >= 0) {
        data.rails[existingRailIndex] = railObj;
    } else {
        data.rails.push(railObj);
    }
}

function refreshTemplates() {
    Object.keys(templates).forEach(templateKey => {
        const pEl = document.createElement("p");
        form.append(pEl);

        const radioEl = document.createElement("input");
        pEl.append(radioEl);
        radioEl.setAttribute("type", "radio");
        radioEl.setAttribute("name", "template");
        radioEl.setAttribute("id", templateKey);
        radioEl.setAttribute("value", templateKey);

        const labelEl = document.createElement("label");
        pEl.append(labelEl);
        labelEl.setAttribute("for", templateKey);

        const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        labelEl.append(svgEl);
        svgEl.classList.add("template");
        svgEl.setAttribute("height", 24);
        svgEl.setAttribute("width", 24);

        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgEl.append(pathEl);
        pathEl.classList.add("line");
        pathEl.setAttribute("d", `M2 2 ${templates[templateKey]}`);
    });
}

function refreshDisplay() {
    canvas.innerHTML = "";

    //Draw grid
    const maxWidth = Math.max(...data.rails.concat(data.signals).map(o => o.x)) * gridSize + gridSize;
    const maxHeight = Math.max(...data.rails.concat(data.signals).map(o => o.y)) * gridSize + gridSize;

    let xArr = [];
    let yArr = [];

    for (let x = gridSize; x < maxWidth; x += gridSize) {
        xArr.push(x);
    }

    for (let y = gridSize; y < maxHeight; y += gridSize) {
        yArr.push(y);
    }

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    canvas.append(pathEl);
    pathEl.classList.add("grid-line");
    pathEl.setAttribute("d", xArr.map(x => `M${x} 0 L${x} ${maxHeight}`).concat(yArr.map(y => `M0 ${y} L${maxWidth} ${y}`)).join(" "));

    //Draw rails
    data.rails.forEach(railObj => {
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        canvas.append(pathEl);
        pathEl.classList.add("line");
        pathEl.setAttribute("d", `M${railObj.x * gridSize} ${railObj.y * gridSize} ${templates[railObj.template]}`);

        //Switches
        if (railObj.template.includes("+") || railObj.template.includes("-")) {
            const switchEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            canvas.append(switchEl);
            switchEl.classList.add("switch-blob");
            switchEl.setAttribute("cx", 10 + railObj.x * gridSize);
            switchEl.setAttribute("cy", 10 + railObj.y * gridSize);
            switchEl.setAttribute("r", "1.5");

            switchEl.addEventListener("click", () => {
                if (!railObj.locked) {
                    if (railObj.template.includes("+")) {
                        railObj.template = railObj.template.replace("+", "-");
                    } else {
                        railObj.template = railObj.template.replace("-", "+");
                    }
                }

                refreshDisplay();
                refreshTable();
            });

            if (railObj.locked) {
                switchEl.classList.add("locked");
            }

            const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            canvas.append(textEl);
            textEl.classList.add("text");
            textEl.innerHTML = railObj.switchIndex;

            const typeOffset = { x: 10, y: 7 };

            typeOffset.x -= 1.2 * railObj.switchIndex.toString().length;

            textEl.setAttribute("x", railObj.x * gridSize + typeOffset.x);
            textEl.setAttribute("y", railObj.y * gridSize + typeOffset.y);
        }
    });

    //Draw signals
    /* data.signals.forEach((signalObj, index) => {
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        canvas.append(pathEl);
        pathEl.classList.add("signal");
        pathEl.classList.add(signalObj.state);

        const typePath = {
            "up": "m2 6 l4 4 l-4 4",
            "down": "m18 6 l-4 4 l4 4",
        }[signalObj.type];

        pathEl.setAttribute("d", `M${signalObj.x * gridSize} ${signalObj.y * gridSize} ${typePath}`);

        pathEl.addEventListener("click", () => {
            if (signalObj.state === "green") {
                signalObj.state = "red";
            } else {
                signalObj.state = "green";
            }

            refreshDisplay();
        });

        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        canvas.append(textEl);
        textEl.classList.add("text");
        textEl.innerHTML = index;

        const typeOffset = {
            "up": { x: 4, y: 5 },
            "down": { x: 16, y: 5 },
        }[signalObj.type];

        typeOffset.x -= 1.2 * index.toString().length;

        textEl.setAttribute("x", signalObj.x * gridSize + typeOffset.x);
        textEl.setAttribute("y", signalObj.y * gridSize + typeOffset.y);
    }); */

    const mousePosEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    canvas.append(mousePosEl);
    mousePosEl.classList.add("rectangle");
    mousePosEl.setAttribute("x", mouseGridPos.x * gridSize);
    mousePosEl.setAttribute("y", mouseGridPos.y * gridSize);
    mousePosEl.setAttribute("width", gridSize);
    mousePosEl.setAttribute("height", gridSize);

    canvas.setAttribute("viewBox",
        `0 0 ${maxWidth} ${maxHeight}`
    );
};