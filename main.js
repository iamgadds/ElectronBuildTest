const { app, BrowserWindow } = require('electron');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const log = require('electron-log'); // Use electron-log for logging

// Function to resolve the log path based on the environment
const getLogPath = () => {
    if (process.env.NODE_ENV === 'development') {
      return path.join(__dirname, 'logs', 'main.log');
    } else {
      return path.join(process.resourcesPath, 'logs', 'main.log');
    }
  };
  
  const logDir = process.env.NODE_ENV === 'development' ? path.join(__dirname, 'logs') : path.join(process.resourcesPath, 'logs');
  const logPath = getLogPath();
  
  // Ensure log directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  log.transports.file.resolvePathFn = () => logPath;
  log.transports.file.level = 'info';
  log.transports.console.level = 'info';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Adjust the path to the C# executable
  const csharpServerPath = process.env.NODE_ENV === 'development' 
    ? path.join(__dirname, 'publish', 'SharpPcapDemo.exe')
    : path.join(process.resourcesPath, 'publish', 'SharpPcapDemo.exe');

  log.info('Server path:', csharpServerPath);

  if (fs.existsSync(csharpServerPath)) {
    log.info('C# executable found, starting server...');
    execFile(csharpServerPath, (error, stdout, stderr) => {
      if (error) {
        log.error('Error starting C# server:', error);
        return;
      }
      log.info('C# server stdout:', stdout);
      log.error('C# server stderr:', stderr);
    });
  } else {
    log.error('C# executable not found at path:', csharpServerPath);
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
