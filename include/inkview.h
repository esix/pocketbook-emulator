#ifndef INKVIEW_EMUL_H
#define INKVIEW_EMUL_H

#ifdef __cplusplus
extern "C" {
#endif

// Константы событий
#define EVT_INIT 1
#define EVT_KEYPRESS 4

// Константы выравнивания
#define ALIGN_CENTER  4

// Цвета
#define BLACK 0x000000

typedef struct {
    int dummy;
} ifont;

// Прототипы функций
void ClearScreen();
void DrawLine(int x1, int y1, int x2, int y2, int color);
void FillArea(int x, int y, int w, int h, int color);
void DrawTextRect(int x, int y, int w, int h, const char *text, int align);
ifont* OpenFont(const char* name, int size, int flag);
void CloseFont(ifont* font);
int ScreenWidth();
int ScreenHeight();
void FullUpdate();
void CloseApp();
void SetFont(ifont* font, int color);
void InkViewMain(int (*handler)(int, int, int));

// Объявляем main_handler для экспорта
int main_handler(int event_type, int param_one, int param_two);

#ifdef __cplusplus
}
#endif

#endif
