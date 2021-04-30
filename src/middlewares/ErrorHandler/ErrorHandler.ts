const errorHandler =(error,_req,res,_next) => {
  if(error&&!res.headersSent){
    res.status(error.code).send(error)
  }
}

export default errorHandler
