//引入electron
import electron from 'electron';

//创建一个浏览器对象
const window = new electron.BrowserWindow({
    width,
    height,
    frame: false,
    show: false,
    backgroundColor: '#4b5b79',
    minWidth: 1024,
    minHeight: 768,
    webPreferences: { webSecurity: false },
  });
  console.log(window);
//在主线程下，通过ipcMain对象监听渲染线程传过来的getPrinterList事件
electron.ipcMain.on('getPrinterList', (event) => {
    //主线程获取打印机列表
    const list = window.webContents.getPrinters();
    
    //通过webContents发送事件到渲染线程，同时将打印机列表也传过去
    window.webContents.send('getPrinterList', list);
});