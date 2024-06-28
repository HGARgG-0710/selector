// % Encounterable tokens' types [tree construction]:
//  *	1. CombinatorToken (pair/single)
// 	*	2. CompoundSelector - collection
// 	*	3. PseudoClassSelector (:...)
// 	*	4. SelectorElement (...)
// 	*	5. SelectorId (#...)
// 	*	6. SelectorClass (.---)
// 	*	7. SelectorAttribute ([...?=...])
// 	*	8. PseudoElementSelector (::)
// 	*	9. UniversalSelector (*)
// 	*	10. ParentSelector (&)
// 	*	11. SelectorIdentifier (used for identifiers)
// 	*	12. IdentifierCharacters ("id-chars", component of `SelectorIdentifier`)
// 	*	13. Child (as a CombinatorToken's part)
// 	*	14. Space (as a CombinatorToken's part)
// 	*	15. Plus (as a CombinatorToken's part)
// 	*	16. Namespace (as a CombinatorToken's part)
// 	*	17. Sibling (as a CombinatorToken's part)
// 	*	18. EndsWithMatch (as "comparison" part of the SelectorAttribute)
// 	*	19. IncludesMatch (as "comparison" part of the SelectorAttribute)
// 	*	20. HyphenBegingMatch (as "comparison" part of the SelectorAttribute)
// 	*	21. PrefixMatch (as "comparison" part of the SelectorAttribute)
// 	*	22. FindMatch (as "comparison" part of the SelectorAttribute)
// 	*	23. EqMatch (as "comparison" part of the SelectorAttribute)
// 	*	24. SelectorString (as value part of the SelectorAttribute)
// 	*	25. StringCharacters (as part of the 'SelectorString')
// 	*	26. Escaped (as part of the `StringSelector` or `SelectorIdentifier`)
// 	*	27. SubSelector (bracketed expression '(...)', a sub-selector)
// 	!	28. SelectorList (a list of selectors '..., ..., ...')

import {
	PredicateMap,
	TypeMap,
	childrenCount,
	childIndex,
	TreeStream,
	miss
} from "@hgargg-0710/parsers.js"
import { CombinatorToken } from "./combinator/tokens.mjs"
import { CompoundSelector } from "./compound/tokens.mjs"
import {
	ParentSelector,
	PseudoClassSelector,
	PseudoElementSelector,
	SelectorAttribute,
	SelectorClass,
	SelectorElement,
	SelectorId,
	UniversalSelector
} from "./simple/tokens.mjs"

import { function as _f } from "@hgargg-0710/one"
import { IdentifierCharacters, SelectorIdentifier } from "./simple/identifier/tokens.mjs"
import { Child, EndsWithMatch, EqMatch, FindMatch, HyphenBeginMatch, IncludesMatch, Namespace, Plus, PrefixMatch, Sibling, Space } from "./char/tokens.mjs"
import { SelectorString, StringCharacters } from "./string/tokens.mjs"
import { Escaped } from "./escaped/tokens.mjs"
import { SubSelector } from "./bracket/tokens.mjs"
import { SelectorList } from "./list/tokens.mjs"

const { trivialCompose } = _f

// TODO: make an alias in 'parsers.js'
function selectorTree(tree) {
	tree.lastChild = childrenCount
	tree.index = childIndex
	return tree
}

export function SimpleTree(tree, treeTurner) {
	tree.value = treeTurner(tree.value)
	tree.children = function () {
		return [this.value]
	}
	return tree
}

export function ChildlessTree(tree) {
	tree.children = miss
	return tree
}

export function ValueTree(tree, treeTurner) {
	tree.value = tree.value.map(treeTurner)
	tree.children = function () {
		return this.value
	}
	return tree
}

// TODO: REFACTOR ALL THE FUNCTIONS FROM HERE!!! [takes up too much memory...]
export const selectorTreeMap = TypeMap(PredicateMap)(
	new Map(
		[
			[
				CombinatorToken,
				function (tree, treeTurner) {
					tree.value.combinator = treeTurner(tree.value.combinator)
					tree.value.args = treeTurner(tree.value.args)
					tree.children = function () {
						return ["combinator", "args"].map((x) => this.value[x])
					}
					return tree
				}
			],
			[CompoundSelector, ValueTree],
			[
				PseudoClassSelector,
				function (tree, treeTurner) {
					const areArgs = !!tree.args
					tree.name = treeTurner(tree.name)
					if (areArgs) tree.args = treeTurner(tree.args)
					tree.children = areArgs
						? function () {
								return ["name", "args"].map((x) => this.value[x])
						  }
						: function () {
								return [this.value.name]
						  }
					return tree
				}
			],
			[SelectorElement, SimpleTree],
			[SelectorId, SimpleTree],
			[SelectorClass, SimpleTree],
			[
				SelectorAttribute,
				function (tree, treeTurner) {
					const isComparison = !!tree.value.comparison
					tree.value.name = treeTurner(tree.value.name)
					if (isComparison) {
						tree.value.comparison = treeTurner(tree.value.comparison)
						tree.value.value = treeTurner(tree.value.value)
					}
					tree.children = isComparison
						? function () {
								return ["name", "comparison", "value"].map(
									(x) => this.value[x]
								)
						  }
						: function () {
								return [this.value.name]
						  }
					return tree
				}
			],
			[PseudoElementSelector, SimpleTree],
			[UniversalSelector, ChildlessTree],
			[ParentSelector, ChildlessTree],
			[SelectorIdentifier, ValueTree],
			[IdentifierCharacters, ChildlessTree],
			[Child, ChildlessTree],
			[Space, ChildlessTree], 
			[Plus, ChildlessTree], 
			[Namespace, ChildlessTree], 
			[Sibling, ChildlessTree], 
			[EndsWithMatch, ChildlessTree], 
			[IncludesMatch, ChildlessTree], 
			[HyphenBeginMatch, ChildlessTree], 
			[PrefixMatch, ChildlessTree], 
			[FindMatch, ChildlessTree], 
			[EqMatch, ChildlessTree], 
			[SelectorString, ValueTree], 
			[StringCharacters, ChildlessTree], 
			[Escaped, ChildlessTree], 
			[SubSelector, SimpleTree], 
			[SelectorList, ValueTree]
		].map(([Key, Funct]) => [Key, trivialCompose(selectorTree, Funct)])
	)
)

// todo: REFACTOR the generalization of this into 'parsers.js' v0.3; [allows to pass functional VARIATIONS of 'x' into both 'index' and the resulting functions themselves]
const tableFunction = (table, next = null) => {
	const T = (x) => table.index(x)(x, next || T)
	return T
}

export const SelectorTree = tableFunction(selectorTreeMap)
export const SelectorStream = trivialCompose(TreeStream, SelectorTree)

export default SelectorTree
