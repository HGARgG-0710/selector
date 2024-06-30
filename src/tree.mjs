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
import {
	Child,
	EndsWithMatch,
	EqMatch,
	FindMatch,
	HyphenBeginMatch,
	IncludesMatch,
	Namespace,
	Plus,
	PrefixMatch,
	Sibling,
	Space
} from "./char/tokens.mjs"
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

export function AttributeTree(tree, treeTurner) {
	const isComparison = !!tree.value.comparison
	tree.value.name = treeTurner(tree.value.name)
	if (isComparison) {
		tree.value.comparison = treeTurner(tree.value.comparison)
		tree.value.value = treeTurner(tree.value.value)
	}
	tree.children = isComparison
		? function () {
				return ["name", "comparison", "value"].map((x) => this.value[x])
		  }
		: function () {
				return [this.value.name]
		  }
	return tree
}

export function CombinatorTree(tree, treeTurner) {
	tree.value.combinator = treeTurner(tree.value.combinator)
	tree.value.args = tree.value.args.map(treeTurner)
	selectorTree(tree.value.args)
	tree.value.args.children = function () {
		return this
	}
	tree.children = function () {
		return ["combinator", "args"].map((x) => this.value[x])
	}
	return tree
}

export function PseudoClassTree(tree, treeTurner) {
	const areArgs = !!tree.value.args
	tree.value.name = treeTurner(tree.value.name)
	if (areArgs) tree.value.args = treeTurner(tree.value.args)
	tree.children = areArgs
		? function () {
				return ["name", "args"].map((x) => this.value[x])
		  }
		: function () {
				return [this.value.name]
		  }
	return tree
}

export const treeMap = TypeMap(PredicateMap)(
	new Map(
		[
			[CombinatorToken, CombinatorTree],
			[CompoundSelector, ValueTree],
			[PseudoClassSelector, PseudoClassTree],
			[SelectorElement, SimpleTree],
			[SelectorId, SimpleTree],
			[SelectorClass, SimpleTree],
			[SelectorAttribute, AttributeTree],
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

export const SelectorTree = tableFunction(treeMap)
export const SelectorStream = trivialCompose(
	TreeStream,
	(x) => {
		const newTree = { value: x }
		newTree.children = function () {
			return [this.value]
		}
		selectorTree(newTree)
		return newTree
	},
	SelectorTree
)

export default SelectorTree
