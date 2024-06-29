import { generate, parse } from "../main.mjs"
import { writeFile } from "fs/promises"

const simpleTests = [
	".Abace\\KER fiddler",
	"#ad\\LOOLOKfa\\\\",
	"#afadsio.culul",
	"#pa\\XE rarar:uoauoa",
	":ioa\\LEER x",
	"a",
	"h1",
	"img:xaei",
	"::before:focused",
	"*.ffda90",
	".KARKAR[x^='Siegbrau!\"rolololo\\Kappa\\ Nurni\\RHUBY\\lololololol']",
	'.rhubab[Tower~="Feel no beginning and I feel no ee-e-e-ee-nd!"]',
	"&.arcticground:held",
	"x[IAMPRESENT]"
]

const parsedSimple = simpleTests.map(parse)

writeFile("simple.json", JSON.stringify(parsedSimple))

const complexTests = [
	":RHUBAB      Sindarin[quan$=luni]",
	"RAF.Kili#Fili* | oin[Thorin|='Juli\"f\\ \\ALLFLAA \\nuda da']+ Gloin[poup*='MARCH'] >Nori     Ori &",
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
