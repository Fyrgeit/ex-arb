const nodes = [
    {
        type: "regular",
        activated: false,
        pos: { x: 100, y: 100 },
        connectors: {
            "right": -1
        }
    },
    {
        type: "switch",
        activated: false,
        pos: { x: 200, y: 100 },
        connectors: {
            "left": -1,
            "right": -1,
            "up": -1
        }
    },
    {
        pos: { x: 250, y: 50 },
        activated: false,
        type: "regular",
        connectors: {
            "left": -1
        }
    },
];

const edges = [

];

document.getElementById("canvas").addEventListener("click", Change);

document.addEventListener("keydown", Move);

NewEdge(nodes[0], "right", nodes[1], "left");
NewEdge(nodes[1], "up", nodes[2], "left");
Draw();

function Move(event) {
    nodes.forEach((node) => {
        if (!node.activated) return;

        switch (event.key) {
            case "ArrowRight":
                node.pos.x++;
                break;
            case "ArrowLeft":
                node.pos.x--;
                break;
            case "ArrowDown":
                node.pos.y++;
                break;
            case "ArrowUp":
                node.pos.y--;
                break;

            default:
                break;
        }

        Draw();
    });
}

function Change(event) {
    nodes.forEach((node) => {
        if (Math.hypot(event.offsetX - node.pos.x, event.offsetY - node.pos.y) <= 5) {
            node.activated = true;
        } else {
            node.activated = false;
        }
    });

    Draw();
}

function NewEdge(n0, c0, n1, c1) {
    const edge = {
        connections: [
            {
                node: n0,
                connector: c0
            },
            {
                node: n1,
                connector: c1
            }
        ]
    }

    edges.push(edge);
    n0.connectors[c0] = edge;
    n1.connectors[c1] = edge;
}

function Draw() {
    const canvasEl = document.getElementById("canvas");
    const ctx = canvasEl.getContext("2d");
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    edges.forEach((edge) => {
        const p0 = edge.connections[0].node.pos;
        const p1 = edge.connections[1].node.pos;

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
    });

    nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.pos.x, node.pos.y, 5, 0, Math.PI * 2);

        if (node.activated) {
            ctx.fillStyle = "#ff0000";
        } else {
            ctx.fillStyle = "#000080";
        }

        ctx.fill();
    });
}