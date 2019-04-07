const Jimp = require("jimp")
Jimp.read(__dirname + "/img2.png").then(image => {
	const w =150; // the width of the image
	const h =60; // the height of the image
	image=image.resize(w, h)
	const data = image.bitmap.data; // a Buffer of the raw bitmap data
	let output=[]
	for(i=0;i<h;++i){
		output.push([])
		for(j=0;j<w;++j){
			output[i].push([])
			
			let pixel=getUnixColor(Jimp.intToRGBA(image.getPixelColor(j,i)))
			output[i][j]={}
			output[i][j].code=pixel.code
			output[i][j].character=pixel.character
			if(i>0 &&output[i][j].code!=0 &&output[i-1][j].code!=0&& output[i-1][j].code !== output[i][j].code && output[i-1][j].character!=='`' ){
				output[i][j].character='`'
			}
			if(output[i][j].character=="p"){
				console.log(Jimp.intToRGBA(image.getPixelColor(j,i)))
			}
		}
	}
	output.forEach(l=>{
		let line=""
		l.forEach(p=>line+='\033['+p.code+'m '+p.character)
		console.log(line)
	})
})
const colors = {
	Black: 	{code:30,character:"*"},
	Red: 	{code:31,character:"r"},
	Green: 	{code:32,character:"g"},
	Yellow: {code:33,character:"y"},
	Blue: 	{code:34,character:"b"},
	Purple: {code:35,character:"p"},
	Cyan: 	{code:36,character:"c"},
	White: 	{code:37,character:"w"},
	Default: {code:0,character:" "}
}
const conf={
	clrsDiff: 40, // difference between r,g & b to consider as grey 
	threshold:125,// black & white threshold
}
const getUnixColor = (rgba) => {
	let r=rgba.r,
		g=rgba.g,
		b=rgba.b,
		a=rgba.a
	if(a<1)
		return colors.Default
	let rgdiff =Math.abs(r-g)
	
	if(rgdiff<=conf.clrsDiff){
		let bdiff = conf.clrsDiff-rgdiff
		//Black and white	
		if(Math.abs(r-b)<=bdiff || Math.abs(g-b)<=bdiff)
			return  r>=conf.threshold ? colors.White : colors.Black
		else if(g>=b)
			return colors.Yellow
		else if(b-r<100 && g<150)
			return colors.Purple
		else
			return colors.Blue
	}
	else if (r>g && r>b ){
		if( r-g<conf.threshold)
			return colors.Yellow
		return colors.Red
		
	}
	else if (g>r && g>b)
		return colors.Green
	else if (b>r && b >g)
		return colors.Blue
	else if(g>=b)
		return colors.Yellow
	else
		return colors.Purple
	
	// other colors 
	return undefined
	}

// console.log(getUnixColor({r:122,g:123,b:130}));

/* 
	Text 	color	style		Code	Background color
*	Black	30		No effect	0		Black		40
*	Red		31		Bold		1		Red			41
*	Green	32		Underline	4		Green		42
*	Yellow	33		Blink		5		Yellow		43
*	Blue	34		Inverse		7		Blue		44
*	Purple	35		Hidden		8		Purple		45
	Cyan	36							Cyan		46
*	White	37							White		47
*/
/* 




*/