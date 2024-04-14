# Collectio

Projet nodejs avec Angular en Front et Express en Back. La BDD est mangoDB à l'adresse mongodb://localhost:27017

créer une bdd nommé "collectio"

Pour les droits de suppression et modification de données, ajouter un user avec les droits dans mongosh
db.createUser({
user: "meli",
pwd: "admin",
roles: [{ role: "readWrite", db: "collectio" }]
})

## Démarrer le projet

- dans un terminal (si windows, faire touche Windows+R puis taper "cmd") lancer : `mangosh`
- - astuce : si besoin de modifier facilement la BDD, utiliser l'interface du logiciel "MongoDB Compass", puis cliquer sur "connect"
- rentrer dans le dossier back puis `npm i` + `npm ci` + `npm run start` = http://localhost:3000/elements
- rentrer dans le dossier front puis `npm i` + `npm ci` + `npm run start` = http://localhost:4200
- donc, RDV à l'adresse http://localhost:4200 pour voir le site Collectio !
