import { app, BrowserWindow, screen, Menu } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';


// Initialize remote module
require('@electron/remote/main').initialize();
require('update-electron-app')();

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

  const isMac = process.platform === 'darwin';
  const appVersion = app.getVersion();

  //  DEFINE MENUS
  let menu_lang = {}
  const menu_labels = {
  "en":{
    "options":"Options",
    "cut":"Cut",
    "copy":"Copy",
    "paste": "Paste",
    "selectAll": "Select All",
    "help":"Help",
    "learnmore":"Learn more",
    "settings":"Settings"
  },
  "fr":{
    "options":"Options",
    "cut":"Couper",
    "copy":"Copier",
    "paste": "Coller",
    "selectAll": "Selectioner tout",
    "help":"Aide",
    "learnmore":"En savoir plus",
    "settings":"Paramètres"
  },
  "pt":{
    "options":"Opções",
    "cut":"Cortar",
    "copy":"Copiar",
    "paste": "Colar",
    "selectAll": "Selecionar tudo",
    "help":"Ajuda",
    "learnmore":"Saber mais",
    "settings":"Parametros"
  },
  "de":{
    "options":"Optionen",
    "cut":"Ausschneiden",
    "copy":"Kopieren",
    "paste": "Einfügen",
    "selectAll": "Alles auswählen",
    "help":"Hilfe",
    "learnmore":"Mehr erfahren",
    "settings":"Einstellungen"
  }
  }
  menu_lang = menu_labels["fr"];

  const menu = Menu.buildFromTemplate([{
    label: menu_lang["options"],
    submenu: [
      { type: 'separator' },
      { role: 'cut', label: menu_lang["cut"] },
      { role: 'copy', label: menu_lang["copy"] },
      { role: 'paste', label: menu_lang["paste"] },
      { role: 'selectAll', label: menu_lang["selectAll"] },
      { label: menu_lang["settings"], click: ()=> { 
        win.webContents.send('goto-settings', 'settingsArg');
      } },
    ]
  },
  {
    role: 'help',
    label: menu_lang["help"],
    submenu: [
      {
        label: menu_lang["learnmore"],
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://help.partiri.cloud')
        }
      },
      {
        label: 'Version ' + appVersion
      }
    ]
  }
  ])
  Menu.setApplicationMenu(menu)

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  
  // Create the browser window.
  win = new BrowserWindow({
    x: 50,
    y: 100,
    width: size.width / 3,
    height: size.height / 1.2,
    minWidth: size.width / 3,
    maxWidth: size.width / 3,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run e2e test with Spectron
      enableRemoteModule : true // true if you want to run e2e test with Spectron or use remote module in renderer context (ie. Angular)
    },
  });


  if (serve) {
    win.webContents.openDevTools();
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, '/../node_modules/electron'))
    });
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
       // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    win.loadURL(url.format({
      pathname: path.join(__dirname, pathIndex),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

function getLanguages(){}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
