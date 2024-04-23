const templateStrings = [
    "S",
    "lS",
    "lS+",
    "lS-",
    "rS",
    "rS+",
    "rS-",
    "Sr",
    "Sr+",
    "Sr-",
    "Sl",
    "Sl+",
    "Sl-",
] as const;

type Pos = {
    x: number;
    y: number;
};

type Template = (typeof templateStrings)[number];

type Rail = Pos & {
    template: Template;
    switchIndex?: string;
    locked?: boolean;
};

type Signal = {
    x: number;
    y: number;
    type: "down" | "up";
    state: "red" | "green";
};

type Route = {
    upPut?: boolean;
    downPut?: boolean;
    upSignals: string;
    downSignals: string;
    usedRails: Pos[];
    switchStates: Record<string, "+" | "-" | undefined>;
};

type DataObject = {
    rails: Rail[];
    signals: Signal[];
    routes: Route[];
    switches: Rail[];
};

import jsonData from "./data.json" with { type: "json" };
import templates from "./templates.json" with { type: "json" };

let data = jsonData as DataObject;

data.switches = data.rails.filter(
    (rail) => rail.switchIndex !== undefined && rail.locked !== undefined
);

for (const route of data.routes) {
    route.upPut = false;
    route.downPut = false;
}

const canvas = document.getElementById("canvas")!;
const gridSize = 20;

let trains = [
    {
        pos: { x: 1, y: 1 },
        selected: false,
    },
    {
        pos: { x: 12, y: 1 },
        selected: false,
    },
];

let selectedTrainIndex = -1;

//let routeInfoRails = [];

document.getElementById("bLeft")!.onclick = () => {
    movePlayer("down");
};
document.getElementById("bRight")!.onclick = () => {
    movePlayer("up");
};

refreshDisplay();
refreshTable();

function refreshDisplay() {
    canvas.innerHTML = "";

    //Draw grid
    const maxWidth =
        Math.max(...[...data.rails, ...data.signals].map((o) => o.x)) *
            gridSize +
        gridSize;
    const maxHeight =
        Math.max(...[...data.rails, ...data.signals].map((o) => o.y)) *
            gridSize +
        gridSize;

    let xArr = [];
    let yArr = [];

    for (let x = gridSize; x < maxWidth; x += gridSize) {
        xArr.push(x);
    }

    for (let y = gridSize; y < maxHeight; y += gridSize) {
        yArr.push(y);
    }

    const pathEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
    );
    canvas.append(pathEl);
    pathEl.classList.add("grid-line");
    pathEl.setAttribute(
        "d",
        xArr
            .map((x) => `M${x} 0 L${x} ${maxHeight}`)
            .concat(yArr.map((y) => `M0 ${y} L${maxWidth} ${y}`))
            .join(" ")
    );

    //Draw rails
    data.rails.forEach((railObj) => {
        const pathEl = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        canvas.append(pathEl);
        pathEl.classList.add("line");
        pathEl.setAttribute(
            "d",
            `M${railObj.x * gridSize} ${railObj.y * gridSize} ${
                templates[railObj.template]
            }`
        );

        //Switches
        if (!!railObj.switchIndex) {
            const switchEl = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );
            canvas.append(switchEl);
            switchEl.classList.add("switch-blob");
            switchEl.setAttribute("cx", "" + (10 + railObj.x * gridSize));
            switchEl.setAttribute("cy", "" + (10 + railObj.y * gridSize));
            switchEl.setAttribute("r", "1.5");

            switchEl.addEventListener("click", () => {
                if (railObj.locked) {
                    return;
                }

                if (railObj.template.includes("+")) {
                    railObj.template = railObj.template.replace(
                        "+",
                        "-"
                    ) as Template;
                } else {
                    railObj.template = railObj.template.replace(
                        "-",
                        "+"
                    ) as Template;
                }

                refreshDisplay();
                refreshTable();
            });

            if (railObj.locked) {
                switchEl.classList.add("locked");
            }

            const textEl = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );
            canvas.append(textEl);
            textEl.classList.add("text");
            textEl.innerHTML = railObj.switchIndex;

            const typeOffset = { x: 10, y: 7 };

            typeOffset.x -= 1.2 * railObj.switchIndex.toString().length;

            textEl.setAttribute(
                "x",
                "" + (railObj.x * gridSize + typeOffset.x)
            );
            textEl.setAttribute(
                "y",
                "" + (railObj.y * gridSize + typeOffset.y)
            );
        }
    });

    //Draw signals
    data.signals.forEach((signalObj, index) => {
        const pathEl = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        canvas.append(pathEl);
        pathEl.classList.add("signal");
        pathEl.classList.add(signalObj.state);

        const typePath = {
            up: "m2 6 l4 4 l-4 4",
            down: "m18 6 l-4 4 l4 4",
        }[signalObj.type];

        pathEl.setAttribute(
            "d",
            `M${signalObj.x * gridSize} ${signalObj.y * gridSize} ${typePath}`
        );

        pathEl.addEventListener("click", () => {
            if (signalObj.state === "green") {
                signalObj.state = "red";
            } else {
                signalObj.state = "green";
            }

            refreshDisplay();
        });

        const textEl = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );
        canvas.append(textEl);
        textEl.classList.add("text");
        textEl.innerHTML = "" + index;

        const typeOffset = {
            up: { x: 4, y: 5 },
            down: { x: 16, y: 5 },
        }[signalObj.type];

        typeOffset.x -= 1.2 * index.toString().length;

        textEl.setAttribute("x", "" + (signalObj.x * gridSize + typeOffset.x));
        textEl.setAttribute("y", "" + (signalObj.y * gridSize + typeOffset.y));
    });

    //Draw trains
    trains.forEach((train, index) => {
        const trainEl = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        canvas.append(trainEl);
        trainEl.classList.add("train");
        if (train.selected) trainEl.classList.add("selected");
        trainEl.setAttribute("trainIndex", "" + index);
        trainEl.setAttribute("x", "" + (4 + train.pos.x * gridSize));
        trainEl.setAttribute("y", "" + (7 + train.pos.y * gridSize));
        trainEl.setAttribute("width", "12");
        trainEl.setAttribute("height", "6");
        trainEl.addEventListener("click", (e) => {
            let target = e.target as Element;

            if (target.hasAttribute("trainIndex")) {
                let trainIndex = parseInt(target.getAttribute("trainIndex")!);

                if (selectedTrainIndex === trainIndex) {
                    selectedTrainIndex = -1;
                    train.selected = false;
                } else {
                    if (selectedTrainIndex !== -1) {
                        trains[selectedTrainIndex].selected = false;
                    }
                    selectedTrainIndex = trainIndex;
                    train.selected = true;
                }
            }

            refreshDisplay();
        });
    });

    //Display route
    /* routeInfoRails.forEach((railPos) => {
        const rectEl = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
        );
        canvas.append(rectEl);
        rectEl.classList.add("rectangle");
        rectEl.setAttribute("x", railPos.x * gridSize);
        rectEl.setAttribute("y", railPos.y * gridSize);
        rectEl.setAttribute("width", gridSize);
        rectEl.setAttribute("height", gridSize);
    }); */

    canvas.setAttribute("viewBox", `0 0 ${maxWidth} ${maxHeight}`);
}

