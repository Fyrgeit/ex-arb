const canvas = document.getElementById("canvas");

const gridSize = 66;

const templates = {
    "S": [
        { x1: 1, y1: 12, x2: 23, y2: 12 }
    ],
    "lS": [
        { x1: 1, y1: 23, x2: 12, y2: 12 },
        { x1: 12, y1: 12, x2: 23, y2: 12 }
    ],
    "lS+": [
        { x1: 1, y1: 12, x2: 23, y2: 12 },
        { x1: 1, y1: 23, x2: 8, y2: 16 }
    ],
    "lS-": [
        { x1: 1, y1: 12, x2: 6, y2: 12 },
        { x1: 12, y1: 12, x2: 23, y2: 12 },
        { x1: 1, y1: 23, x2: 12, y2: 12 }
    ],
    "rS": [
        { x1: 1, y1: 1, x2: 12, y2: 12 },
        { x1: 12, y1: 12, x2: 23, y2: 12 }
    ],
    "rS+": [
        { x1: 1, y1: 12, x2: 23, y2: 12 },
        { x1: 1, y1: 1, x2: 8, y2: 8 }
    ],
    "rS-": [
        { x1: 1, y1: 12, x2: 6, y2: 12 },
        { x1: 12, y1: 12, x2: 23, y2: 12 },
        { x1: 1, y1: 1, x2: 12, y2: 12 }
    ],
    "Sr": [
        { x1: 1, y1: 12, x2: 12, y2: 12 },
        { x1: 12, y1: 12, x2: 23, y2: 23 }
    ],
    "Sr+": [
        { x1: 1, y1: 12, x2: 23, y2: 12 },
        { x1: 16, y1: 16, x2: 23, y2: 23 }
    ],
    "Sr-": [
        { x1: 1, y1: 12, x2: 12, y2: 12 },
        { x1: 18, y1: 12, x2: 23, y2: 12 },
        { x1: 12, y1: 12, x2: 23, y2: 23 }
    ],
    "Sl": [
        { x1: 1, y1: 12, x2: 12, y2: 12 },
        { x1: 12, y1: 12, x2: 23, y2: 1 }
    ],
    "Sl+": [
        { x1: 1, y1: 12, x2: 23, y2: 12 },
        { x1: 16, y1: 8, x2: 23, y2: 1 }
    ],
    "Sl-": [
        { x1: 1, y1: 12, x2: 12, y2: 12 },
        { x1: 18, y1: 12, x2: 23, y2: 12 },
        { x1: 12, y1: 12, x2: 23, y2: 1 }
    ],
    "Se": [
        { x1: 1, y1: 12, x2: 12, y2: 12 },
    ],
    "eS": [
        { x1: 12, y1: 12, x2: 23, y2: 12 },
    ],
};

const tiles = [
    { x: 0, y: 1, template: "eS", downSignal: "red", upSignal: "red" },
    { x: 0, y: 2, template: "eS", downSignal: "red", upSignal: "red" },

    { x: 1, y: 1, template: "S" },
    { x: 1, y: 2, template: "S" },
    
    { x: 2, y: 1, template: "S" },
    { x: 2, y: 2, template: "S" },
    
    { x: 3, y: 1, template: "Sr+" },
    { x: 3, y: 2, template: "Sl+" },
    
    { x: 4, y: 1, template: "lS+" },
    { x: 4, y: 2, template: "rS+" },

    { x: 5, y: 1, template: "Sl+" },
    { x: 5, y: 2, template: "S" },
    
    { x: 6, y: 0, template: "lS", downSignal: "red" },
    { x: 6, y: 1, template: "S", downSignal: "red" },
    { x: 6, y: 2, template: "S", downSignal: "red" },

    { x: 7, y: 0, template: "S" },
    { x: 7, y: 1, template: "S" },
    { x: 7, y: 2, template: "S" },

    { x: 8, y: 0, template: "S", upSignal: "red" },
    { x: 8, y: 1, template: "S", upSignal: "red" },
    { x: 8, y: 2, template: "Sl", upSignal: "red" },

    { x: 9, y: 0, template: "Sr+" },
    { x: 9, y: 1, template: "lS+" },

    { x: 10, y: 0, template: "Se", upSignal: "red", downSignal: "red" },
    { x: 10, y: 1, template: "rS+" },

    { x: 11, y: 1, template: "S", downSignal: "red" },
    { x: 12, y: 1, template: "S" },
    { x: 13, y: 1, template: "Se", upSignal: "red", downSignal: "red" },
];

