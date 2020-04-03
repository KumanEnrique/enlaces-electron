const {app,BrowserWindow} = require("electron")
const url = require('url')
const path = require('path')

if(process.env.NODE_ENV !== 'production'){
	require('electron-reload')(__dirname,{
		electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
	})
}

let mainWindow;
app.on("ready",()=>{
    mainWindow = new BrowserWindow({
		titleBarStyle: 'hidden-inset',
		webPreferences:{
			nodeIntegration:true
		}
    });
    mainWindow.loadURL(url.format({
		pathname:path.join(__dirname,'static/index.html'),
		protocol:"file",
		slashes:true
	}));
	mainWindow.on("closed",()=>{
		app.quit()
	})
    
})