import { RegExpMap, PatternValidator, regex } from "@hgargg-0710/parsers.js"
import {
	SelectorHash,
	SelectorDot,
	Space,
	RectOp,
	RectCl,	
	DoubleColon,
	Colon,
	Plus,
	Child,
	OpBrack,
	ClBrack,
	EndsWithMatch,
	IncludesMatch,
	HyphenBeginMatch,
	PrefixMatch,
	FindMatch,
	EqMatch,
	Any,
	Namespace,
	Sibling,
	Quote,
	SelectorSymbol,
	Comma
} from "./tokens.mjs"

const { anything, space } = regex

export const selectorCharMap = RegExpMap(
	new Map([
		[/#/, SelectorHash],
		[/\./, SelectorDot],
		[space(), Space],
		[/\[/, RectOp],
		[/\]/, RectCl],
		[/::/, DoubleColon],
		[/:/, Colon],
		[/+/, Plus],
		[/>/, Child],
		[/\(/, OpBrack],
		[/)/, ClBrack],
		[/\$=/, EndsWithMatch],
		[/~=/, IncludesMatch],
		[/\|=/, HyphenBeginMatch],
		[/^=/, PrefixMatch],
		[/\*=/, FindMatch],
		[/=/, EqMatch],
		[/\*/, Any],
		[/\|/, Namespace],
		[/~/, Sibling],
		[/"|'/, Quote],
		[/,/, Comma],
		[anything(), SelectorSymbol]
	])
)

export const SelectorTokenizer = PatternValidator(selectorCharMap)
