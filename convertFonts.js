import ttf2woff2 from "ttf2woff2";
import fs from 'fs';

const filterFonts = (array, phrases) => array.filter((item) => phrases.includes(item.split('.')[1]));

const fontsPath = 'public/fonts';
const fonts = filterFonts(fs.readdirSync(fontsPath), ['ttf']);

fonts.forEach((fontName) => {
	console.log(`Конвертация: ${fontName}`)
	const input = fs.readFileSync(`${fontsPath}/${fontName}`);


	fs.writeFileSync(`${fontsPath}/${fontName.split('.')[0]}.woff2`, ttf2woff2(input));
	fs.unlinkSync(`${fontsPath}/${fontName}`);
});

let cssFile = '';
let jsCode = '';


filterFonts(fs.readdirSync(fontsPath), ['woff2']).forEach((font) => {
	const fileName = font.split('.')[0];

	const fontName = fileName.split('-')[0];
	const fontWeight = fileName.split('-')[1].toLowerCase();

	const fontWeightValue = () => {
		if (fontWeight.includes('thin')) return '100';
		if (fontWeight.includes('extralight')) return '200';
		if (fontWeight.includes('light')) return '300';
		if (fontWeight.includes('medium')) return '500';
		if (fontWeight.includes('semibold')) return '600';
		if (fontWeight.includes('bold')) return '700';
		if (fontWeight.includes('extrabold')) return '800';
		if (fontWeight.includes('black')) return '900';
		else return '400';
	}

	const fontStyleValue = () => {
		if (fontWeight.includes('italic')) return 'italic';
		else return 'normal';
	}

	cssFile = cssFile +
		`@font-face {\n\tfont-family: '${fontName}';\n\tsrc: url('/fonts/${font}') format('woff2');\n\tfont-weight: ${fontWeightValue()};\n\tfont-style: ${fontStyleValue()};\n}\n\n`
	jsCode = jsCode + `\nimport '/fonts/${font}';`;
});

fs.writeFileSync(`src/scss/fonts.scss`, cssFile);
console.log(jsCode);

// ttf2woff2()