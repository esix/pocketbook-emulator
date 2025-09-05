let canvas, ctx;
let pocketBookModule;

function updateStatus(msg) {
  document.getElementById('status').innerText = msg;
  console.log(msg);
}

// API функции
const inkviewAPI = {
  js_clear_screen: function() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    updateStatus("Screen cleared");
  },

  js_draw_line: function(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `#${(color >>> 0).toString(16).padStart(6, '0')}`;
    ctx.stroke();
    updateStatus(`Line drawn: (${x1},${y1}) to (${x2},${y2})`);
  },

  js_fill_area: function(x, y, w, h, color) {
    ctx.fillStyle = `#${(color >>> 0).toString(16).padStart(6, '0')}`;
    ctx.fillRect(x, y, w, h);
    updateStatus(`Area filled: (${x},${y}) ${w}x${h}`);
  },

  js_draw_text: function(x, y, text, align) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText(text, x, y);
    updateStatus(`Text drawn: "${text}" at (${x},${y})`);
  },

  js_set_font: function(name, size) {
    ctx.font = `${size}px "${name}"`;
    updateStatus(`Font set: "${name}", size ${size}`);
  },

  js_screen_width: function() {
    return canvas.width;
  },

  js_screen_height: function() {
    return canvas.height;
  },

  js_close_app: function() {
    updateStatus("Application closed");
  }
};

// Функция для вызова обработчика событий из C
function callMainHandler(event_type, param_one, param_two) {
  if (pocketBookModule && pocketBookModule._call_main_handler) {
    pocketBookModule._call_main_handler(event_type, param_one, param_two);
  } else {
    console.error("Module or call_main_handler not available");
  }
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

    // Сохраняем API в глобальной области
    window.inkviewAPI = inkviewAPI;

    updateStatus("Loading WASM module...");

    const {default: createPocketBookModule} = await import('../projects/demo01/index.mjs');

    // Загружаем модуль
    pocketBookModule = await createPocketBookModule();

    updateStatus("WASM module loaded");

    // Запускаем приложение
    updateStatus("Starting application...");
    pocketBookModule._main();

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
    callMainHandler(4, 13, 0); // EVT_KEYPRESS, keyCode=13
    updateStatus(`Mouse clicked at (${x}, ${y}), simulating Enter key`);
  });

  // Обработчик нажатия клавиш
  document.addEventListener('keydown', function(event) {
    callMainHandler(4, event.keyCode, 0); // EVT_KEYPRESS
    updateStatus(`Key pressed: ${event.keyCode}`);

    // Закрытие приложения по Escape
    if (event.keyCode === 27) { // Escape key
      callMainHandler(4, 27, 0);
    }
  });

  // Обработчики кнопок
  document.getElementById('prevPage').addEventListener('click', function() {
    callMainHandler(4, 37, 0); // Left arrow key
    updateStatus("Previous page button clicked");
  });

  document.getElementById('nextPage').addEventListener('click', function() {
    callMainHandler(4, 39, 0); // Right arrow key
    updateStatus("Next page button clicked");
  });

  document.getElementById('home').addEventListener('click', function() {
    callMainHandler(4, 36, 0); // Home key
    updateStatus("Home button clicked");
  });

  document.getElementById('back').addEventListener('click', function() {
    callMainHandler(4, 8, 0); // Backspace key
    updateStatus("Back button clicked");
  });

  updateStatus("Event handlers setup complete");
}

// Запускаем при загрузке страницы
window.addEventListener('load', initApp);
