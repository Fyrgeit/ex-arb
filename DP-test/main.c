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

typedef struct DynamicSections
{
    Section *data;
    short count;
    short capacity;
} DynamicSections;

DynamicSections DynamicSectionsInit()
{
    DynamicSections arr;

    arr.data = malloc(sizeof(Section));
    arr.count = 0;
    arr.capacity = 1;

    return arr;
}

void DynamicSectionsAdd(DynamicSections *arr, Section section)
{
    if (arr->count == arr->capacity)
    {
        arr->capacity *= 2;
        arr->data = realloc(arr->data, sizeof(Section) * arr->capacity);
    }

    arr->data[arr->count] = section;
    arr->count++;
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

void DrawSection(Section s)
{
    DrawLineV(
        GetConnectorPos(*s.nodePtr1, s.connector1),
        GetConnectorPos(*s.nodePtr2, s.connector2),
        LIGHTGRAY);
}

bool IsSectionValid(Section s, DynamicSections sections)
{
    if (s.nodePtr1 == s.nodePtr2)
        return false;

    for (short i = 0; i < sections.count; i++)
    {
        Section iSection = sections.data[i];

        if (
            (iSection.nodePtr1 == s.nodePtr1 && iSection.connector1 == s.connector1) ||
            (iSection.nodePtr1 == s.nodePtr2 && iSection.connector1 == s.connector2) ||
            (iSection.nodePtr2 == s.nodePtr1 && iSection.connector2 == s.connector1) ||
            (iSection.nodePtr2 == s.nodePtr2 && iSection.connector2 == s.connector2))
        {
            return false;
        }
    }

    return true;
}

int main()
{
    const short screenWidth = 1200;
    const short screenHeight = 800;

    InitWindow(screenWidth, screenHeight, "DP-test");

    Node nodes[] = {
        (Node){(Rectangle){100, 400, 60, 40}},
        (Node){(Rectangle){300, 400, 60, 40}},
        (Node){(Rectangle){500, 400, 60, 40}},
        (Node){(Rectangle){700, 400, 60, 40}},
    };

    DynamicSections sections = DynamicSectionsInit();

    bool creating = false;
    Section newSection = (Section){false, NULL, -1, NULL, -1};

    while (!WindowShouldClose())
    {
        if (IsMouseButtonReleased(MOUSE_BUTTON_LEFT))
        {
            for (short i = 0; i < sizeof(nodes) / sizeof(Node); i++)
            {
                Node *n = nodes + i;

                for (short connectorIndex = 0; connectorIndex < 2; connectorIndex++)
                {
                    bool additionalCondition = false;

                    switch (connectorIndex)
                    {
                    case 0:
                        additionalCondition = GetMouseX() < n->rec.x;
                        break;
                    case 1:
                        additionalCondition = GetMouseX() > n->rec.x + n->rec.width;
                        break;
                    default:
                        break;
                    }

                    if (Vector2Distance(GetMousePosition(), GetConnectorPos(*n, connectorIndex)) < 10 && additionalCondition)
                    {
                        if (!creating)
                        {
                            creating = true;
                            newSection.nodePtr1 = n;
                            newSection.connector1 = connectorIndex;
                            break;
                        }
                        else
                        {
                            newSection.nodePtr2 = n;
                            newSection.connector2 = connectorIndex;
                            creating = false;

                            if (IsSectionValid(newSection, sections))
                            {
                                DynamicSectionsAdd(&sections, newSection);
                                break;
                            }
                            else
                            {
                                puts("Section invalid");
                                break;
                            }
                        }
                    }
                }
            }
        }

        BeginDrawing();
        ClearBackground(BLACK);

        for (short i = 0; i < sizeof(nodes) / sizeof(Node); i++)
        {
            DrawNode(nodes + i);
        }

        for (short i = 0; i < sections.count; i++)
        {
            DrawSection(sections.data[i]);
        }

        DrawText(TextFormat("FPS: %i", GetFPS()), 5, 5, 10, WHITE);
        EndDrawing();
    }

    CloseWindow();

    return 0;
}