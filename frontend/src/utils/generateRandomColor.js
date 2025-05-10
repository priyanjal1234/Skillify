// Function to generate a random HSL color
function getRandomColor() {
    const hue = Math.floor(Math.random() * 360); // Random hue (0-360)
    const saturation = Math.floor(Math.random() * 50) + 50; // 50% - 100% saturation
    const lightness = Math.floor(Math.random() * 30) + 40; // 40% - 70% lightness

    return { hue, saturation, lightness };
}

// Function to convert HSL to RGB
function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return `rgb(${Math.round(f(0) * 255)}, ${Math.round(
        f(8) * 255
    )}, ${Math.round(f(4) * 255)})`;
}

export { getRandomColor,hslToRgb }

// // Generate a random HSL color
// const randomColor = getRandomColor();
// console.log(`hsl(${randomColor.hue}, ${randomColor.saturation}%, ${randomColor.lightness}%)`);

// // Convert the random HSL color to RGB
// const rgbColor = hslToRgb(randomColor.hue, randomColor.saturation, randomColor.lightness);
// console.log(rgbColor);
