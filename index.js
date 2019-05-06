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

const start_kamp = moment("2018-07-21", "YYYY-MM-DD");
const start_bever_kamp = moment("2018-07-21", "YYYY-MM-DD");
const einde_kamp = moment("2018-07-31", "YYYY-MM-DD");
const einde_bever_kamp = moment("2018-07-26", "YYYY-MM-DD");

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
            lid.BEDRAG = parseFloat(lid.BEDRAG.replace("€", ""));
            extra_info.DAG_TARIEF = lid.BEDRAG / extra_info.DAGEN;
            // verjaart op kamp

            if ( einde_kamp.diff(geboorte_datum, 'year') == 12 ) {
                const dagen_plus_12 = einde_kamp.clone().subtract({years:12}).diff(geboorte_datum, 'days');
                extra_info.DAGEN -= ( dagen_plus_12 + 1 );
                lid.BEDRAG = extra_info.DAG_TARIEF * extra_info.DAGEN;
                extra_info.EINDE_KAMP = geboorte_datum;
            }
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
var count = 0;
for( deelnemer of samengevoegde_lijst ) {
    const output_file = `Out/FiscaalAttest${today.format("YYYY")}_${deelnemer.VOORNAAM}_${deelnemer.FAMILIENAAM}.pdf`;
    const tempPdfDoc = new HummusRecipe('Resources/FiscaalAttest.pdf', 'Temp/Generated.pdf',
    {
        version: 1.6,
        author: 'Pieter Vantorre',
        title: 'Fiscaal Attest',
        subject: 'Attest inzake uitgaven voor de opvang van kinderen van minder dan 12 jaar.'
    });

    const date_height = 286;
    const date_x = 120;

    ++count;

    tempPdfDoc
        .editPage(2)
        .text(`${count}`, 235, 157)
        .text(`${deelnemer.FAMILIENAAM} ${deelnemer.VOORNAAM}`, 95, 212)
        .text(deelnemer.GEBOORTEDATUM, 95, 240)
        .text(deelnemer.START_KAMP.format("DD"), date_x, date_height, { size: 10 })
        .text(deelnemer.START_KAMP.format("MM"), date_x + 20, date_height, { size: 10 })
        .text(deelnemer.START_KAMP.format("YY"), date_x + 50, date_height, { size: 10 })
        .text(deelnemer.EINDE_KAMP.format("DD"), date_x + 90, date_height, { size: 10 })
        .text(deelnemer.EINDE_KAMP.format("MM"), date_x + 110, date_height, { size: 10 })
        .text(deelnemer.EINDE_KAMP.format("YY"), date_x + 140, date_height, { size: 10 })
        .text("" + deelnemer.DAGEN, 95, 328)
        .text("" + deelnemer.DAG_TARIEF, 160, 344)
        .text(deelnemer.BEDRAG, 225, 358)
        .text("Knokke-Heist", 200, 391, { size: 9 })
        .text(today.format("DD"), 333, 391, { size: 9 })
        .text(today.format("MM"), 350, 391, { size: 9 })
        .text(today.format("YY"), 378, 391, { size: 9 })
        .text("Pieter Vantorre", 120, 405, { size: 12 })
        .text("Eenheidsleiding", 120, 420, { size: 12 })
        .text("102e FOS Open Scouting: de Albatros", 95, 568, { size: 12 })
        .text("Smedenstraat 125", 95, 582, { size: 12 })
        .text("8300 Knokke-Heist", 95, 596, { size: 12 })
        .endPage()
        // end and save

        .endPDF(() =>
        {
            const pdfDoc = new HummusRecipe('new', output_file);
            pdfDoc
                .appendPage("Temp/Generated.pdf")
                .endPDF(() =>
                {
                    // send({
                    //     subject: `[FOS] Fiscaal Attest kamp -12 voor ${deelnemer.VOORNAAM} ${deelnemer.FAMILIENAAM}`,
                    //     to: [deelnemer["E-MAIL"], deelnemer["E-MAIL OUDER 1"], deelnemer["E-MAIL OUDER 2"]],
                    //     text: email_body,
                    //     files: [output_file]
                    // }, (err, res) => {
                    //     console.log('* send() callback returned: err:', err, '; res:', res);
                    // });
                });
        });


}
