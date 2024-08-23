class APIError extends Error
{
    constructor(responseStatus,message="Something went wrong",errors=[],stack="")
    {
        super(message);
        this.responseStatus=responseStatus;
        this.message=message;
        this.errors=errors;
        this.data=null;
        this.success=false;
        if(stack)
        {
            this.stack=stack;
        }
        else
        {
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export {APIError};