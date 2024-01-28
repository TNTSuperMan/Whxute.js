(async()=>{
    //#region wtsetting.jsonの読み込み
    const err=e=>{alert("Whxute.js エラー：" + e);throw e};
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
        err("\"" + wtsetting + "\"の記述が不正です。");
    }
    let wep = [];
    const wns = m => wep.push(m);
    if(wts.pagestruct == undefined) wns("pagestruct");
    if(wts.tempfile == undefined) wns("tempfile"); 
    if(wts.pagepath == undefined) wns("pagepath"); else{
        if(wts.pagepath.first == undefined) wns("pagepath.first");
        if(wts.pagepath.last == undefined) wns("pagepath.last");
    }
    
    if(wep.length != 0){
        let res = "\"" + wtsetting + "\"で以下の設定が欠如しています。\n";
        wep.forEach(e=>{
            res += e + "\n";
        });
        err(res);
    }
    //#endregion

    //#region テンプレ読込
    const temp = fetch(wts.tempfile,{cache:"no-store"})
        .then(e=>e.ok ? e.text() : 1919)
        .then(e=>{
            if(e===1919) throw 1919;
            const rto = JSON.parse(e);
            let ret = {base:[],name:[]};
            rto.forEach(e=>ret.base.push(e.base)?ret.name.push(e.name):0);
            return ret;
            }).catch(e=>e===1919?1919:4545);
    //#endregion

    //#region ページファイル読み込み
    const errpage = ":p:404 Not Found\n" + 
    ":p:ページファイルが存在しません。";
    let pf = [];
    let pfe = [];
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
        let pe = document.createElement(e.ename);
        if(e.attr)e.attr.forEach(v=>pe.setAttribute(v.name,v.value));
        document.body.appendChild(pe);
        pfe.push(pe);
        pf.push(fetch(pass).then(e=>{
            if(!e.ok) return errpage;
            return e.text();
        }).catch(e=>errpage));
        pfi.push(e.id);
    });
    //#endregion

    //テンプレのエラー選別
    switch(await temp){
        case 1919:err("テンプレートファイル\"" + wts.tempfile + "\"にアクセスできません");
        case 4545:err("テンプレートファイル\"" + wts.tempfile + "\"の記述が不正です");
        default:template = await temp;
    }

    //#region ページ構築
    Promise.all(pf).then(de=>pfe.forEach((ee,i)=>Whxute(de[i],ee)));
    //#endregion
})();
let template = {base:[],name:[]};
let me;
function l(id){
    
}
function Whxute(c,e){
    let o = [e];
    let se = null;
    let pmode = false;
    const no = e=>o[o.length-1];
    c.split("\r").join('').split("\n").forEach((p,i)=>{
        switch(p[0]){
            case '/': //P Plain Text
                se=null;
                if(!pmode){
                    let pe = document.createElement("p");
                    no().appendChild(pe);
                    o.push(pe);
                    pmode = true;
                } else no().innerHTML += "<br>";
                let t = p.split(""); t[0]=null;
                no().innerHTML += t.join("");
                break;
            case ':': //Element
                if(pmode){o.pop();pmode = false}
                let r = p.split(":");
                if(r.length < 3) break;
                let ne = document.createElement(r[1]);
                ne.innerHTML = r[2];
                se = ne;
                no().appendChild(ne);
                break;
            case '=': //Element attribute
                if(!se) break;
                let ar = p.split('=');
                if(ar.length < 3) break;
                se.setAttribute(ar[1],ar[2]);
                break;
            case '\\'://Template
                se=null;
                if(pmode){o.pop();pmode = false}
                let tr = p.split("\\");
                if(tr.length < 2) break;
                let ti = template.name.indexOf(tr[1]);
                if(ti<0)break;
                let tt = template.base[ti];
                tr.forEach((k,i)=>{
                    if(i < 2) return;
                    tt=tt.replace("%"+(i-1),k);
                })
                Whxute(tt,no());
                break;
            case '&': //Native output
                se=null;
                if(pmode){o.pop();pmode = false}
                let nt = p.split(""); nt[0]=null;
                no().innerHTML += nt.join("");
                break;
        }
    });
}