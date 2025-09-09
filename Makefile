CC = emcc
CFLAGS = -Iinclude -s WASM=1 -s INVOKE_RUN=0
LIBS =
EXPORTED_FUNCTIONS = -s EXPORTED_FUNCTIONS='["_main", "_call_main_handler"]'
EXPORTED_RUNTIME = -s EXPORTED_RUNTIME_METHODS='["UTF8ToString"]'
ADDITIONAL_LIBS = -s USE_FREETYPE=1 -s USE_ZLIB=1
MODULARIZE = -s MODULARIZE=1 -s 'EXPORT_NAME="createPocketBookModule"' -s EXPORT_ES6=1 -O3 -s AGGRESSIVE_VARIABLE_ELIMINATION=1

all: demo01

lib/inkview.o: src/inkview.c
	$(CC) $(CFLAGS) -c $< -o $@ $(ADDITIONAL_LIBS) $(EXPORTED_FUNCTIONS) $(EXPORTED_RUNTIME)

lib/libinkview.a: lib/inkview.o
	emar rcs $@ $^

demo01: projects/demo01/demo01.c lib/libinkview.a
	$(CC) $(CFLAGS) projects/demo01/demo01.c -Llib -linkview -o projects/$@/index.mjs $(EXPORTED_FUNCTIONS) $(EXPORTED_RUNTIME) $(ADDITIONAL_LIBS) $(MODULARIZE)

calc: projects/demo01/demo01.c lib/libinkview.a
	$(CC) $(CFLAGS) projects/calc/calcexe.c -Llib -linkview -o projects/$@/index.mjs $(EXPORTED_FUNCTIONS) $(EXPORTED_RUNTIME) $(ADDITIONAL_LIBS) $(MODULARIZE)

clean:
	rm -f lib/*.o lib/*.a projects/demo01/*.mjs projects/demo01/*.wasm

.PHONY: all clean

