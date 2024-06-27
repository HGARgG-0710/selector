import { RegExpMap, PatternTokenizer, regex } from "@hgargg-0710/parsers.js"
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
	Comma,
	Ampersand,
	Escape
} from "./tokens.mjs"

const { anything, space, global } = regex

export const selectorCharMap = RegExpMap(
	new Map(
		[
			[/\\/, Escape],
			[space(), Space],
			[/#/, SelectorHash],
			[/\./, SelectorDot],
			[/\[/, RectOp],
			[/\]/, RectCl],
			[/::/, DoubleColon],
			[/:/, Colon],
			[/\+/, Plus],
			[/>/, Child],
			[/\(/, OpBrack],
			[/\)/, ClBrack],
			[/\$=/, EndsWithMatch],
			[/~=/, IncludesMatch],
			[/\|=/, HyphenBeginMatch],
			[/\^=/, PrefixMatch],
			[/\*=/, FindMatch],
			[/=/, EqMatch],
			[/\*/, Any],
			[/\|/, Namespace],
			[/~/, Sibling],
			[/"|'/, Quote],
			[/,/, Comma],
			[/&/, Ampersand],
			[anything(), SelectorSymbol]
		].map(([regexp, token]) => [global(regexp), token])
	)
)

export const SelectorTokenizer = PatternTokenizer(selectorCharMap)
