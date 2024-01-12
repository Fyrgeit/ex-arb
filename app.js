const gridSize = 20;

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

const rails = [
    { x: 1, y: 1, template: "S" },
    { x: 1, y: 2, template: "S" },

    { x: 2, y: 1, template: "S" },
    { x: 2, y: 2, template: "S" },

    { x: 3, y: 1, template: "Sr+", switchIndex: "A" },
    { x: 3, y: 2, template: "Sl+", switchIndex: "B" },

    { x: 4, y: 1, template: "lS+", switchIndex: "C" },
    { x: 4, y: 2, template: "rS+", switchIndex: "D" },

    { x: 5, y: 1, template: "Sl+", switchIndex: "E" },
    { x: 5, y: 2, template: "S" },

    { x: 6, y: 0, template: "lS" },
    { x: 6, y: 1, template: "S" },
    { x: 6, y: 2, template: "S" },

    { x: 7, y: 0, template: "S" },
    { x: 7, y: 1, template: "S" },
    { x: 7, y: 2, template: "S" },

    { x: 8, y: 0, template: "Sr" },
    { x: 8, y: 1, template: "Sr+", switchIndex: "F" },
    { x: 8, y: 2, template: "S" },

    { x: 9, y: 1, template: "rS+", switchIndex: "G" },
    { x: 9, y: 2, template: "rS+", switchIndex: "H" },

    { x: 10, y: 1, template: "S" },
    { x: 10, y: 2, template: "Sr" },

    { x: 11, y: 1, template: "S" },
    { x: 11, y: 3, template: "rS" },

    { x: 12, y: 1, template: "S" },
    { x: 12, y: 3, template: "S" },
];

const signals = [
    { x: 0, y: 1, type: "down", state: "red" },
    { x: 0, y: 2, type: "down", state: "red" },

    { x: 2, y: 1, type: "up", state: "red" },
    { x: 2, y: 2, type: "up", state: "red" },

    { x: 6, y: 0, type: "down", state: "red" },
    { x: 6, y: 1, type: "down", state: "red" },
    { x: 6, y: 2, type: "down", state: "red" },

    { x: 8, y: 0, type: "up", state: "red" },
    { x: 8, y: 1, type: "up", state: "red" },
    { x: 8, y: 2, type: "up", state: "red" },

    { x: 11, y: 1, type: "down", state: "red" },
    { x: 11, y: 3, type: "down", state: "red" },

    { x: 13, y: 1, type: "up", state: "red" },
    { x: 13, y: 3, type: "up", state: "red" },
]

const canvas = document.getElementById("canvas");

let playerPos = { x: 1, y: 1 };

refresh();

function refresh() {
    canvas.innerHTML = "";
    
    const maxWidth = Math.max(...rails.concat(signals).map(o => o.x)) * gridSize + gridSize;
    const maxHeight = Math.max(...rails.concat(signals).map(o => o.y)) * gridSize + gridSize;

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

    rails.forEach(railObj => {
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

    signals.forEach((signalObj, index) => {
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

    const playerEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    canvas.append(playerEl);
    playerEl.setAttribute("cx", 10 + playerPos.x * gridSize);
    playerEl.setAttribute("cy", 10 + playerPos.y * gridSize);
    playerEl.setAttribute("r", "4");
    playerEl.setAttribute("fill", "red");

    canvas.setAttribute("viewBox",
        `0 0 ${maxWidth} ${maxHeight}`
    );
}

function move(dir) {
    if (!["up", "down"].includes(dir)) {
        console.error("Invalid direction");
        return;
    }

    let ogPlayerPos = { ...playerPos };

    let fromTile = rails.find(t => t.x === playerPos.x && t.y === playerPos.y);

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

    let toSignal = signals.find(s => s.x === playerPos.x && s.y === playerPos.y);

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