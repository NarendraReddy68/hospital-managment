const express = require("express");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");

const cors = require("cors");
const path = require("path");
const { request } = require("http");

const dbPath = path.join(__dirname, "data.db");

const app = express();

app.use(express.json());
app.use(cors());

let db;

const initializeDbAndServer = async () => {
    try{
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })
        app.listen(3000, () => {
            console.log("Server Running at http://localhost:3000/");
        })
    }
    catch(e){
        console.log(e.message)
        process.exit(1)
    }
}
initializeDbAndServer()


app.post("/adminHospital", async (request, response) => {
    const {hospName, loc} = request.body;
    
    try{
        const checkUser = `
            SELECT * FROM hospRegisteration
            WHERE hospName = ?
        `
        const res = await db.get(checkUser, [hospName]);

        if (res !== undefined){
            response.status(400);
            response.send("Hospital already exists");
        }
        else{
            const registerUser = `
            INSERT INTO hospRegisteration(hospName, loc)
            VALUES(?, ?);
        `
            await db.run(registerUser, [hospName, loc]);
            response.send("Successfully Registered");
        }
        
    }
    catch(e){
        response.send(e.message);
    }
})

app.post("/docRegist", async (request, response) => {
    const {docName, qualification, specialization} = request.body;
    
    try{
        const checkUser = `
            SELECT * FROM docRegisteration
            WHERE docName = ?
        `
        const res = await db.get(checkUser, [hospName]);

        if (res !== undefined){
            response.status(400);
            response.send("Doctor already exists");
        }
        else{
            const registerUser = `
            INSERT INTO docRegisteration(docName, qualification, specialization)
            VALUES(?, ?, ?);
        `
            await db.run(registerUser, [docName, qualification, specialization]);
            response.send("Successfully Registered");
        }
        
    }
    catch(e){
        response.send(e.message);
    }
})

app.get("/getHospitalsList", async (request, response) => {
    try{
        const query = `
            select * from hospRegisteration
        `
        const res = await db.all(query);
        response.send(res);

    }
    catch(e){
        response.send(e.message);
    }
})


