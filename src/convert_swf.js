const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const { readFromBufferP, extractImages } = require('swf-extract');

async function createSpritesheet(imagePromises) {
    let spriteWidth = 0;
    let spriteHeight = 0;
    for (const imagePromise of imagePromises) {
        const image = await loadImage(imagePromise.imgData);
        spriteWidth = Math.max(spriteWidth, image.width);
        spriteHeight = Math.max(spriteHeight, image.height);
    }

    const numImages = imagePromises.length;
    const imagesPerRow = Math.ceil(Math.sqrt(numImages));
    const spritesheetWidth = spriteWidth * imagesPerRow;
    const spritesheetHeight = spriteHeight * Math.ceil(numImages / imagesPerRow);

    const spritesheet = createCanvas(spritesheetWidth, spritesheetHeight);
    const ctx = spritesheet.getContext('2d');

    let posX = 0;
    let posY = 0;
    for (const imagePromise of imagePromises) {
        const image = await loadImage(imagePromise.imgData);
        ctx.drawImage(image, posX, posY);
        posX += spriteWidth;
        if (posX >= spritesheetWidth) {
            posX = 0;
            posY += spriteHeight;
        }
    }
    return spritesheet;
}

async function extractImagesFromSWF(rawData) {
    const swf = await readFromBufferP(rawData);
    return await Promise.all(extractImages(swf.tags));
}

async function swf2png(rawData) {
    // Extract images from the SWF file
    const imagePromises = await extractImagesFromSWF(rawData);

    // Return spritesheet from extracted images
    return await createSpritesheet(imagePromises);
}

module.exports = swf2png;
