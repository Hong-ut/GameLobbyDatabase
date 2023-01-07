const client = require('./connection.js')
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json())

app.listen(3300, () => {
    console.log("Sever is now listening at port 3300");
})

client.connect();

// const bodyParser = require("body-parser");
// app.use(bodyParser.json());

app.get('/users', (req, res) => {
    client.query("Select * from users", (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
})

app.post('/register', async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        // res.json(email);
        const newUser = await client.query("INSERT INTO users (email, colors) VALUES($1, ARRAY ['white', 'white', 'white', 'white'])", [email]);
        // INSERT INTO users (email, colors) VALUES(7594hsj@gmail.com, {white, white, white, white})
        res.json(newUser);
    } catch (err) {
        console.log(err);
    };
})

app.get('/getColors/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const curColors = await client.query("SELECT colors FROM users WHERE email = $1", [email]);
        console.log('Getting colors from the user with email:', email);
        const {colors} = curColors.rows[0]
        console.log(colors);
        res.json(colors);
    } catch (err) {
        console.log(err);
    }
})

//postColor
app.put("/postColors/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const { newColors } = req.body;
        const postColors = await client.query(
            "UPDATE users SET colors = $1 WHERE email = $2",
            [newColors, email]
        );
        res.json("Colors was updated!");
        console.log("Colors was updated successfully for the user with email: ", email)
    } catch (err) {
        console.log(err);
    }
})