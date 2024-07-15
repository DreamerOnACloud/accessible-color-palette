function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function luminance(r, g, b) {
    const a = [r, g, b].map(function(v) {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1, rgb2) {
    const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function isAccessible(color) {
    const white = [255, 255, 255];
    const black = [0, 0, 0];
    const rgb = hexToRgb(color);
    return contrast(rgb, white) >= 4.5 && contrast(rgb, black) >= 4.5;
}

function generateAccessibleColor() {
    let color;
    do {
        color = getRandomColor();
    } while (!isAccessible(color));
    return color;
}

function generateColor() {
    const palette = document.getElementById('palette');
    palette.innerHTML = ''; // Clear existing color

    const color = generateAccessibleColor();
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;

    const colorText = document.createElement('span');
    colorText.innerText = color;
    colorBox.appendChild(colorText);

    colorBox.addEventListener('click', () => {
        navigator.clipboard.writeText(color);
        alert(`Copied: ${color}`);
    });

    palette.appendChild(colorBox);
}

document.getElementById('generate-palette').addEventListener('click', generateColor);

// Generate an initial color on load
generateColor();
