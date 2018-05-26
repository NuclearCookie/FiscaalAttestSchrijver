const HummusRecipe = require('hummus-recipe');

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