function refreshTable() {
    const tableEl = document.querySelector("table")!;

    tableEl.innerHTML = `
        <tr>
            <th rowspan="4">Route</th>
            <th colspan="${data.switches.length + 1}">Switches</th>
            <th colspan="3" rowspan="2">Control</th>
        </tr>
        <tr>
            <th></th>
            <th>${data.switches
                .map((s) => s.switchIndex)
                .join("</th><th>")}</th>
        </tr>
        <tr>
            <th>Locked</th>
            <th>${data.switches
                .map((s) => (s.locked ? "🔒" : "🆓"))
                .join("</th><th>")}</th>
            <th rowspan="2">Switch</th>
            <th rowspan="2">Conflict</th>
            <th rowspan="2">Put</th>
        </tr>
        <tr>
            <th>State</th>
            <th>${data.switches
                .map((s) => s.template.slice(-1))
                .join("</th><th>")}</th>
        </tr>
    `;

    const obstructedRails = Object.values(data.routes)
        .filter((route) => route.upPut || route.downPut)
        .map((route) => route.usedRails)
        .flat();

    data.routes.forEach((route, routeIndex) => {
        const topRowEl = document.createElement("tr");
        const bottomRowEl = document.createElement("tr");
        tableEl.append(topRowEl);
        tableEl.append(bottomRowEl);

        let columns = data.switches.map((s) => ({
            requestedSwitchState: route.switchStates[s.switchIndex!]!,
            currentSwitchState: s.template.slice(-1),
            locked: s.locked,
        }));

        const switchesCorrect = isSwitchesCorrect(columns);
        const routeObstructed = isRouteObstructed(route, obstructedRails);

        topRowEl.innerHTML = `
            <td>${route.upSignals}</td>
            <td rowspan="2"></td>
            <td rowspan="2">${columns
                .map((c) => c.requestedSwitchState)
                .join('</td><td rowspan="2">')}</td>
            <td rowspan="2">${switchesCorrect ? "🟢" : "🔴"}</td>
            <td rowspan="2">${routeObstructed ? "🔴" : "🟢"}</td>
        `;

        bottomRowEl.innerHTML = `
            <td>${route.downSignals}</td>
        `;

        const topCheckEl = document.createElement("input") as HTMLInputElement;
        const bottomCheckEl = document.createElement(
            "input"
        ) as HTMLInputElement;
        topCheckEl.setAttribute("type", "checkbox");
        bottomCheckEl.setAttribute("type", "checkbox");
        topCheckEl.setAttribute("id", route.upSignals);
        bottomCheckEl.setAttribute("id", route.downSignals);
        topCheckEl.checked = !!route.upPut;
        bottomCheckEl.checked = !!route.downPut;

        if (routeObstructed) {
            topCheckEl.setAttribute("disabled", "");
            bottomCheckEl.setAttribute("disabled", "");
        }

        //When checkbox is checked or unchecked
        topCheckEl.onchange = (e) => onPut(e, "up");
        bottomCheckEl.onchange = (e) => onPut(e, "down");

        const topTdEl = document.createElement("td");
        const bottomTdEl = document.createElement("td");
        topTdEl.append(topCheckEl);
        bottomTdEl.append(bottomCheckEl);
        topRowEl.append(topTdEl);
        bottomRowEl.append(bottomTdEl);
    });
}

