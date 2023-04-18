const express = require('express')
const cookieParser = require('cookie-parser');
const app = express();
const bcrypt = require("bcryptjs");
const fs = require("fs");
const sqlite3 = require('sqlite3').verbose();
const querystring = require('querystring');
const handlebars = require('handlebars');
const {FORMAT} = require("sqlite3");
const sprintf = require('sprintf-js').sprintf

// Configure la clé secrète utilisée pour signer les cookies
app.use(cookieParser());


app.get("/register", function (req, res) {
    fs.readFile('./frontend/HTML/register.html', null, (error, data) => {
        if (error) {
            res.end('fill have error')
        } else {
            res.end(data)
        }
    })
});

app.post("/api/register", function (req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const formData = querystring.parse(body);
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(formData.password, salt, (err, hash) => {
                if (err) {
                    res.status(500).send({msg: "internal server error"});
                    return;
                }
                db.run(`INSERT INTO user(email, pseudo, password, level, time, record, skin) VALUES(?, ?, ?, ?, ?, ?, ?)`, [formData.email, formData.pseudo, hash, 0, 0, 0, 0], function (err) {
                    if (err) {
                        throw err;
                    }
                });
                // Temps en secondes avant la redirection
                const countdown = 5;

                // Envoi de la réponse HTML avec le compte à rebours
                res.send(`
                <html>
      <head>
        <meta http-equiv="refresh" content="${countdown};URL='http://localhost:3000/'" />
      </head>
      <body>
        <p>Redirection vers l'accueil dans ${countdown} secondes...</p>
      </body>
    </html>
                `);
            }));
    })
});

app.get("/login", function (req, res) {
    fs.readFile('./frontend/HTML/login.html', null, (error, data) => {
        if (error) {
            res.end('fill have error')
        } else {
            res.end(data)
        }
    })
});

app.post("/api/login", function (req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const formData = querystring.parse(body);
        db.get(`SELECT * FROM user WHERE email = ?`, [formData.email], (err, row) => {
            if (err) {
                throw err;
            }
            if (row === undefined) {
                res.status(401).send({msg: "email or password is incorrect"});
                return;
            }
            bcrypt.compare(formData.password, row.password, (err, result) => {
                if (err) {
                    res.status(500).send({msg: "internal server error"});
                    return;
                }
                if (result) {
                    res.cookie('utilisateur', 'connecté', {httpOnly: true, secure: true})
                    res.cookie('pseudo', row.pseudo, {httpOnly: true, secure: true});
                    res.redirect('/user');
                } else {
                    res.status(401).send({msg: "email or password is incorrect"});
                }
            });
        });
    })
});

app.post("/api/img", function (req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const formData = querystring.parse(body);
        db.run("UPDATE user SET img = ? WHERE pseudo = ?", [formData.img, req.cookies.pseudo], function (err) {
            if (err) {
                throw err;
            }
        });
        res.redirect('/user');
    })
});

app.post("/api/skin", function (req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const formData = querystring.parse(body);
        db.run("UPDATE user SET skin = ? WHERE pseudo = ?", [formData.skin, req.cookies.pseudo], function (err) {
            if (err) {
                throw err;
            }
        });
        res.redirect('/user');
    })
});

app.get("/user", function (req, res) { // Chemin vers l'image
    // Vérifier si l'utilisateur est connecté en vérifiant la présence du cookie
    if (req.cookies.utilisateur === 'connecté') {
        const template = fs.readFileSync('user.hbs', 'utf-8');
        const compiledTemplate = handlebars.compile(template);

        db.get(`SELECT * FROM user WHERE pseudo = ?`, [req.cookies.pseudo], (err, row) => {
            if (err) {
                throw err;
            }
            const data = {
                pseudo: req.cookies.pseudo,
                img: row.img,
                record: row.record,
                time: row.time,
                level: row.level,
                skin: row.skin
            };
            const html = compiledTemplate(data);
            res.send(html);
        });
    } else {
        res.send('Vous devez être connecté pour accéder à cette page.');
    }

});

app.get("/", function (req, res) {
    fs.readFile('./frontend/HTML/accueil.html', null, (error, data) => {
        if (error) {
            res.end('fill have error')
        } else {
            res.end(data)
        }
    })
});

/*
-----------------------------------------------------------------
	Link with Database
-----------------------------------------------------------------
*/

const db = new sqlite3.Database('./db.db', (error) => {
    if (error) {
        console.error(error.message);
    }
    console.log('Connecté à la base de données SQLite3.');
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Serveur démarré sur le port 3000: ' + 'http://localhost:' + (process.env.PORT || 3000));
});