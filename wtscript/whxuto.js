(async()=>{
    //#region wtsetting.jsonの読み込み
    const wtsetting = "wtsetting.json";
    const wtsf = await fetch(wtsetting,{cache:"no-store"});
    if(!wtsf.ok){
        alert("Whxuto.js エラー: \"" + wtsetting + "\"にアクセスできません\n")
              return;
    }
    let wts = {};
    try{
        wts = JSON.parse(await wtsf.text());
    }
    catch{
        alert("Whxuto.js エラー: \"" + wtsetting + "\"の記述が不正です。")
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
        let res = "Whxuto.js エラー: \"" + wtsetting + "\"で以下の設定が欠如しています。\n";
        wep.forEach(e=>{
            res += e + "\n";
        });
        alert(res);
        return;
    }
    //#endregion

    //#region テンプレ読込
    const temp = import(wts.template.builder).then(e=>{
            e.tempconv(wts.template.file).then(b=>{
                template=b;
            }).catch(z=>{alert("テンプレートビルダーエラー: " + z);return 4545})});
    //#endregion

    //#region ページファイル読み込み
    const errpage = ":p:404 Not Found\n" + 
    ":p:ページファイルが存在しません。";
    let pf = [];
    let pfi = [];
    wts.pagestruct.forEach(e=>{
        let pass = e.default;
        if(e.id == "main"){
            let z = Object.fromEntries(new URLSearchParams(location.search));
            if(z.p != undefined){
                let f = wts.pagepath;
                pass = f.first + z.p + f.last;
            }
        }
        pf.push(fetch(pass).then(e=>{
            if(!e.ok) return errpage;
            return e.text();
        }).catch(e=>errpage));
        pfi.push(e.id);
    });
    //#endregion

    if(await temp === 4545) return; //テンプレ読込失敗してたら自滅

    
})();
let template = {base:[],name:[]};
function l(){
    
}