let playerPos = { x: 1, y: 1 };

refresh();

function refresh() {
    canvas.innerHTML = "";

    tiles.forEach((el) => {
        const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        canvas.append(svgEl);
        svgEl.classList.add("tile");
        svgEl.setAttribute('viewBox', '0 0 24 24');
        svgEl.style.left = el.x * gridSize + "px";
        svgEl.style.top = el.y * gridSize + "px";

        templates[el.template].forEach(line => {
            const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            svgEl.append(lineEl);
            lineEl.classList.add("line");
            lineEl.setAttribute("x1", line.x1);
            lineEl.setAttribute("y1", line.y1);
            lineEl.setAttribute("x2", line.x2);
            lineEl.setAttribute("y2", line.y2);
        });

        if (el.upSignal) {
            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            svgEl.append(pathEl);
            pathEl.classList.add("signal");
            pathEl.classList.add(el.upSignal);
            pathEl.setAttribute("d", "M8 8 L12 12 L8 16");
            pathEl.setAttribute("pos", el.x + ", " + el.y);
            pathEl.addEventListener("click", event => {
                let pos = event.target.getAttribute("pos");
                
                let e = tiles.find(el => el.x == pos.split(", ")[0] && el.y == pos.split(", ")[1]);
                
                if (e.upSignal === "green") {
                    e.upSignal = "red";
                } else {
                    e.upSignal = "green";
                }
                
                refresh();
            });
        }
        
        if (el.downSignal) {
            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            svgEl.append(pathEl);
            pathEl.classList.add("signal");
            pathEl.classList.add(el.downSignal);
            pathEl.setAttribute("d", "M16 8 L12 12 L16 16");
            pathEl.setAttribute("pos", el.x + ", " + el.y);
            pathEl.addEventListener("click", event => {
                let pos = event.target.getAttribute("pos");
                
                let e = tiles.find(el => el.x == pos.split(", ")[0] && el.y == pos.split(", ")[1]);
                
                if (e.downSignal === "green") {
                    e.downSignal = "red";
                } else {
                    e.downSignal = "green";
                }
                
                refresh();
            });
        }
        
        if (el.template.includes("+") || el.template.includes("-")) {
            const switchEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            svgEl.append(switchEl);
            switchEl.classList.add("switch-blob");
            switchEl.setAttribute("cx", "12");
            switchEl.setAttribute("cy", "12");
            switchEl.setAttribute("r", "3");
            switchEl.setAttribute("pos", el.x + ", " + el.y);
            switchEl.addEventListener("click", event => {
                let pos = event.target.getAttribute("pos");
                
                let e = tiles.find(el => el.x == pos.split(", ")[0] && el.y == pos.split(", ")[1]);

                if (e.template.includes("+")) {
                    e.template = e.template.replace("+", "-")
                } else {
                    e.template = e.template.replace("-", "+")
                }

                refresh();
            })
        }

        if (el.x == playerPos.x && el.y == playerPos.y) {
            const playerEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            svgEl.append(playerEl);
            playerEl.setAttribute("cx", "12");
            playerEl.setAttribute("cy", "12");
            playerEl.setAttribute("r", "4");
            playerEl.setAttribute("fill", "red");
        }

    });

    canvas.style.width = tiles.sort((a, b) => b.x - a.x)[0].x * gridSize + gridSize + 8 + "px";
    canvas.style.height = tiles.sort((a, b) => b.y - a.y)[0].y * gridSize + gridSize + 8 + "px";
}

function move(dir) {
    if (!["up", "down"].includes(dir)) {
        console.error("Invalid direction");
        return;
    }
    
    let ogPlayerPos = { ...playerPos };

    let fromTile = tiles.find(t => t.x === playerPos.x && t.y === playerPos.y);

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

    let toTile = tiles.find(t => t.x === playerPos.x && t.y === playerPos.y);

    switch (dir) {
        case "up":
            if (toTile.upSignal) {
                if (toTile.upSignal === "red") {
                    playerPos = { ...ogPlayerPos };
                } else {
                    toTile.upSignal = "red";
                }
            }
            break;
        case "down":
            if (toTile.downSignal) {
                if (toTile.downSignal === "red") {
                    playerPos = { ...ogPlayerPos };
                } else {
                    toTile.downSignal = "red";
                }
            }
            break;
        default: break;
    }

    refresh();
}