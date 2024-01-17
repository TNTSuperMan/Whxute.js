(async()=>{
    
    //#region wtsetting.jsonの読み込み
    let wtsf = await fetch("wtsetting.json");
    if(!wtsf.ok){
        alert("Whxuto.js エラー: wtsetting.jsonにアクセスできません\n" + 
              "HTTPステータス:" + wtsf.status + " " + wtsf.statusText)
              return;
    }
    let wts = {};
    try{
        wts = JSON.parse(await wtsf.text());
    }
    catch{
        alert("Whxuto.js エラー: wtsetting.jsonの記述が不正です。")
              return;
    }
    let wep = [];
    const wns = m => wep.push(m);
    if(wts.pagestruct == undefined) wns("pagestruct");
    if(wts.template == undefined) wns("template"); else{
        if(wts.template.builder == undefined) wns("template.builder");
        if(wts.template.file == undefined) wns("template.file");
    }
    if(wts.pagepath == undefined) wns("pagepath"); else{
        if(wts.pagepath.first == undefined) wns("pagepath.first");
        if(wts.pagepath.last == undefined) wns("pagepath.last");
    }
    
    if(wep.length != 0){
        let res = "wtsetting.jsonで以下の設定が欠如しています。\n";
        wep.forEach(e=>{
            res += e + "\n";
        });
        alert(res);
        return;
    }
    //#endregion

})();