const bcrypt = require('bcrypt');
const password = 'mysecure';
const saltRounds = 10;
const hashedpassword = '$2b$10$wCZwnF1X1F9z51vei0htnuvs7DkZ5qeAVFTp/iE.DZoGEhuht9Laq';


//bcrypt
//Hashing password
bcrypt.hash(password, saltRounds,(err,hash)=>{
    if(err)
    {
        console.log(err);
        return;
    }
    console.log(`Hashed Password: ${hash}`);
})

//compare hashPassword
bcrypt.compare('mysecure',hashedpassword,(err,result)=>{
    if(err)
    {
        console.log(err);
        return;
    }
    if(result)
    {
        console.log('Password MAtched');
    }
    else{
        console.log('invalid password');
    }
});


//Campare PAssword (Async/await)Promise

async function CamparePassword(){
    try{
        const result = await bcrypt.compare(password,hashedpassword);
    if(result)
    {
        console.log('Password Matched');
    }
    else{
        console.log('Password does not match');
    }
    }
    catch(err){
        console.log('error comapare password',err);
    }
}
CamparePassword();