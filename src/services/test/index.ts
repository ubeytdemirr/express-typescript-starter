import {Router,Request,Response,NextFunction} from "express";
const router = Router();
 
router.get("/",async(_req:Request,res:Response,_next:NextFunction)=>{
  
    res.send("test route is working")
})
export default router;