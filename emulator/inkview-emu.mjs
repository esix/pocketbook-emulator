const EVT_INIT = 21
const EVT_EXIT = 22
const EVT_SHOW = 23
const EVT_REPAINT = 23
const EVT_HIDE = 24
const EVT_KEYDOWN = 25
const EVT_KEYPRESS = 25
const EVT_KEYUP = 26
const EVT_KEYRELEASE = 26
const EVT_KEYREPEAT = 28
const EVT_POINTERUP = 29
const EVT_POINTERDOWN = 30
const EVT_POINTERMOVE = 31
const EVT_POINTERLONG = 34
const EVT_POINTERHOLD = 35
const EVT_ORIENTATION = 32
const EVT_FOCUS = 36
const EVT_UNFOCUS = 37
const EVT_ACTIVATE = 38

let canvas, ctx;
let _Module;

function updateStatus(msg) {
  document.getElementById('status').innerText = msg;
  console.log(msg);
}

let main_handler;


class InkviewApi {
  OpenScreen() { debugger }
  OpenScreenExt() {debugger}
  InkViewMain (pfnCallback) {
    main_handler = pfnCallback;
    const result = callMainHandler(EVT_INIT, 0, 0);
    console.log(result); // 10
  }
  CloseApp() {
    updateStatus("Application closed");
  }

  ScreenWidth() {
    return canvas.width                      // 600
  }
  ScreenHeight() {
    return canvas.height                    // 800
  }

  SetOrientation(n) {
    debugger
  }
  GetOrientation() {
  return 0;
}
  SetGlobalOrientation(n)  {
    debugger
  }
  GetGlobalOrientation(){
    return -1
  }
  QueryGSensor () {
    return 1
  }
  // void SetGSensor(int mode);
  // int ReadGSensor(int *x, int *y, int *z);
  // void CalibrateGSensor();

  ClearScreen() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    updateStatus("Screen cleared");
  }
  SetClip(x, y, w, h) {debugger}
  DrawPixel(x, y, color) { debugger;  }
  DrawLine(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `#${(color >>> 0).toString(16).padStart(6, '0')}`;
    ctx.stroke();
    updateStatus(`Line drawn: (${x1},${y1}) to (${x2},${y2})`);
  }

  FillArea(x, y, w, h, color) {
    ctx.fillStyle = `#${(color >>> 0).toString(16).padStart(6, '0')}`;
    ctx.fillRect(x, y, w, h);
    updateStatus(`Area filled: (${x},${y}) ${w}x${h}`);
  }

  DrawTextRect(x, y, w, h, text, flags) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000000';
    ctx.font = '20px LiberationSans';
    ctx.fillText(text, x + w / 2, y + h / 2);
    updateStatus(`Text drawn: "${text}" at (${x},${y})`);
    return "ResultOfDrawTextRect";
  }

  _fonts = [];

  OpenFont(name, size, aa) {
    ctx.font = `${size}px "${name}"`;
    updateStatus(`Font set: "${name}", size ${size}`);
    // TODO: return ifont*
    const font = {
      name: name,
      family: 'LiberationSans',
      size: size,
      aa: 0,
      isbold: 0,
      isitalic: 0,
      _r1: 0,
      charset: 1,
      _r2: 0,
      color: 0,
      height: 10,       // ? passed 8
      linespacing: 10,
      baseline: 8,
      fdata: null,    // really some data
    };
    this._fonts.push(font);
    return font;
  }
  CloseFont(f) {
  }
  SetFont(font, color) {
  }
  FullUpdate() {
  }
}


// Функция для вызова обработчика событий из C
function callMainHandler(event_type, param_one, param_two) {
  const myFunction = _Module.wasmTable.get(main_handler);

  // call handler registered as main_handler
  const result = myFunction(event_type, param_one, param_two);
  return result;
}


// Инициализация приложения
async function initApp() {
  try {
    updateStatus("Initializing canvas...");
    canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 600;
    ctx = canvas.getContext('2d');

    // Очищаем canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    updateStatus("Loading WASM module...");

    const {default: createPocketBookModule} = await import('../projects/demo01/index.mjs');

    // Загружаем модуль
    _Module = await createPocketBookModule({api: new InkviewApi()});

    updateStatus("WASM module loaded");

    // Запускаем приложение
    updateStatus("Starting application...");
    _Module._main();

    // Добавляем обработчики событий
    setupEventHandlers();

  } catch (error) {
    updateStatus("Error: " + error.message);
    console.error(error);
  }
}

// Настройка обработчиков событий
function setupEventHandlers() {
  // Обработчик клика по canvas
  canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Для простоты отправим событие KEYPRESS с кодом 13 (Enter)
    callMainHandler(EVT_KEYPRESS, 13, 0); // EVT_KEYPRESS, keyCode=13
    updateStatus(`Mouse clicked at (${x}, ${y}), simulating Enter key`);
  });

  // Обработчик нажатия клавиш
  document.addEventListener('keydown', function(event) {
    callMainHandler(EVT_KEYPRESS, event.keyCode, 0); // EVT_KEYPRESS
    updateStatus(`Key pressed: ${event.keyCode}`);

    // Закрытие приложения по Escape
    if (event.keyCode === 27) { // Escape key
      callMainHandler(EVT_KEYPRESS, 27, 0);
    }
  });

  // Обработчики кнопок
  document.getElementById('prevPage').addEventListener('click', function() {
    callMainHandler(EVT_KEYPRESS, 37, 0); // Left arrow key
    updateStatus("Previous page button clicked");
  });

  document.getElementById('nextPage').addEventListener('click', function() {
    callMainHandler(EVT_KEYPRESS, 39, 0); // Right arrow key
    updateStatus("Next page button clicked");
  });

  document.getElementById('home').addEventListener('click', function() {
    callMainHandler(EVT_KEYPRESS, 36, 0); // Home key
    updateStatus("Home button clicked");
  });

  document.getElementById('back').addEventListener('click', function() {
    callMainHandler(EVT_KEYPRESS, 8, 0); // Backspace key
    updateStatus("Back button clicked");
  });

  updateStatus("Event handlers setup complete");
}

// Запускаем при загрузке страницы
window.addEventListener('load', initApp);
