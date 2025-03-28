const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  port: 3306,
  password: "",
  database: "felveteli"
});

app.get("/", (req,res) => {
  res.send("Szerver fut");
});

app.get("/tagozatok", (req,res) => {
  const sql = "SELECT akod,agazat,nyek FROM `tagozatok`";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/elozetes", (req,res) => {
  const sql = "SELECT diakok.nev, tagozatok.agazat, diakok.hozott + diakok.kpmagy + diakok.kpmat AS pont FROM jelentkezesek INNER JOIN diakok ON jelentkezesek.diak = diakok.oktazon INNER JOIN tagozatok ON jelentkezesek.hely = tagozatok.akod ORDER BY diakok.nev LIMIT 5;";
  db.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.json(result);
  });
});

app.get("/agazat/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT jelentkezesek.tag, diakok.nev, tagozatok.agazat, tagozatok.nyek, 
           diakok.hozott + diakok.kpmagy + diakok.kpmat AS pont 
    FROM jelentkezesek 
    INNER JOIN diakok ON jelentkezesek.diak = diakok.oktazon 
    INNER JOIN tagozatok ON jelentkezesek.hely = tagozatok.akod 
    WHERE jelentkezesek.hely = ? 
    ORDER BY diakok.nev;
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ error: err.message });
    return res.json(result);
  });
});

app.get("/agazatneve/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
  SELECT * FROM tagozatok WHERE akod = ?;
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ error: err.message });
    return res.json(result);
  });
});


const port = 3333;
app.listen(port, () => {
  console.log(`Fut a backend a ${port} porton!`);
});