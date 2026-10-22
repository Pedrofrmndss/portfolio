# CV en anglais

`cv.html` est la source du CV anglais (mise en page reprise du CV français).
Pour régénérer `public/media/cv/cv-pedro-firmino-en.pdf` après une modification :

1. `node brand/cv-en/server.mjs` (sert la page sur http://localhost:5197)
2. Dans un autre terminal : `node brand/cv-en/export.mjs public/media/cv/cv-pedro-firmino-en.pdf brand/cv-en/apercu.png`

L'export utilise Chrome sans fenêtre (chemin dans `export.mjs`).
