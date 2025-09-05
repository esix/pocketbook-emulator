#!/bin/sh

emcc -c inkview.c -o ../lib/inkview.o \
    -I ../include \
    -s WASM=1 \
    -s EXPORTED_FUNCTIONS='["_call_main_handler"]' \
    -s EXPORTED_RUNTIME_METHODS='["UTF8ToString"]' \
    -s INVOKE_RUN=0

emar rcs ../lib/libinkview.a ../lib/inkview.o
