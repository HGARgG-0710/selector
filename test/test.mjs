import { generate, parse, generator, parser, tokens, tree } from "../main.mjs"
import { writeFile } from "fs/promises"

const simpleTests = [
	".Abace\\KER\\fiddler",
	"#ad\\LOOLOKfa\\\\",
	"#afadsio.culul",
	"#pa\\E Erarar:uoauoa",
	":ioa\\EERx",
	"a",
	"h1",
	"img:xaei",
	"::before:focused",
	"*.ffda90",
	".KARKAR[x^='Siegbrau!\"rolololo\\aalpa\\ Nurni\\RHUBY\\aeaeaeaeaea']",
	'.rhubab[Tower~="Feel no beginning and I feel no ee-e-e-ee-nd!"]',
	"&.arcticground:held",
	"x[IAMPRESENT]"
]

const parsedSimple = simpleTests.map(parse)

writeFile("simple.json", JSON.stringify(parsedSimple))

const complexTests = [
	":RHUBAB      Sindarin[quan$=luni]",
	"\\99 \\99E.s.n.RAF\\K.Kili#Fili* | oin[Thorin|='Juli\"f\\ \\A01FeAA \\90ed da']+ Gloin[poup*='MARCH'] >Nori     Ori &",
	"AXE:is(sunborn:JACOB[R='rolololololololo'] rafrafraf, Kaukail|POPOP:has(Singularis, poropr:bark.toto, marauder:is(Nott:not(.good), bad))) ~ ART:vandalay, ~ Regege:sinta saggaga* > &, + *.classed, &:sought",
	"arch:sought(nemesis.dingin)"
]

const parsedComplex = complexTests.map(parse)

writeFile("complex.json", JSON.stringify(parsedComplex))

writeFile(
	"out.json",
	JSON.stringify({
		simple: parsedSimple.map(generate),
		complex: parsedComplex.map(generate)
	})
)

console.log(generator)
console.log(parser)
console.log(tokens)
console.log(tree)
