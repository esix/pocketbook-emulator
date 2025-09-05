#!/bin/sh

emcc demo01.c -o index.mjs \
    -linkview \
    -I ../../include \
    -L ../../lib \
    -s WASM=1 \
    -s EXPORTED_FUNCTIONS='["_main", "_call_main_handler"]' \
    -s EXPORTED_RUNTIME_METHODS='["UTF8ToString"]' \
    -s MODULARIZE=1 \
    -s 'EXPORT_NAME="createPocketBookModule"' \
    -s EXPORT_ES6=1 \
    -s INVOKE_RUN=0 \
    -O3 \
    -s AGGRESSIVE_VARIABLE_ELIMINATION=1
