const port = '27017';
let uri;
if(process.env.MONGO!=null)
uri = `mongodb://`+process.env.MONGO+`:${port}`+"/EetacTimeBank";
else
uri = `mongodb://localhost:${port}`+"/EetacTimeBank";
module.exports = uri