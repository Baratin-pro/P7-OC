Rem installation de node_module dans le dossier back-end

CD back

CALL npm install
CALL npm install nodemon

Rem installation de node_module et d'Angular dans le dossier frontend

CD ../frontend/groupomania

CALL npm install
CALL npm install @angular/cli

Rem Supression du fichier installation.bat

DEL installation.bat