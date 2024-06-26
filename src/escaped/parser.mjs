import { BasicParser, PredicateMap, TokenSource, TypeMap } from "@hgargg-0710/parsers.js"
import { Escape, SelectorSymbol } from "../char/tokens.mjs"

export const escapedMap = TypeMap(PredicateMap)(
	new Map([
		[
			Escape,
			function (input) {
				input.next() // \
				return [
					Escape.is(input.curr())
						? Token.value(input.curr())
						: read(
								(input) => SelectorSymbol.is(input.curr()),
								TokenSource("")
						  )(input)
				]
			}
		]
	]),
	(input) => [input.next()]
)
export const EscapeParser = BasicParser(escapedMap)
