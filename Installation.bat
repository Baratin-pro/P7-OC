Rem installation de node_module dans le dossier back-end

CD backend

CALL npm install
CALL npm i nodemon

Rem installation de node_module et d'Angular dans le dossier frontend

CD ../frontend/groupomania

CALL npm install
CALL npm i @angular/cli

Rem Supression du fichier installation.bat

DEL installation.bat