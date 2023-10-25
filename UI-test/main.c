#include <stdio.h>
#include <stdlib.h>

#include "raylib.h"
#include "raymath.h"

typedef struct
{
    char name[32];
    Vector2 position;
    bool expanded;
    Vector2 expandedSize;
    short connections;
    bool taken;
} Station;

Vector2 GetConnectorPos(Station s, short connector)
{
    return (Vector2){
        s.position.x,
        s.position.y - (s.connections - 1) * 20 + connector * 40 + (s.expanded ? (20 + s.expandedSize.y / 2) : ((s.connections * 40 + 10) / 2))
    };
}

void DrawStation(Station *s)
{
    Vector2 mp = GetMousePosition();

    // Expand/minimize
    if (
        mp.x > s->position.x &&
        mp.y > s->position.y &&
        mp.x < s->position.x + 20 &&
        mp.y < s->position.y + 20 &&
        IsMouseButtonReleased(MOUSE_BUTTON_LEFT))
        s->expanded = !s->expanded;

    short w = s->expanded ? s->expandedSize.x : MeasureText(s->name, 20) + 30;
    short h = s->expanded ? s->expandedSize.y : s->connections * 40 + 10;

    short barH = s->expanded ? 20 : h;

    if (
        mp.x > s->position.x &&
        mp.y > s->position.y &&
        mp.x < s->position.x + w &&
        mp.y < s->position.y + barH &&
        IsMouseButtonPressed(MOUSE_BUTTON_LEFT))
        s->taken = true;

    if (IsMouseButtonReleased(MOUSE_BUTTON_LEFT))
        s->taken = false;

    if (s->taken)
        s->position = Vector2Add(s->position, GetMouseDelta());

    //Draw
    for (short i = 0; i < s->connections; i++)
    {
        DrawCircleV(GetConnectorPos(*s, i), 15, LIGHTGRAY);
    }

    if (s->expanded)
    {
        DrawRectangle(s->position.x, s->position.y, w, barH, DARKGRAY);
        
        DrawLineEx((Vector2){s->position.x + 2, s->position.y + 14}, (Vector2){s->position.x + 10, s->position.y + 6}, 2, WHITE);
        DrawLineEx((Vector2){s->position.x + 10, s->position.y + 6}, (Vector2){s->position.x + 18, s->position.y + 14}, 2, WHITE);

        DrawText(s->name, s->position.x + 25, s->position.y, 20, WHITE);

        DrawRectangle(s->position.x, s->position.y + 20, w, h, GRAY);
    }
    else
    {
        DrawRectangle(s->position.x, s->position.y, w, h, DARKGRAY);

        DrawLineEx((Vector2){s->position.x + 2, s->position.y + 6}, (Vector2){s->position.x + 10, s->position.y + 14}, 2, WHITE);
        DrawLineEx((Vector2){s->position.x + 10, s->position.y + 14}, (Vector2){s->position.x + 18, s->position.y + 6}, 2, WHITE);

        DrawText(s->name, s->position.x + 25, s->position.y, 20, WHITE);
    }
}

void DrawConnection(Station s1, short c1, Station s2, short c2)
{
    Vector2 p1 = GetConnectorPos(s1, c1);
    Vector2 p2 = GetConnectorPos(s2, c2);

    DrawLineBezierCubic(p1, p2, (Vector2){p1.x - 200, p1.y}, (Vector2){p2.x - 200, p2.y}, 2, LIGHTGRAY);
}

int main()
{
    const short screenWidth = 1200;
    const short screenHeight = 800;

    InitWindow(screenWidth, screenHeight, "TerrainGen");

    Station stations[] = {
        {"Örebro", (Vector2){300, 200}, false, (Vector2){500, 300}, 3, false},
        {"Töreboda", (Vector2){500, 300}, false, (Vector2){300, 200}, 2, false},
    };

    while (!WindowShouldClose())
    {
        BeginDrawing();
        ClearBackground(BLACK);

        DrawConnection(stations[0], 1, stations[1], 0);

        for (short i = 0; i < sizeof(stations) / sizeof(Station); i++)
        {
            DrawStation(&stations[i]);
        }

        DrawText(TextFormat("FPS: %i", GetFPS()), 5, 5, 10, WHITE);
        EndDrawing();
    }

    CloseWindow();

    return 0;
}