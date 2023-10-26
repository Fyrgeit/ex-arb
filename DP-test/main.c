#include <stdio.h>
#include <stdlib.h>

#include "raylib.h"
#include "raymath.h"

typedef struct Node
{
    Rectangle rec;
} Node;

typedef struct Section
{
    bool occupied;
    Node *nodePtr1;
    short connector1;
    Node *nodePtr2;
    short connector2;
} Section;

void DrawNode(Node *n)
{
    if (CheckCollisionPointRec(GetMousePosition(), n->rec) && IsMouseButtonDown(MOUSE_BUTTON_LEFT))
    {
        n->rec.x += GetMouseDelta().x;
        n->rec.y += GetMouseDelta().y;
    }
    
    DrawCircle(n->rec.x, n->rec.y + n->rec.height / 2, 10, LIGHTGRAY);
    DrawCircle(n->rec.x + n->rec.width, n->rec.y + n->rec.height / 2, 10, LIGHTGRAY);
    
    DrawRectangleRec(n->rec, DARKGRAY);
}

Vector2 GetConnectorPos(Node n, short i)
{
    switch (i)
    {
    case 0:
        return (Vector2){n.rec.x, n.rec.y + n.rec.height / 2};
    case 1:
        return (Vector2){n.rec.x + n.rec.width, n.rec.y + n.rec.height / 2};
    default:
        return (Vector2){n.rec.x, n.rec.y};
    }
}

void DrawSection(Section s)
{
    DrawLineV(
        GetConnectorPos(*s.nodePtr1, s.connector1),
        GetConnectorPos(*s.nodePtr2, s.connector2),
        LIGHTGRAY
    );
}

int main()
{
    const short screenWidth = 1200;
    const short screenHeight = 800;

    InitWindow(screenWidth, screenHeight, "DP-test");

    Node nodes[] = {
        (Node){(Rectangle){100, 400, 60, 40}},
        (Node){(Rectangle){400, 400, 60, 40}},
    };

    Section sections[] = {
        (Section){false, nodes, 1, nodes + 1, 0},
    };

    while (!WindowShouldClose())
    {
        BeginDrawing();
        ClearBackground(BLACK);

        for (short i = 0; i < sizeof(nodes) / sizeof(Node); i++)
        {
            DrawNode(nodes + i);
        }

        for (short i = 0; i < sizeof(sections) / sizeof(Section); i++)
        {
            DrawSection(sections[i]);
        }
        
        DrawText(TextFormat("FPS: %i", GetFPS()), 5, 5, 10, WHITE);
        EndDrawing();
    }

    CloseWindow();

    return 0;
}