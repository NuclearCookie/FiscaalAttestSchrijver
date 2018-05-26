const HummusRecipe = require('hummus-recipe');
const csv_parse = require('csv-parse/lib/sync')
const fs = require('fs')

const deelnemers_lijst = fs.readFileSync("Resources/deelnemers.csv")
const categorie_lijst = fs.readFileSync("Resources/categorie.csv")

const deelnemers = csv_parse(deelnemers_lijst, {columns:true});
const categorie = csv_parse(categorie_lijst, { columns: true });

var samengevoegde_lijst = [];

for( deelnemer of deelnemers ) {
    // zoek categorie van deze deelnemer
    if ( deelnemer ) {
        var lid = categorie.find((value, index, array) => {
            return deelnemer.VOORNAAM.toUpperCase() == value.VOORNAAM.toUpperCase() && deelnemer.FAMILIENAAM.toUpperCase() == value.FAMILIENAAM.toUpperCase();
        });
        if (!lid) {
            console.error("DIT LID WERD NIET GEVONDEN EN WAS NIET MEE OP KAMP!");
            console.error(deelnemer);
            exit(1);
        }

        samengevoegde_lijst.push(Object.assign({}, deelnemer, lid));
    }
}

console.log(samengevoegde_lijst);

for ( deelnemer of samengevoegde_lijst ) {

}
const pdfDoc = new HummusRecipe('Resources/FiscaalAttest2018.pdf', 'Out/FiscaalAttest2018_out.pdf');

pdfDoc
    .editPage(2)
    .text('Vantorre Pieter', 200, 175)
    .text('06/04/1997', 190, 208)
    .text('29', 146, 266, { size: 10 })
    .text('07', 163, 266, { size: 10 })
    .text('17', 186, 266, { size: 10 })
    .text('10', 150, 315)
    .text('220', 175, 375)
    .text('26', 400, 432, { size: 8 })
    .text('05', 415, 432, { size: 8 })
    .endPage()
    // end and save
    .endPDF();