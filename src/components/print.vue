<template>
</template>
<script>
    //引入ipcRenderer对象,该对象和主线程的ipcMain通讯
    import { ipcRenderer } from 'electron';
    
    //渲染线程主动发送getPrinterList事件到主线程请求打印机列表
    ipcRenderer.send('getPrinterList'); 
    
    //监听主线程获取到打印机列表后的回调
      ipcRenderer.once('getPrinterList', (event, data) => {
        //data就是打印机列表
        this.printList = data;
      });
</script>