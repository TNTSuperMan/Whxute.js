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
                    rej("File \"" + tempname + "\" is not valid Setting File")
                }
                let ro = {name:[],base:[]};
                try{
                    j.forEach(e => {
                        ro.name.push(e.name);
                        ro.base.push(e.base);
                    });
                }
                catch{
                    rej("File \"" + tempname + "\" is not valid Setting File")
                }
                res(ro);
            }).catch(e=>{
                if(e === 4545){
                    return;
                }
                rej("Fetch error occured")
            })
    })
}