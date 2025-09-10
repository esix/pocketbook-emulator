#include "inkview.h"
#include <stdio.h>

static const int kFontSize = 42;

// Убираем static!
int main_handler(int event_type, int param_one, int param_two)
{
    printf("HELLO MAIN HANDLER %d %d %d\n", event_type, param_one, param_two);
    if (EVT_INIT == event_type) {
        ifont *font = OpenFont("Arial", kFontSize, 0);

        ClearScreen();
        SetFont(font, BLACK);
        DrawLine(0, 25, ScreenWidth(), 25, 0x333333);
        DrawLine(0, ScreenHeight() - 25, ScreenWidth(), ScreenHeight() - 25, 0x666666);
        FillArea(50, 250, ScreenWidth() - 100, ScreenHeight() - 500, 0xE0E0E0);
        FillArea(100, 300, ScreenWidth() - 200, ScreenHeight() - 600, 0xA0A0A0);
        DrawTextRect(0, ScreenHeight()/2 - 21, ScreenWidth(), 42, "Hello, world!", ALIGN_CENTER);
        FullUpdate();
        CloseFont(font);
    }
    else if (EVT_KEYPRESS == event_type) {
        CloseApp();
    }
    return 0;
}

int main(int argc, char* argv[])
{
    InkViewMain(main_handler);
    return 0;
}
