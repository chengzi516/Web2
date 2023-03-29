function doStuff() {
    var flag=0;
    try{
        ap=aplayers[0];
        ap.list;
        flag=1;
    }catch{
        setTimeout(doStuff, 50);
        return;
    }
    if(flag){
      
        
        ap.list.remove(0);
        ap.lrc.hide();
        ap.setMode("normal");
        document.getElementsByClassName("aplayer-icon-menu")[0].click()
        if(localStorage.getItem("musicIndex")!=null){
            musicIndex = localStorage.getItem("musicIndex");
            ap.list.switch(musicIndex);
            //歌曲可以本地储存
        }
        if(sessionStorage.getItem("musicTime") != null){
            window.musict = sessionStorage.getItem("musicTime");
            ap.setMode(sessionStorage.getItem("musicMode"));
            if(sessionStorage.getItem("musicPaused")!='1'){
                ap.play();
            }
            var g=true;
            ap.on("canplay",function(){
                if(g){
                    ap.seek(window.musict);
                    g=false;
                }
            });
        }else{
            sessionStorage.setItem("musicPaused",1);
            ap.setMode("normal");
        }
        if(sessionStorage.getItem("musicVolume") != null){
            ap.audio.volume=Number(sessionStorage.getItem("musicVolume"));
        }
        ap.on("pause",function(){sessionStorage.setItem("musicPaused",1);ap.lrc.hide()});
        ap.on("play",function(){sessionStorage.setItem("musicPaused",0);ap.lrc.show()});
        ap.audio.onvolumechange=function(){sessionStorage.setItem("musicVolume",ap.audio.volume);};
        setInterval(function(){
            musicIndex = ap.list.index;
            musicTime = ap.audio.currentTime;
            localStorage.setItem("musicIndex",musicIndex);
            sessionStorage.setItem("musicTime",musicTime);
            sessionStorage.setItem("musicMode",ap.mode);
        },200);
    }
}
document.addEventListener('DOMContentLoaded', (e) => {
    doStuff();
})