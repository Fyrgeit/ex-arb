const canvas = document.getElementById("canvas");

const gridSize = 50;

const templates = {
    "H": [
        { x1: 0, y1: 10, x2: 20, y2: 10 }
    ],
    "Hbl": [
        { x1: 0, y1: 20, x2: 10, y2: 10 },
        { x1: 10, y1: 10, x2: 20, y2: 10 }
    ],
    "Htl": [
        { x1: 0, y1: 0, x2: 10, y2: 10 },
        { x1: 10, y1: 10, x2: 20, y2: 10 }
    ],
    "Hbr": [
        { x1: 0, y1: 10, x2: 10, y2: 10 },
        { x1: 10, y1: 10, x2: 20, y2: 20 }
    ],
    "Htr": [
        { x1: 0, y1: 10, x2: 10, y2: 10 },
        { x1: 10, y1: 10, x2: 20, y2: 0 }
    ],
    "Htr+": [
        { x1: 0, y1: 10, x2: 20, y2: 10 },
        { x1: 14, y1: 6, x2: 20, y2: 0 }
    ],
    "Htr-": [
        { x1: 0, y1: 10, x2: 10, y2: 10 },
        { x1: 16, y1: 10, x2: 20, y2: 10 },
        { x1: 10, y1: 10, x2: 20, y2: 0 }
    ],
    "Htl+": [
        { x1: 0, y1: 10, x2: 20, y2: 10 },
        { x1: 0, y1: 0, x2: 6, y2: 6 }
    ],
    "Htl-": [
        { x1: 0, y1: 10, x2: 4, y2: 10 },
        { x1: 10, y1: 10, x2: 20, y2: 10 },
        { x1: 0, y1: 0, x2: 10, y2: 10 }
    ],
    "Heu": [
        { x1: 0, y1: 10, x2: 10, y2: 10 },
    ],
    "Hed": [
        { x1: 10, y1: 10, x2: 20, y2: 10 },
    ],
};

const tiles = [
    { x: 0, y: 1, template: "Hed", downSignal: "red" },
    { x: 1, y: 1, template: "Htr+" },
    { x: 2, y: 0, template: "Hbl", downSignal: "red" },
    { x: 2, y: 1, template: "H", downSignal: "red" },
    { x: 3, y: 0, template: "H" },
    { x: 3, y: 1, template: "H" },
    { x: 4, y: 0, template: "Hbr", upSignal: "red" },
    { x: 4, y: 1, template: "H", upSignal: "red" },
    { x: 5, y: 1, template: "Htl+" },
    { x: 6, y: 1, template: "H", upSignal: "red", downSignal: "red" },
    { x: 7, y: 1, template: "Hbr" },
    { x: 8, y: 2, template: "Htl" },
    { x: 9, y: 2, template: "Htr" },
    { x: 10, y: 1, template: "Hbl" },
    { x: 11, y: 1, template: "H", downSignal: "red" },
    { x: 12, y: 1, template: "H" },
    { x: 13, y: 1, template: "Heu", upSignal: "red" },
];

let playerPos = { x: 3, y: 1};

refresh();

function refresh() {
    canvas.innerHTML = "";

    tiles.forEach((el, index) => {
        const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        canvas.append(svgEl);
        svgEl.classList.add("tile");
        svgEl.setAttribute('viewBox', '0 0 20 20');
        svgEl.style.left = el.x * gridSize + "px";
        svgEl.style.top = el.y * gridSize + "px";

        templates[el.template].forEach(line => {
            const lineEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            svgEl.append(lineEl);
            lineEl.setAttribute("x1", line.x1);
            lineEl.setAttribute("y1", line.y1);
            lineEl.setAttribute("x2", line.x2);
            lineEl.setAttribute("y2", line.y2);
        });

        if (el.upSignal) {
            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            svgEl.append(pathEl);
            pathEl.classList.add(el.upSignal);
            pathEl.setAttribute("d", "M6 6 L10 10 L6 14");
            pathEl.setAttribute("signalIndex", index);
            pathEl.addEventListener("click", event => {
                let i = Number(event.target.getAttribute("signalIndex"));
                
                let e = tiles[i];
                console.log(i);
                
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
            pathEl.classList.add(el.downSignal);
            pathEl.setAttribute("d", "M14 6 L10 10 L14 14");
            pathEl.setAttribute("signalIndex", index);
            pathEl.addEventListener("click", event => {
                let i = Number(event.target.getAttribute("signalIndex"));
                
                let e = tiles[i];
                console.log(i);
    
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
            switchEl.setAttribute("cx", "10");
            switchEl.setAttribute("cy", "10");
            switchEl.setAttribute("r", "3");
            switchEl.setAttribute("switchIndex", index);
            switchEl.addEventListener("click", event => {
                let i = Number(event.target.attributes.switchIndex.value);
                
                let e = tiles[i];
                console.log(e);

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
            playerEl.setAttribute("cx", "10");
            playerEl.setAttribute("cy", "10");
            playerEl.setAttribute("r", "4");
            playerEl.setAttribute("fill", "red");
        }

    });
    
    canvas.style.width = tiles.sort((a, b) => b.x - a.x)[0].x * gridSize + gridSize + "px";
    canvas.style.height = tiles.sort((a, b) => b.y - a.y)[0].y * gridSize + gridSize + "px";
    canvas.append(playerPos.x + ", " + playerPos.y);
}

function right() {
    let fromTile = tiles.find(t => t.x === playerPos.x && t.y === playerPos.y);
    
    playerPos.x++;

    switch (fromTile.template) {
        case "Hbr":
        case "Hbr-":
            playerPos.y++;
            break;
        case "Htr":
        case "Htr-":
            playerPos.y--;
            break;
        default:
            break;
    }
    
    refresh();
}

function left() {
    let fromTile = tiles.find(t => t.x === playerPos.x && t.y === playerPos.y);
    
    playerPos.x--;

    switch (fromTile.template) {
        case "Hbl":
        case "Hbl-":
            playerPos.y++;
            break;
        case "Htl":
        case "Htl-":
            playerPos.y--;
            break;
        default:
            break;
    }
    
    refresh();
}