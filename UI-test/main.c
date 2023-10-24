#include <stdio.h>
#include <stdlib.h>

#include "raylib.h"
#include "raymath.h"

int main()
{
    const short screenWidth = 1200;
    const short screenHeight = 800;

    InitWindow(screenWidth, screenHeight, "TerrainGen");

    
    while (!WindowShouldClose())
    {
        BeginDrawing();
        ClearBackground(BLACK);

        
        
        DrawText(TextFormat("FPS: %i", GetFPS()), 5, 5, 10, WHITE);
        EndDrawing();
    }

    CloseWindow();

    return 0;
}