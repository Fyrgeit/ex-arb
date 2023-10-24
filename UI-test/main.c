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
    bool taken;
} Station;

void DrawStation(Station *s)
{
    Vector2 mp = GetMousePosition();
    if (
        mp.x > s->position.x &&
        mp.y > s->position.y &&
        mp.x < s->position.x + 20 &&
        mp.y < s->position.y + 20 &&
        IsMouseButtonReleased(MOUSE_BUTTON_LEFT))
        s->expanded = !s->expanded;

    short w = s->expanded ? s->expandedSize.x : MeasureText(s->name, 20) + 30;

    if (
        mp.x > s->position.x + 20 &&
        mp.y > s->position.y &&
        mp.x < s->position.x + w &&
        mp.y < s->position.y + 20 &&
        IsMouseButtonPressed(MOUSE_BUTTON_LEFT))
        s->taken = true;

    if (IsMouseButtonReleased(MOUSE_BUTTON_LEFT))
        s->taken = false;

    if (s->taken)
        s->position = Vector2Add(s->position, GetMouseDelta());

    if (s->expanded)
    {
        DrawRectangle(s->position.x, s->position.y, w, 20, DARKGRAY);

        DrawLineEx((Vector2){s->position.x + 2, s->position.y + 14}, (Vector2){s->position.x + 10, s->position.y + 6}, 2, WHITE);
        DrawLineEx((Vector2){s->position.x + 10, s->position.y + 6}, (Vector2){s->position.x + 18, s->position.y + 14}, 2, WHITE);

        DrawText(s->name, s->position.x + 25, s->position.y, 20, WHITE);

        DrawRectangle(s->position.x, s->position.y + 20, s->expandedSize.x, s->expandedSize.y, GRAY);
    }
    else
    {
        DrawRectangle(s->position.x, s->position.y, w, 20, DARKGRAY);

        DrawLineEx((Vector2){s->position.x + 2, s->position.y + 6}, (Vector2){s->position.x + 10, s->position.y + 14}, 2, WHITE);
        DrawLineEx((Vector2){s->position.x + 10, s->position.y + 14}, (Vector2){s->position.x + 18, s->position.y + 6}, 2, WHITE);

        DrawText(s->name, s->position.x + 25, s->position.y, 20, WHITE);
    }
}

int main()
{
    const short screenWidth = 1200;
    const short screenHeight = 800;

    InitWindow(screenWidth, screenHeight, "TerrainGen");

    Station station = {
        "Theo hand push",
        (Vector2){300, 200},
        false,
        (Vector2){500, 300},
        false};

    while (!WindowShouldClose())
    {
        BeginDrawing();
        ClearBackground(BLACK);

        DrawStation(&station);

        DrawText(TextFormat("FPS: %i", GetFPS()), 5, 5, 10, WHITE);
        EndDrawing();
    }

    CloseWindow();

    return 0;
}