import {
	BasicParser,
	PredicateMap,
	TokenSource,
	TypeMap,
	read,
	Token
} from "@hgargg-0710/parsers.js"
import { Escape, Space } from "../char/tokens.mjs"
import { Escaped } from "./tokens.mjs"

const readUntilSpace = read((input) => !Space.is(input.curr()))

export const escapedMap = TypeMap(PredicateMap)(
	new Map([
		[
			Escape,
			function (input) {
				input.next() // \
				return [
					Escape.is(input.curr())
						? Escaped(Token.value(input.next()))
						: readUntilSpace(input, TokenSource(Escaped(""))).value
				]
			}
		]
	]),
	(input) => [input.next()]
)
export const EscapeParser = BasicParser(escapedMap)
