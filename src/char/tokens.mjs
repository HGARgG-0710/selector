import { TokenType } from "@hgargg-0710/parsers.js"

// ! REPLACE 'TokenType' with 'TokenInstance' to save memory when it comes down to it...
export const [
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
	Comma, 
	Ampersand, 
	Escape, 
	SelectorSymbol
] = [
	"hash",
	"dot",
	"space",
	"rop",
	"rcl",
	"double-colon",
	"colon",
	"plus",
	"child",
	"opbrack",
	"clbrack",
	"endswith",
	"includes",
	"hyphbeg",
	"prefix",
	"find",
	"eq",
	"any",
	"namespace",
	"sibling",
	"quote",
	"comma",
	"ampersand", 
	"escape",
	"symbol"
].map(TokenType)
