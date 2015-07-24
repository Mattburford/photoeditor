class ImageUtils {

    static getCanvas(w, h) {
        var c = document.querySelector("canvas");
        c.width = w;
        c.height = h;
        return c;
    }

    static getPixels(img) {
        var c = ImageUtils.getCanvas(img.width, img.height);
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, c.width, c.height);
    }

    static putPixels(imageData, w, h) {
        var c = ImageUtils.getCanvas(w, h);
        var ctx = c.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
    }

    // new in module 3
    static fromImageData(imageData) {
        var width = imageData.width;
        var height = imageData.height;
        var data = imageData.data;

        var pixelGrid = initializePixelGrid(height);


        for (var y = 0; y < height; y++) {
            var row = (y * width * 4);

            for (var x = 0; x < width; x++) {
                var index = row + (x * 4);
                var rgba = new RGBA(data[index], data[index + 1], data[index + 2], data[index + 3]);
                pixelGrid[y][x] = rgba;
            }
        }
        return new ImageModel(height, width, pixelGrid);
    }

    // new in module 3
    static fromImgSrc(imgSrc) {
        var img = new Image();
        img.src = imgSrc;
        var data = ImageUtils.getPixels(img);
        return ImageUtils.fromImageData(data);
    }

    // new in module 3
    static toImageData(ImageModel) {

        console.log(ImageModel);
        var buffer = new ArrayBuffer(ImageModel.height * ImageModel.width * 4);

        var data = new Uint8ClampedArray(buffer);

        for (var y = 0; y < ImageModel.height; y++) {
            var row = (y * ImageModel.width * 4);

            for (var x = 0; x < ImageModel.width; x++) {
                var rgba = ImageModel.pixelGrid[y][x];

                var index = row + (x * 4);

                data[index] = rgba.red;
                data[index + 1] = rgba.green;
                data[index + 2] = rgba.blue;
                data[index + 3] = rgba.alpha;
            }
        }

        return new ImageData(data, ImageModel.width, ImageModel.height);
    }

    // new in module 3
    static drawImageModel(ImageModel) {
        var c = ImageUtils.getCanvas(ImageModel.width, ImageModel.height);
        var imageData = ImageUtils.toImageData(ImageModel);
        ImageUtils.putPixels(imageData, ImageModel.width, ImageModel.height);
    }

}

//function getRandomInt(min, max) {
 //   return Math.floor(Math.random() * (max - min + 1)) + min;
//}


class RGBA {
    constructor(redValue, greenValue, blueValue, alphaValue) {
        this.red = redValue;
        this.green = greenValue;
        this.blue = blueValue;
        this.alpha = alphaValue;
    }
}


class ImageModel {
    constructor(heightValue, widthValue, pixelGridValue) {
        this.height = heightValue;
        this.width = widthValue;
        if (pixelGridValue){
            this.pixelGrid = pixelGridValue;
        }
        else{
            console.log("here");
            this.pixelGrid=initializePixelGrid(heightValue);
        }
    }

}

// class definitions here

$(document).ready(function () {
    var img = new Image();
    img.src = "img/Golden.png";
    color();
    var pixels = initializePixelGrid(10);
pixels[0][0] = new RGBA(255, 0, 0, 255);
    var Golden = ImageUtils.fromImgSrc("img/Golden.png");
   ImageUtils.drawImageModel(grayscale(verticalMirror(Golden)))
   ;
});
function color() {
    var colorNames =
        [["red", "pink"],
            ["blue", "cyan"]];
    colorNames.push("red");
    colorNames.push("blue");
    console.log(colorNames[0][0]);
    console.log(colorNames[0][1]);
    console.log(colorNames[1][0]);
    console.log(colorNames[1][1]);
    var height = 5;
    var pixelGrid = [5];
    for (var y = 0; y < height; y++) {
        pixelGrid[y] = [5];
    }

}

function initializePixelGrid(height) {
    var pixelGrid = [];
    for (var y = 0; y < height; y++) {
        pixelGrid[y] = [];
    }
    return pixelGrid;
}




function verticalMirror(imageModel) {

    var mirrorImageModel = new ImageModel(imageModel.height, imageModel.width);

    for (var y = 0; y < imageModel.height; y++) {
        for (var x = 0; x < imageModel.width /2; x++) {
            var mirroredIndex = imageModel.width - 1 - x;
            mirrorImageModel.pixelGrid[y][x] = imageModel.pixelGrid[y][mirroredIndex];
            mirrorImageModel.pixelGrid[y][mirroredIndex] = imageModel.pixelGrid[y][x]
        }
    }

    return mirrorImageModel;
}

function grayscale(imageModel) {

    var grayscaleImageModel = new ImageModel(imageModel.height, imageModel.width);

    for (var y = 0; y < imageModel.height; y++) {
        for (var x = 0; x < imageModel.width; x++) {
            var rgba = imageModel.pixelGrid[y][x];
            var average = (rgba.red + rgba.green + rgba.blue) / 3;
            grayscaleImageModel.pixelGrid[y][x] =
                new RGBA(average, average, average, rgba.alpha);
        }
    }
    return grayscaleImageModel;
}
