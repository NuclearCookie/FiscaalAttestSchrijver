# Genereer Fiscale attesten voor 102e FOS de Albatros

## Nodige documenten:

### `Resources/deelnemers.csv`:

ledenlijst van deelnemende kinderen aan zomerkamp 20xx.

* Dit vind je onder leden, filteren op evenement, ingeschreven en betaald.
* Exporteren als tabel
* Alles selecteren
* plakken in een nieuwe google sheet
* Downloaden als csv

### `Resources/categorie.csv`:

deelnemerslijst van het evenement "kamp".

* Dit vind je onder evenementen, zoek het juiste evenement
* selecteer DEELNEMERS, niet INSCHRIJVINGEN
* exporteren als tabel
* Alles selecteren
* plakken in een nieuwe google sheet
* Downloaden als csv

### `Resources/FiscaalAttest.pdf`

het fiscaal attest dat je krijgt van de gemeente.
Blanco behalve een FOS stempel onderaan.

### `Resources/email_config.json`

email en paswoord om emails naar de ouders mee te versturen.

Als je 2factor authentication gebruikt (code met je gsm, volg dan volgende stappen:)


> Preparational step (this step is required only if you are using two-step verrification)
> Configure application-specific passwords for your GMail account (if you are not using two-step verification, just skip this step and use same password you are using to login to GMail)

> To be able send emails using GMail from any application (including Node.js) you need to generate application-specific password to access GMail: [My Account](https://myaccount.google.com/) -> [Sign-in & security](https://myaccount.google.com/security) -> [Signing in to Google](https://myaccount.google.com/security#signin) -> [App passwords](https://security.google.com/settings/security/apppasswords?utm_source=OGB&pli=1)

> Select 'Other (Custom name)' in 'Select app'/'Select device' drop-downs, enter descriptive name for your application and device and press 'GENERATE'. Copy provided password.

## Testen

De gegenereerde documenten komen in de `Out/` folder terecht.

Best eerst 1 fiche testen om te zien of alle velden nog mooi ingevuld worden.

**:TODO: test methode**

Daarna best eens genereren zonder email te versturen

**:TODO: test methode**

Dan naar jezelf een email sturen

Dan pas naar alle ouders een mail sturen.