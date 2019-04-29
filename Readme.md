# Genereer Fiscale attesten voor 102e FOS de Albatros

## Configuratie:
In index.js pas je de start en eind data aan van de kampen:

```
const start_kamp = moment("2017-07-19", "YYYY-MM-DD");
const start_bever_kamp = moment("2017-07-19", "YYYY-MM-DD");
const einde_kamp = moment("2017-07-29", "YYYY-MM-DD");
const einde_bever_kamp = moment("2017-07-24", "YYYY-MM-DD");
```

Onderaan staat ook de `send` methode. Deze haal je uit commentaar om de emails naar ouders te versturen. 

In de `pdfdoc` functie zal je mogelijks ook de offsets van elk veld moeten aanpassen, afhankelijk van de scan, en de financieel verantwoordelijke zal je ook moeten aanpassen.

## Nodige documenten:

### `Resources/deelnemers.csv`:

ledenlijst van deelnemende kinderen aan zomerkamp 20xx.

* Dit vind je onder leden, filteren op evenement, ingeschreven en betaald.
* Exporteren als tabel
* Alles selecteren
* plakken in een nieuwe google sheet
* Categorieën verwijderen (samengevoegde cellen)
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


## Genereren

Run `node index.js`

## Testen

De gegenereerde documenten komen in de `Out/` folder terecht.

Best eerst 1 fiche testen om te zien of alle velden nog mooi ingevuld worden.

**:TODO: test methode**

Daarna best eens genereren zonder email te versturen

**:TODO: test methode**

Dan naar jezelf een email sturen

Dan pas naar alle ouders een mail sturen.