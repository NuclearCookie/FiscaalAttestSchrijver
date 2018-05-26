// :TODO: SOMFonds. leden aan verlaagd tarief moeten aangepast document krijgen.

const HummusRecipe = require('hummus-recipe');
const csv_parse = require('csv-parse/lib/sync')
const fs = require('fs')
const moment = require('moment')

var send = require('gmail-send');

const deelnemers_lijst = fs.readFileSync("Resources/deelnemers.csv")
const categorie_lijst = fs.readFileSync("Resources/categorie.csv")
const email_config = fs.readFileSync("Resources/email_config.json")

send = send(JSON.parse(email_config));

const deelnemers = csv_parse(deelnemers_lijst, {columns:true});
const categorie = csv_parse(categorie_lijst, { columns: true });

var samengevoegde_lijst = [];

const start_kamp = moment("2017-07-19", "YYYY-MM-DD");
const start_bever_kamp = moment("2017-07-19", "YYYY-MM-DD");
const einde_kamp = moment("2017-07-29", "YYYY-MM-DD");
const einde_bever_kamp = moment("2017-07-24", "YYYY-MM-DD");

for( deelnemer of deelnemers ) {
    // zoek categorie van deze deelnemer
    if ( deelnemer ) {
        var lid = categorie.find((value, index, array) => {
            return deelnemer.VOORNAAM.toUpperCase() == value.VOORNAAM.toUpperCase() && deelnemer.FAMILIENAAM.toUpperCase() == value.FAMILIENAAM.toUpperCase();
        });
        if (!lid) {
            console.error("DIT LID WERD NIET GEVONDEN EN WAS NIET MEE OP KAMP!");
            console.error(deelnemer);
            process.exit(1);
        }

        if ( !deelnemer.GEBOORTEDATUM ) {
            console.error(`DEELNEMER ${deelnemer.VOORNAAM} ${deelnemer.FAMILIENAAM} heeft geen geboortedatum.`);
            process.exit(1);
        }
        const geboorte_datum = moment(deelnemer.GEBOORTEDATUM, "YYYY-MM-DD");
        if ( start_kamp.diff(geboorte_datum, 'year') < 12 ) {
            var extra_info = {};
            if ( lid.PRIJSCATEGORIE.toUpperCase() == "BEVERS" ) {
                extra_info.START_KAMP = start_bever_kamp;
                extra_info.EINDE_KAMP = einde_bever_kamp;
            } else {
                extra_info.START_KAMP = start_kamp;
                extra_info.EINDE_KAMP = einde_kamp;
            }
            extra_info.DAGEN = extra_info.EINDE_KAMP.diff(extra_info.START_KAMP, "days") + 1;
            // verjaart op kamp :TODO: nakijken wat de regeling hier rond is.

            // if ( einde_kamp.diff(geboorte_datum, 'year') == 12 ) {
            //     const dagen_plus_12 = einde_kamp.clone().subtract({years:12}).diff(geboorte_datum, 'days');
            //     extra_info.DAGEN -= dagen_plus_12 - 1;
            // }
            lid.BEDRAG = parseFloat(lid.BEDRAG.replace("€", ""));
            samengevoegde_lijst.push(Object.assign({}, deelnemer, lid, extra_info));
        } else {
            //console.log("Deelnemer was +12");
            //console.log(deelnemer);
        }
    }
}

console.log(samengevoegde_lijst);
const today = moment();

const email_body =
`Beste ouders,

Uw kind ging vorig jaar mee met ons op kamp als -12 jarige.
Hiervoor krijgt u in bijlage een fiscaal attest om bij uw belastingsaangifte te voegen.

Bij vragen, opmerkingen of foutieve data, gelieve mij een mailtje terug te sturen.

Met vriendelijke groeten,

De eenheidsleiding
eenheidsleiding@dealbatros.be
`

for( deelnemer of samengevoegde_lijst ) {
    // var deelnemer = {
    //     VOORNAAM : "Pieter",
    //     FAMILIENAAM : "Vantorre",
    //     GEBOORTEDATUM : "1995-05-29",
    //     START_KAMP: start_kamp,
    //     EINDE_KAMP: einde_kamp,
    //     DAGEN: 11,
    //     BEDRAG: 220,
    //     "E-MAIL": "***@gmail.com",
    //     "E-MAIL OUDER 1": "",
    //     "E-MAIL OUDER 2": ""
    // };

    const output_file = `Out/FiscaalAttest${today.format("YYYY")}_${deelnemer.VOORNAAM}_${deelnemer.FAMILIENAAM}.pdf`;
    const pdfDoc = new HummusRecipe('Resources/FiscaalAttest.pdf', output_file);

    pdfDoc
        .editPage(2)
        .text(`${deelnemer.FAMILIENAAM} ${deelnemer.VOORNAAM}`, 200, 175)
        .text(deelnemer.GEBOORTEDATUM, 190, 208)
        // .text(deelnemer.START_KAMP.format("DD"), 76, 266, { size: 10 })
        // .text(deelnemer.START_KAMP.format("MM"), 93, 266, { size: 10 })
        // .text(deelnemer.START_KAMP.format("YY"), 116, 266, { size: 10 })
        .text(deelnemer.EINDE_KAMP.format("DD"), 146, 266, { size: 10 })
        .text(deelnemer.EINDE_KAMP.format("MM"), 163, 266, { size: 10 })
        .text(deelnemer.EINDE_KAMP.format("YY"), 186, 266, { size: 10 })
        .text("" + deelnemer.DAGEN, 150, 315)
        //.text("" + deelnemer.BEDRAG / deelnemer.DAGEN, 130, 348)
        .text(deelnemer.BEDRAG, 175, 375)
        //.text("Knokke-Heist", 300, 432, { size: 8 })
        .text(today.format("DD"), 400, 432, { size: 8 })
        .text(today.format("MM"), 415, 432, { size: 8 })
        .endPage()
        // end and save
        .endPDF();

    send({
        subject: `[FOS] Fiscaal Attest kamp -12 voor ${deelnemer.VOORNAAM} ${deelnemer.FAMILIENAAM}`,
        to: [deelnemer["E-MAIL"], deelnemer["E-MAIL OUDER 1"], deelnemer["E-MAIL OUDER 2"]],
        text: email_body,
        files: [output_file]
    }, (err, res) => {
        console.log('* send() callback returned: err:', err, '; res:', res);
    });
}
