export const gridSize = 20;

export const templates = {
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

export const rails = [
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

export const signals = [
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
];

export const routes = {
    "2 7": {
        usedRails: [
            {x: 2, y: 1},
            {x: 3, y: 1},
            {x: 4, y: 1},
            {x: 5, y: 1},
            {x: 6, y: 0},
            {x: 7, y: 0},
        ],
        switchStates: {
            "A": "+",
            "C": "+",
            "E": "-",
        }
    },
    "2 8": {
        usedRails: [
            {x: 2, y: 1},
            {x: 3, y: 1},
            {x: 4, y: 1},
            {x: 5, y: 1},
            {x: 6, y: 1},
            {x: 7, y: 1},
        ],
        switchStates: {
            "A": "+",
            "C": "+",
            "E": "+",
        }
    },
    "2 9": {
        usedRails: [
            {x: 2, y: 1},
            {x: 3, y: 1},
            {x: 4, y: 2},
            {x: 5, y: 2},
            {x: 6, y: 2},
            {x: 7, y: 2},
        ],
        switchStates: {
            "A": "-",
            "D": "-",
        }
    },
    "3 7": {
        usedRails: [
            {x: 2, y: 2},
            {x: 3, y: 2},
            {x: 4, y: 1},
            {x: 5, y: 1},
            {x: 6, y: 0},
            {x: 7, y: 0},
        ],
        switchStates: {
            "B": "-",
            "C": "-",
            "E": "-",
        }
    },
    "3 8": {
        usedRails: [
            {x: 2, y: 2},
            {x: 3, y: 2},
            {x: 4, y: 1},
            {x: 5, y: 1},
            {x: 6, y: 1},
            {x: 7, y: 1},
        ],
        switchStates: {
            "B": "-",
            "C": "-",
            "E": "+",
        }
    },
    "3 9": {
        usedRails: [
            {x: 2, y: 2},
            {x: 3, y: 2},
            {x: 4, y: 2},
            {x: 5, y: 2},
            {x: 6, y: 2},
            {x: 7, y: 2},
        ],
        switchStates: {
            "B": "+",
            "D": "+",
        }
    },
    "7 12": {
        usedRails: [
            {x: 8, y: 0},
            {x: 9, y: 1},
            {x: 10, y: 1},
            {x: 11, y: 1},
            {x: 12, y: 1},
        ],
        switchStates: {
            "G": "-",
        }
    },
    "8 12": {
        usedRails: [
            {x: 8, y: 1},
            {x: 9, y: 1},
            {x: 10, y: 1},
            {x: 11, y: 1},
            {x: 12, y: 1},
        ],
        switchStates: {
            "F": "+",
            "G": "+",
        }
    },
    "8 13": {
        usedRails: [
            {x: 8, y: 1},
            {x: 9, y: 2},
            {x: 10, y: 2},
            {x: 11, y: 3},
            {x: 12, y: 3},
        ],
        switchStates: {
            "F": "-",
            "H": "-",
        }
    },
    "9 13": {
        usedRails: [
            {x: 8, y: 2},
            {x: 9, y: 2},
            {x: 10, y: 2},
            {x: 11, y: 3},
            {x: 12, y: 3},
        ],
        switchStates: {
            "H": "+",
        }
    },
}