export function tempconv(tempname){
    return new Promise((res,rej)=>{
        fetch(tempname)
            .then(e=>{
                if(!e.ok){
                    rej(e.status + " " + e.statusText);
                }
                return e.text();
            })
            .then(e=>{
                let j;
                try{
                    j = JSON.parse(e)
                }
                catch{
                    rej("ファイル \"" + tempname + "\" は設定ファイル形式が間違っています。")
                }
                let ro = {name:[],base:[]};
                try{
                    j.forEach(e => {
                        ro.name.push(e.name);
                        ro.base.push(e.base);
                    });
                }
                catch{
                    rej("ファイル \"" + tempname + "\" は設定ファイル形式が間違っています。")
                }
                res(ro);
            }).catch(e=>{
                if(e === 4545){
                    return;
                }
                rej("ファイルを取得できませんでした。")
            })
    })
}