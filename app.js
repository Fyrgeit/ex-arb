import data from "./data.json" assert {type: "json"};

data.switches = data.rails.filter(rail => rail.switchIndex).map(r => r.switchIndex);

const templates = {
    "S": "m0 10 l20 0",

    "lS": "m0 20 l10 -10 l10 0",
    "lS+": "m0 10 l20 0 m-15 5 l-5 5",
    "lS-": "m0 20 l10 -10 l10 0 m-20 0 l3 0",

    "rS": "l10 10 l10 0",
    "rS+": "l5 5 m-5 5 l20 0",
    "rS-": "l10 10 l10 0 m-20 0 l3 0",

    "Sr": "m0 10 l10 0 l10 10",
    "Sr+": "m0 10 l20 0 m-5 5 l5 5",
    "Sr-": "m0 10 l10 0 l10 10 m-3 -10 l3 0",

    "Sl": "m0 10 l10 0 l10 -10",
    "Sl+": "m0 10 l20 0 m-5 -5 l5 -5",
    "Sl-": "m0 10 l10 0 l10 -10 m0 10 l-3 0",
};

const canvas = document.getElementById("canvas");
const gridSize = 20;

let playerPos = { x: 1, y: 1 };

let routeInfoRails = [];


const refresh = () => {
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
        
        if (railObj.template.includes("+") || railObj.template.includes("-")) {
            const switchEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            canvas.append(switchEl);
            switchEl.classList.add("switch-blob");
            switchEl.setAttribute("cx", 10 + railObj.x * gridSize);
            switchEl.setAttribute("cy", 10 + railObj.y * gridSize);
            switchEl.setAttribute("r", "2");
            switchEl.addEventListener("click", () => {
                if (railObj.template.includes("+")) {
                    railObj.template = railObj.template.replace("+", "-")
                } else {
                    railObj.template = railObj.template.replace("-", "+")
                }
                
                refresh();
            });
            
            const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            canvas.append(textEl);
            textEl.classList.add("text");
            textEl.innerHTML = railObj.switchIndex;
            
            const typeOffset = {x: 10, y: 7};
            
            typeOffset.x -= 1.2 * railObj.switchIndex.toString().length;
            
            textEl.setAttribute("x", railObj.x * gridSize + typeOffset.x);
            textEl.setAttribute("y", railObj.y * gridSize + typeOffset.y);
        }
    });
    
    //Draw signals
    data.signals.forEach((signalObj, index) => {
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
            
            refresh();
        });
        
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        canvas.append(textEl);
        textEl.classList.add("text");
        textEl.innerHTML = index;
        
        const typeOffset = {
            "up": {x: 4, y: 5},
            "down": {x: 16, y: 5},
        }[signalObj.type];
        
        typeOffset.x -= 1.2 * index.toString().length;
        
        textEl.setAttribute("x", signalObj.x * gridSize + typeOffset.x);
        textEl.setAttribute("y", signalObj.y * gridSize + typeOffset.y);
    });
    
    //Draw player
    const playerEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    canvas.append(playerEl);
    playerEl.classList.add("train");
    playerEl.setAttribute("x", 4 + playerPos.x * gridSize);
    playerEl.setAttribute("y", 7 + playerPos.y * gridSize);
    playerEl.setAttribute("width", "12");
    playerEl.setAttribute("height", "6");
    
    
    routeInfoRails.forEach(railPos => {
        const rectEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        canvas.append(rectEl);
        rectEl.classList.add("rectangle");
        rectEl.setAttribute("x", railPos.x * gridSize);
        rectEl.setAttribute("y", railPos.y * gridSize);
        rectEl.setAttribute("width", gridSize);
        rectEl.setAttribute("height", gridSize);
    });
    
    canvas.setAttribute("viewBox",
    `0 0 ${maxWidth} ${maxHeight}`
    );
};

document.getElementById("bLeft").onclick = () => { move("down"); };
document.getElementById("bRight").onclick = () => { move("up"); };

const tableEl = document.querySelector("table");

tableEl.innerHTML = `
    <tr>
        <th>Signals</th>
        <th>${data.switches.join("</th><th>")}</th>
    </tr>
`;

for (let routeKey in data.routes) {
    const route = data.routes[routeKey];
    const rowEl = document.createElement("tr");
    tableEl.append(rowEl);
    
    let newArr = [];
    data.switches.forEach(s => {
        newArr.push(route.switchStates[s]);
    });

    rowEl.innerHTML = `
        <td>${routeKey}</td>
        <td>${newArr.join("</td><td>")}</td>
    `;
};

refresh();

function move(dir) {
    if (!["up", "down"].includes(dir)) {
        console.error("Invalid direction");
        return;
    }
    
    let ogPlayerPos = { ...playerPos };
    
    let fromTile = data.rails.find(t => t.x === playerPos.x && t.y === playerPos.y);

    switch (dir) {
        case "up":
            playerPos.x++;

            switch (fromTile.template) {
                case "Sr":
                case "Sr-":
                    playerPos.y++;
                    break;
                case "Sl":
                case "Sl-":
                    playerPos.y--;
                    break;
                default: break;
            }
            break;
        case "down":
            playerPos.x--;

            switch (fromTile.template) {
                case "lS":
                case "lS-":
                    playerPos.y++;
                    break;
                case "rS":
                case "rS-":
                    playerPos.y--;
                    break;
                default: break;
            }
            break;
        default: break;
    }

    let toSignal = data.signals.find(s => s.x === playerPos.x && s.y === playerPos.y);

    if (toSignal) {
        switch (dir) {
            case "up":
                if (toSignal.type === "up") {
                    if (toSignal.state === "red") {
                        playerPos = { ...ogPlayerPos };
                    } else {
                        toSignal.state = "red";
                    }
                }
                break;
            case "down":
                if (toSignal.type === "down") {
                    if (toSignal.state === "red") {
                        playerPos = { ...ogPlayerPos };
                    } else {
                        toSignal.state = "red";
                    }
                }
                break;
            default: break;
        }
    }

    refresh();
}

document.getElementById("remove").onclick = () => {
    routeInfoRails = [];
    refresh();
};

document.getElementById("route-checker").addEventListener("submit", e => {
    e.preventDefault();

    let from = document.getElementById("from-signal").value;
    let to = document.getElementById("to-signal").value;

    const outputEl = document.getElementById("output");

    if (
        from === "" ||
        from < 0 ||
        from >= data.signals.length ||
        to === "" ||
        to < 0 ||
        to >= data.signals.length
    ) {
        outputEl.innerText = "Invalid signals";
        return;
    }
    
    let routeInfo = data.routes[from + " " + to];
    
    if (!routeInfo) {
        outputEl.innerText = "No such route exists";
        return;
    }

    routeInfoRails = routeInfo.usedRails;
    
    outputEl.innerText = JSON.stringify(routeInfo);

    refresh();
});