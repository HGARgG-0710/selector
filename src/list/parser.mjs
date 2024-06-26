import { function as _f } from "@hgargg-0710/one"
import { StreamParser, limit, output } from "@hgargg-0710/parsers.js"
import { Comma } from "../char/tokens.mjs"
const { trivialCompose } = _f
export const SelectorCommaParser = StreamParser(
	trivialCompose(
		output,
		limit((input) => !Comma.is(input.curr()))
	)
)
