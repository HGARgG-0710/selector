import { parse } from "../main.mjs"
import { writeFile } from "fs/promises"

const simpleTests = [
	".Abace",
	"#adfa",
	"#afadsio.culul",
	"#pararar:uoauoa",
	":ioax",
	"a",
	"h1",
	"img:xaei",
	"::before:focused",
	"*.ffda90",
	".KARKAR[x='Siegbrau!\"rolololo']",	
	".rhubab[Tower~=\"Feel no beginning and I feel no ee-e-e-ee-nd!\"]"
]

writeFile("simple.json", JSON.stringify(simpleTests.map(parse)))
