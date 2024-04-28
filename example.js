const fs = require("fs");
const swf2png = require("./src/convert_swf.js");

// Path to the SWF file to process
const swfFilePath = "anna_div_gate.swf";

// Read the content of the SWF file
const rawData = fs.readFileSync(swfFilePath);

// Calling the function to create the spritesheet
swf2png(rawData)
    .then((spritesheet) => {
        // Save the spritesheet as a PNG file
        const outputFileName = "spritesheet.png";
        const out = fs.createWriteStream(outputFileName);
        const stream = spritesheet.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => console.log(`Spritesheet saved as ${outputFileName}.`));
    })
    .catch((error) => {
        console.error("An error occurred:", error);
    });
