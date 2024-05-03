const express = require("express");
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

const dbconfig = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb',
};

(async () => {
    const connection = mysql.createConnection(dbconfig);
    connection.query('DROP TABLE IF EXISTS people');
    connection.query('CREATE TABLE people(id int not null auto_increment , name varchar(255), primary key(id));');
    connection.end();
})();

function getRandomName() {
    const names = [
        "Aurora",
        "Dante",
        "Eloá",
        "Ícaro",
        "Leônidas",
        "Naiara",
        "Quiteria",
        "Ubirajara",
        "Ximena",
        "Zacarias"
    ];
    return names[Math.floor(Math.random() * names.length)];
}

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    const connection = mysql.createConnection(dbconfig);
    try {
        const insertValues = { name: getRandomName() };
        connection.query(`INSERT INTO people SET ?`, insertValues);

        connection.query(`SELECT name FROM people`, (error, result) => {
            if (error) throw error;
            const nameList = result || [];
            const names = nameList.reduce((names, { name }) => names += (`<h4> - ${name}</h4>`), '');
            res.send(`
                <h1>Full Cycle Rocks!</h1>
                <h3>Lista de nomes cadastrada no banco de dados:</h3>
                ${names}
            `);
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.end();
    }
});

app.listen(port, () => {
    console.log(`App rodando internamente na porta ${port}`)
});