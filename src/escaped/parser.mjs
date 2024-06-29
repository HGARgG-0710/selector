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

// TODO: refactor into 'parsers.js'
export const isHex = (x) => /[a-fA-F0-9]/.test(x)

const readHex = read((input, i) => {
	if (i === 6) return false
	if (Space.is(input.curr())) {
		input.prev()
		if (isHex(input.next().value)) {
			input.next()
			if (isHex(input.curr().value) && input.curr().value !== "\\") input.next()
			input.prev()
		}
		return false
	}
	if (!isHex(input.curr().value)) return false
	return true
})

const readEscaped = read(1)

export const escapedMap = TypeMap(PredicateMap)(
	new Map([
		[
			Escape,
			function (input) {
				input.next() // \
				return [
					Escape.is(input.curr())
						? Escaped(input.next().value)
						: Space.is(input.curr())
						? Escaped(input.next())
						: (isHex(input.curr().value) ? readHex : readEscaped)(
								input,
								TokenSource(Escaped(""))
						  ).value
				]
			}
		]
	]),
	forward
)
export const EscapeParser = BasicParser(escapedMap)
