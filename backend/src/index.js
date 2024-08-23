import { connectDB } from "./db/dbConnect.js";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({
    path:'/env',
});

connectDB().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is listening at https://localhost:${process.env.PORT}`);
    })
    app.on("error",(err)=>{
        console.error("Error!!!",err);
    })
}).catch((err)=>{
    console.log("Error in database connection",err);
})








/*import dotenv from "dotenv";
dotenv.config();

const app=express();

;(async function connect_db()
{
    try
    {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error",(error)=>{
            console.error("Error",err);
        });
        app.listen(process.env.PORT,()=>{
            console.log(`Server is listening at https://localhost:${process.env.PORT}`);
        })
    }
    catch(err)
    {
        console.error("Error,",err);
    }
})();*/