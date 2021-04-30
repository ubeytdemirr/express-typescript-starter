class ApiError  {
  code:number
  isOperational:boolean
  message:string
  constructor(code:number=500, message:string='An error occured',isOperational:boolean=true){
    this.code =code
    this.message=message;
    this.isOperational=isOperational||this.code===500
  }
}

export default ApiError
