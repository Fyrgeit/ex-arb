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
    
    "Se": "m0 10 l10 0",
    "eS": "m10 10 l10 0",
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

const canvas = document.getElementById("canvas");

let playerPos = { x: 1, y: 1 };

refresh();

function refresh() {
    canvas.innerHTML = "";
    
    tiles.forEach((el) => {
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        canvas.append(pathEl);
        pathEl.classList.add("line");
        pathEl.setAttribute("d", `M${el.x * gridSize} ${el.y * gridSize} ${templates[el.template]}`);

        if (el.upSignal) {
            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            canvas.append(pathEl);
            pathEl.classList.add("signal");
            pathEl.classList.add(el.upSignal);
            pathEl.setAttribute("d", `M${el.x * gridSize} ${el.y * gridSize} m6 6 l4 4 l-4 4`);
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
            canvas.append(pathEl);
            pathEl.classList.add("signal");
            pathEl.classList.add(el.downSignal);
            pathEl.setAttribute("d", `M${el.x * gridSize} ${el.y * gridSize} m14 6 l-4 4 l4 4`);
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
            canvas.append(switchEl);
            switchEl.classList.add("switch-blob");
            switchEl.setAttribute("cx", 10 + el.x * gridSize);
            switchEl.setAttribute("cy", 10 + el.y * gridSize);
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
            canvas.append(playerEl);
            playerEl.setAttribute("cx", 10 + el.x * gridSize);
            playerEl.setAttribute("cy", 10 + el.y * gridSize);
            playerEl.setAttribute("r", "4");
            playerEl.setAttribute("fill", "red");
        }

    });

    canvas.setAttribute("viewBox",
        "0 0 " +     
        (tiles.sort((a, b) => b.x - a.x)[0].x * gridSize + gridSize + 8) + " " +
        (tiles.sort((a, b) => b.y - a.y)[0].y * gridSize + gridSize + 8)
    );
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