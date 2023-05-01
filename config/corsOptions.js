const whitelist = ['https://dazzling-snickerdoodle-777101.netlify.app/', 'http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback)=>{
        if(whitelist.indexOf(origin) !== -1 || !origin){ //If domain is in whitelist
            callback(null, true); 
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;