function onPut(e: Event, dir: "up" | "down") {
    let target = e.target! as HTMLInputElement;
    const routeIndex = data.routes.findIndex(
        (r) =>
            r.upSignals === target.getAttribute("id") ||
            r.downSignals === target.getAttribute("id")
    );

    const checked = target.checked;

    //Set and lock all switches
    Object.keys(data.routes[routeIndex].switchStates).forEach((key) => {
        let value = data.routes[routeIndex].switchStates[key]!;

        let tempSwitch = data.switches.find((s) => s.switchIndex! === key)!;
        
        if (!tempSwitch.template.includes(value)) {
            if (tempSwitch.template.includes("+")) {
                tempSwitch.template = tempSwitch.template.replace(
                    "+",
                    "-"
                ) as Template;
            } else {
                tempSwitch.template = tempSwitch.template.replace(
                    "-",
                    "+"
                ) as Template;
            }
        }

        tempSwitch.locked = checked;
    });

    if (dir == "up") {
        data.routes[routeIndex].upPut = checked;

        if (checked) {
            data.signals[
                parseInt(data.routes[routeIndex].upSignals.split(" ")[0])
            ].state = "green";
        }
    }

    if (dir == "down") {
        data.routes[routeIndex].downPut = checked;

        if (checked) {
            data.signals[
                parseInt(data.routes[routeIndex].downSignals.split(" ")[0])
            ].state = "green";
        }
    }

    refreshDisplay();
    refreshTable();
}

function isRouteObstructed(route: Route, obstructedRails: Pos[]) {
    const obstructedRailStrings = obstructedRails.map((rail) =>
        JSON.stringify(rail)
    );
    const routeRailStrings = route.usedRails.map((rail) =>
        JSON.stringify(rail)
    );

    return obstructedRailStrings.some((railString) => {
        return routeRailStrings.includes(railString);
    });
}

function isSwitchesCorrect(
    columns: {
        requestedSwitchState: "+" | "-";
        currentSwitchState: string;
        locked: boolean | undefined;
    }[]
) {
    return columns.every((c) => {
        if (c.requestedSwitchState == undefined) {
            return true;
        }

        return c.requestedSwitchState == c.currentSwitchState;
    });
}

function movePlayer(dir: "up" | "down") {
    if (selectedTrainIndex < 0) {
        console.error("No player chosen");
        return;
    }

    let playerPos = trains[selectedTrainIndex].pos;

    if (!["up", "down"].includes(dir)) {
        console.error("Invalid direction");
        return;
    }

    let ogPlayerPos = { ...playerPos };

    let fromTile = data.rails.find(
        (t) => t.x === playerPos.x && t.y === playerPos.y
    )!;

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
                default:
                    break;
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
                default:
                    break;
            }
            break;
        default:
            break;
    }

    //Passed signals that are green will be turned red again
    let toSignal = data.signals.find(
        (s) => s.x === playerPos.x && s.y === playerPos.y
    );

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
            default:
                break;
        }
    }

    //Routes will be unput when you exit them
    let fromSignalIndex = data.signals.findIndex(
        (s) => s.x === ogPlayerPos.x && s.y === ogPlayerPos.y
    );

    if (fromSignalIndex != -1) {
        if (dir == "up" && data.signals[fromSignalIndex].type == "down") {
            data.routes
                .filter(
                    (p) =>
                        p.downSignals.split(" ")[0] ==
                        fromSignalIndex.toString()
                )
                .forEach((r) => {
                    r.upPut = false;

                    //Unlock switches
                    for (const switchToLock in r.switchStates) {
                        data.switches.find(
                            (s) => s.switchIndex === switchToLock
                        )!.locked = false;
                    }
                });
        }

        if (dir == "down" && data.signals[fromSignalIndex].type == "up") {
            data.routes
                .filter(
                    (p) =>
                        p.upSignals.split(" ")[0] == fromSignalIndex.toString()
                )
                .forEach((r) => {
                    r.downPut = false;

                    //Unlock switches
                    for (const switchToLock in r.switchStates) {
                        data.switches.find(
                            (s) => s.switchIndex === switchToLock
                        )!.locked = false;
                    }
                });
        }

        refreshTable();
    }

    trains[selectedTrainIndex].pos = playerPos;

    refreshDisplay();
}