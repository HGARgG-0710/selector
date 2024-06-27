import {
	BasicParser,
	PredicateMap,
	TokenSource,
	TypeMap,
	forward,
	read
} from "@hgargg-0710/parsers.js"
import { Escape, Space } from "../char/tokens.mjs"
import { Escaped } from "./tokens.mjs"

const readEscaped = read(
	(input, i) => !Space.is(input.curr()) && !Escape.is(input.curr()) && i < 6
)

export const escapedMap = TypeMap(PredicateMap)(
	new Map([
		[
			Escape,
			function (input) {
				input.next() // \
				return [
					Escape.is(input.curr()) || Space.is(input.curr())
						? Escaped(input.next())
						: readEscaped(input, TokenSource(Escaped(""))).value
				]
			}
		]
	]),
	forward
)
export const EscapeParser = BasicParser(escapedMap)
