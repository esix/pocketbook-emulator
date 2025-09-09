#include "inkview.h"
#include <emscripten.h>

static int (*current_handler)(int, int, int) = NULL;

EM_JS(void, ClearScreen, (), { window.inkviewAPI.ClearScreen() });

EM_JS(void, js_draw_line, (int x1, int y1, int x2, int y2, int color), {
    if (window.inkviewAPI && window.inkviewAPI.js_draw_line) {
        window.inkviewAPI.js_draw_line(x1, y1, x2, y2, color);
    }
});

EM_JS(void, js_fill_area, (int x, int y, int w, int h, int color), {
    if (window.inkviewAPI && window.inkviewAPI.js_fill_area) {
        window.inkviewAPI.js_fill_area(x, y, w, h, color);
    }
});

EM_JS(void, js_draw_text, (int x, int y, const char* text, int align), {
    if (window.inkviewAPI && window.inkviewAPI.js_draw_text) {
        const textStr = UTF8ToString(text);
        window.inkviewAPI.js_draw_text(x, y, textStr, align);
    }
});

EM_JS(void, js_set_font, (const char* name, int size), {
    if (window.inkviewAPI && window.inkviewAPI.js_set_font) {
        const nameStr = UTF8ToString(name);
        window.inkviewAPI.js_set_font(nameStr, size);
    }
});

EM_JS(void, js_close_app, (), {
    if (window.inkviewAPI && window.inkviewAPI.js_close_app) {
        window.inkviewAPI.js_close_app();
    }
});

EM_JS(int, js_screen_width, (), {
    if (window.inkviewAPI && window.inkviewAPI.js_screen_width) {
        return window.inkviewAPI.js_screen_width();
    }
    return 800;
});

EM_JS(int, js_screen_height, (), {
    if (window.inkviewAPI && window.inkviewAPI.js_screen_height) {
        return window.inkviewAPI.js_screen_height();
    }
    return 600;
});

// Реализация API
void DrawLine(int x1, int y1, int x2, int y2, int color) { js_draw_line(x1, y1, x2, y2, color); }
void FillArea(int x, int y, int w, int h, int color) { js_fill_area(x, y, w, h, color); }
char *DrawTextRect(int x, int y, int w, int h, const char *s, int flags) { js_draw_text(x + w/2, y + h/2, s, flags); }
ifont* OpenFont(const char* name, int size, int flag) { js_set_font(name, size); return (ifont*)1; }
void CloseFont(ifont* font) { }
int ScreenWidth() { return js_screen_width(); }
int ScreenHeight() { return js_screen_height(); }
void FullUpdate() { }
void CloseApp() { js_close_app(); }
void SetFont(ifont* font, int color) { }

void InkViewMain(int (*handler)(int, int, int)) {
    current_handler = handler;
    if (current_handler) {
        current_handler(EVT_INIT, 0, 0);
    }
}

void call_main_handler(int event_type, int param_one, int param_two) {
    if (current_handler) {
        current_handler(event_type, param_one, param_two);
    }
}
