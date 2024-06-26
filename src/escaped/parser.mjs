import {
	BasicParser,
	PredicateMap,
	TokenSource,
	TypeMap,
	read
} from "@hgargg-0710/parsers.js"
import { Escape, Space } from "../char/tokens.mjs"

const readUntilSpace = read((input) => !Space.is(input.curr()))

export const escapedMap = TypeMap(PredicateMap)(
	new Map([
		[
			Escape,
			function (input) {
				input.next() // \
				return [
					Escape.is(input.curr())
						? Token.value(input.curr())
						: readUntilSpace(input, TokenSource(""))
				]
			}
		]
	]),
	(input) => [input.next()]
)
export const EscapeParser = BasicParser(escapedMap)
