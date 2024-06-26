import { parse } from "../main.mjs"
import { writeFile } from "fs/promises"

const simpleTests = [
	".Abace\\KER",
	"#ad\\LOOLO fa\\\\",
	"#afadsio.culul",
	"#pa\\XE rarar:uoauoa",
	":ioa\\LEER x",
	"a",
	"h1",
	"img:xaei",
	"::before:focused",
	"*.ffda90",
	".KARKAR[x='Siegbrau!\"rolololo']",
	'.rhubab[Tower~="Feel no beginning and I feel no ee-e-e-ee-nd!"]',
	"&.arcticground:held"
]

writeFile("simple.json", JSON.stringify(simpleTests.map(parse)))

// const complexTests = [
// 	":RHUBAB      Sindarin",
// 	"RAF.Kili#Fili* | oin[Thorin|='Juli\"fda'] + Gloin[poup*='MARCH'] > Nori     Ori &",
// 	"AXE:is(sunborn:JACOB[R='rolololololololo'] rafrafraf, Kaukail|POPOP:has(Singularis, poropr:bark.toto, marauder:is(Nott:not(.good), bad)))"
// ]
// writeFile("complex.json", JSON.stringify(complexTests.map(parse)))
