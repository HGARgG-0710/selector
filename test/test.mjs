import { parse } from "../main.mjs"
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

writeFile("simple.json", JSON.stringify(simpleTests.map(parse)))

const complexTests = [
	":RHUBAB      Sindarin[quan$=luni]",
	"RAF.Kili#Fili* | oin[Thorin|='Juli\"f\\ \\ALLFLAA \\nuda da'] + Gloin[poup*='MARCH'] > Nori     Ori &",
	"AXE:is(sunborn:JACOB[R='rolololololololo'] rafrafraf, Kaukail|POPOP:has(Singularis, poropr:bark.toto, marauder:is(Nott:not(.good), bad))) ~ ART:vandalay, ~ Regege:sinta saggaga* > &, + *.classed, &:sought",
	"arch:sought(nemesis.dingin)"
]
writeFile("complex.json", JSON.stringify(complexTests.map(parse)))
