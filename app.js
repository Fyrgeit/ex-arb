import data from "./data.json" assert {type: "json"};

data.switches = data.rails.filter(rail => rail.switchIndex);

for (const key in data.routes) {
    let route = data.routes[key];

    route.put = false;
}

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

let trains = [
    {
        pos: { x: 1, y: 1 },
    },
    {
        pos: { x: 12, y: 1 },
    },
];

let routeInfoRails = [];

document.getElementById("bLeft").onclick = () => { movePlayer("down"); };
document.getElementById("bRight").onclick = () => { movePlayer("up"); };

refreshDisplay();
refreshTable();

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
    });

    //Draw trains
    trains.forEach(train => {
        const trainEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        canvas.append(trainEl);
        trainEl.classList.add("train");
        trainEl.setAttribute("x", 4 + train.pos.x * gridSize);
        trainEl.setAttribute("y", 7 + train.pos.y * gridSize);
        trainEl.setAttribute("width", "12");
        trainEl.setAttribute("height", "6");
    });

    //Display route
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

function refreshTable() {
    const tableEl = document.querySelector("table");

    const switchSymbols = { "+": "|", "-": "/" };

    tableEl.innerHTML = `
        <tr>
            <th rowspan="4">Route</th>
            <th colspan="${data.switches.length + 1}">Switches</th>
            <th colspan="3" rowspan="2">Control</th>
        </tr>
        <tr>
            <th></th>
            <th>${data.switches.map(s => s.switchIndex).join("</th><th>")}</th>
        </tr>
        <tr>
            <th>Locked</th>
            <th>${data.switches.map(s => s.locked ? "🔒" : "🆓").join("</th><th>")}</th>
            <th rowspan="2">Switch</th>
            <th rowspan="2">Conflict</th>
            <th rowspan="2">Put</th>
        </tr>
        <tr>
            <th>State</th>
            <th>${data.switches.map(s => switchSymbols[s.template.slice(-1)]).join("</th><th>")}</th>
        </tr>
    `;

    const obstructedRails = [].concat(
        ...Object.values(data.routes)
            .filter(route => route.put)
            .map(route => route.usedRails)
    );

    data.routes.forEach((route, routeIndex) => {
        const rowEl = document.createElement("tr");
        tableEl.append(rowEl);

        let columns = data.switches.map(s => ({
            requestedSwitchState: route.switchStates[s.switchIndex],
            currentSwitchState: s.template.slice(-1),
            locked: s.locked,
        }));

        const switchesCorrect = isSwitchesCorrect(columns);
        const routeObstructed = isRouteObstructed(route, obstructedRails);

        rowEl.innerHTML = `
            <td>${route.upSignals + " / " + route.downSignals}</td>
            <td></td>
            <td>${columns.map(c => switchSymbols[c.requestedSwitchState]).join("</td><td>")}</td>
            <td>${switchesCorrect ? "🟢" : "🔴"}</td>
            <td>${routeObstructed ? "🔴" : "🟢"}</td>
        `;

        const checkEl = document.createElement("input");
        checkEl.setAttribute("type", "checkbox");
        checkEl.setAttribute("id", routeIndex);
        checkEl.checked = route.put;

        if (!switchesCorrect || routeObstructed) {
            checkEl.setAttribute("disabled", "");
        }

        checkEl.onchange = (e) => {
            for (const switchToLock in data.routes[e.target.id].switchStates) {
                data.switches.find(s => s.switchIndex === switchToLock).locked = e.target.checked;
            }

            data.routes[e.target.id].put = e.target.checked;

            refreshDisplay();
            refreshTable();
        };

        const tdEl = document.createElement("td");
        tdEl.append(checkEl);
        rowEl.append(tdEl);
    });
}

function isRouteObstructed(route, obstructedRails) {
    const obstructedRailStrings = obstructedRails.map(rail => JSON.stringify(rail));
    const routeRailStrings = route.usedRails.map(rail => JSON.stringify(rail));

    return obstructedRailStrings.some(railString => {
        return routeRailStrings.includes(railString);
    });
}

function isSwitchesCorrect(columns) {
    return columns.every(c => {
        if (c.requestedSwitchState == undefined) {
            return true;
        }

        return c.requestedSwitchState == c.currentSwitchState;
    });
}

function movePlayer(dir) {
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

    refreshDisplay();
}