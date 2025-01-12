const asyncHanlder=(reqHanlder)=>{
    return (req,res,next)=>{
        Promise.resolve(reqHanlder(req,res,next))
        .catch((err)=>next(err))
    }
}
export {asyncHanlder}