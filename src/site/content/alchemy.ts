/**
 * iGEM Alchemy: the Education subteam's combination game, as data.
 *
 * This is the team's design (HP iGEM Little Alchemy, October 2026): four
 * levels, their elements, their descriptions word for word, their recipes.
 * The game works like Little Alchemy: drag things onto each other and they
 * combine. Only two things were changed, because the game could not be
 * finished otherwise:
 *
 * - Level 3 (animal cell) needs Water and Enzyme, which the outline only
 *   makes in Level 4. Level 3 starts with both, as the Web Dev prototype did.
 * - "Any 2 organelles = Cell function" is spelled out as every pair of
 *   organelles, so a nucleus dropped on a mitochondria counts.
 *
 * A recipe learned in one level keeps working in the levels after it (see
 * `recipesFor`), so Carbon and Hydrogen still make a side chain in level 3.
 *
 * To edit copy, change `description`. To change the game, edit a level's
 * `recipes`. A recipe can have two or three inputs. The dev console says if
 * a level can no longer be finished.
 */

export interface Element {
  id: string
  name: string
  description: string
}

export interface Recipe {
  inputs: string[]
  makes: string
}

export interface Level {
  id: string
  name: string
  /** A few words under the name. */
  tagline: string
  /** What the player must make to finish the level. All of them. */
  goals: string[]
  /** What is in the sidebar at the start. */
  starters: string[]
  recipes: Recipe[]
}

const r = (makes: string, ...inputs: string[]): Recipe => ({ inputs, makes })

export const ELEMENTS: Element[] = [
  { id: 'carbon', name: 'Carbon', description: 'The backbone of almost all life on Earth.' },
  { id: 'hydrogen', name: 'Hydrogen', description: 'The smallest and most abundant element in the universe.' },
  { id: 'oxygen', name: 'Oxygen', description: 'A highly reactive, colorless gas essential for life.' },
  { id: 'nitrogen', name: 'Nitrogen', description: 'Makes up 78% of the air you breathe, but prefers to stay paired with itself rather than react.' },
  { id: 'hydroxyl', name: 'Hydroxyl group', description: 'A functional group that makes molecules water-friendly by attaching an oxygen and a hydrogen.' },
  { id: 'carboxyl', name: 'Carboxyl group', description: 'A functional group found in amino acids used in many metabolic processes.' },
  { id: 'amine', name: 'Amine group', description: 'A functional group containing nitrogen and hydrogen, found in allergy medications and synthetic dyes.' },
  { id: 'side-chain', name: 'Side chain', description: 'The variable region of an amino acid that determines its chemical properties and behavior.' },
  { id: 'amino-acid', name: 'Amino acid', description: 'A small molecule with an amine group, a carboxyl group, and a side chain that links together to build proteins.' },
  { id: 'protein', name: 'Protein', description: 'A folded chain of amino acids that serves as the molecular machinery of the cell. Some functions include structural regulation, metabolic regulation, and transportation.' },
  { id: 'phosphorus', name: 'Phosphorus', description: 'Extremely versatile, and perfect for storing and transferring energy.' },
  { id: 'deoxyribose', name: 'Deoxyribose sugar', description: 'A five-carbon sugar that lacks a hydroxyl group, making it more stable. A fundamental building block of DNA.' },
  { id: 'phosphate', name: 'Phosphate group', description: 'A phosphorus atom bonded to four oxygens that cells use to store and transfer energy. A fundamental building block of DNA.' },
  { id: 'ribose', name: 'Ribose sugar', description: 'A five-carbon sugar with one more hydroxyl group than deoxyribose. The sugar in RNA, the intermediate language between DNA and proteins.' },
  { id: 'dna-backbone', name: 'DNA backbone', description: 'The structural framework of DNA, comprised of sugars and phosphates. Protects the genetic information stored inside.' },
  { id: 'rna-backbone', name: 'RNA backbone', description: 'The alternating chain of ribose sugars and phosphates that carries a temporary message from DNA to proteins.' },
  { id: 'rna', name: 'RNA', description: 'A single strand of nucleic acid used to convert genetic information into proteins. Composed of 4 nucleotide types (cytosine, guanine, adenine, uracil).' },
  { id: 'dna', name: 'DNA', description: 'A double-stranded nucleic acid with all genetic information for an organism. Composed of 4 nucleotide types (cytosine, guanine, adenine, thymine), a deoxyribose sugar, and a phosphate group.' },
  { id: 'sugar', name: 'Sugar', description: 'A compound that acts as the main source of energy for cells.' },
  { id: 'fatty-acid', name: 'Fatty acid', description: 'A water-fearing carboxylic acid with a hydrocarbon chain. Used as a source of fuel in organisms.' },
  { id: 'glycerol', name: 'Glycerol', description: 'An essential sugar alcohol derived from glucose (sugar) that serves as a major structural component of lipids.' },
  { id: 'head', name: 'Hydrophilic head', description: 'A water-loving glycerol and phosphate group molecule.' },
  { id: 'phospholipid', name: 'Phospholipid', description: 'A lipid consisting of a glycerol backbone, a hydrophilic head, and 2 hydrophobic fatty acid tails. Essential for building cell membranes.' },
  { id: 'bilayer', name: 'Phospholipid bilayer', description: 'A membrane made of 2 layers of phospholipids. Forms most cells’ membranes.' },
  { id: 'organelle', name: 'Organelle', description: 'A structure with a specific function in a cell. Some are membrane-bound, others are membrane-less.' },
  { id: 'vacuole', name: 'Vacuole', description: 'A membrane-bound organelle containing water, engulfed solids, and waste products used to maintain homeostasis.' },
  { id: 'nucleus', name: 'Nucleus', description: 'A membrane-bound organelle carrying all of a cell’s genetic material. Found in eukaryotic cells.' },
  { id: 'mitochondria', name: 'Mitochondria', description: 'A double membrane-bound organelle that generates adenosine triphosphate (ATP), the energy used to power cells.' },
  { id: 'energy', name: 'Energy', description: 'The capacity to do work. Can be converted but never created or destroyed.' },
  { id: 'movement', name: 'Movement', description: 'The act of changing physical locations.' },
  { id: 'ribosome', name: 'Ribosome', description: 'The molecular machine used to convert mRNA into proteins. Made of rRNA and proteins.' },
  { id: 'golgi', name: 'Golgi apparatus', description: 'An organelle that packages proteins and lipids into membrane-bound vesicles for transport out of the cell.' },
  { id: 'rough-er', name: 'Rough endoplasmic reticulum', description: 'A network of interconnected membrane sacs and ribosomes that functions as the primary site for protein synthesis, folding, and modification.' },
  { id: 'smooth-er', name: 'Smooth endoplasmic reticulum', description: 'A network of tubular membranes (without ribosomes) that produces phospholipids and metabolizes (breaks down) carbohydrates.' },
  { id: 'cytoplasm', name: 'Cytoplasm', description: 'A gel-like substance comprised of water, ions, and proteins that fills the empty space in cells. Acts as a site of metabolic activity and allows for intracellular transport.' },
  { id: 'cell-structure', name: 'Cell structure', description: 'Cells are made up of organelles encased within a cell membrane.' },
  { id: 'cell-function', name: 'Cell function', description: 'Cells perform a wide variety of necessary functions, including cellular respiration (producing energy), protein synthesis, waste removal, and reproduction.' },
  { id: 'animal-cell', name: 'Animal cell', description: 'A eukaryotic cell with a variety of organelles and a membrane-bound nucleus, but different from plant cells in that they lack cell walls.' },
  { id: 'lysosome', name: 'Lysosome', description: 'A collection of enzymes that act as a cell’s garbage disposal system, breaking down waste and regulating cell homeostasis.' },
  { id: 'life', name: 'Life', description: 'The meaning? Whatever you want it to be.' },
  { id: 'enzyme', name: 'Enzyme', description: 'Specialized protein molecules that accelerate chemical reactions. Bind to specific substrates to perform many different actions, such as breaking down food or joining molecules together.' },
  { id: 'restriction-enzyme', name: 'Restriction enzyme', description: 'Enzymes that act as molecular scissors, trimming off foreign DNA at restriction sites to protect the host DNA. Essential for DNA cloning, gene mapping, and genetic fingerprinting.' },
  { id: 'plasmid', name: 'Plasmid', description: 'Circular, double-stranded DNA molecules that can replicate independently. Allow bacteria to share genetic traits and evolve rapidly.' },
  { id: 'water', name: 'Water', description: 'Refreshing.' },
  { id: 'ocean', name: 'Ocean', description: 'A vast, continuous body of saltwater.' },
  { id: 'jellyfish', name: 'Jellyfish', description: 'A free-swimming marine animal with a gelatinous body and stinging tentacles.' },
  { id: 'gfp-plasmid', name: 'GFP plasmid', description: 'Green fluorescent proteins (GFP) allow scientists to easily visualize biological processes, especially when certain genes are expressed by causing cells to glow.' },
]

const ATOMS = ['carbon', 'hydrogen', 'oxygen', 'nitrogen']
const LEVEL_1 = [...ATOMS, 'hydroxyl', 'carboxyl', 'amine', 'side-chain', 'amino-acid', 'protein']
const LEVEL_2 = ['phosphorus', 'deoxyribose', 'phosphate', 'ribose', 'dna-backbone', 'rna-backbone', 'rna', 'dna']
const ORGANELLES = ['organelle', 'vacuole', 'nucleus', 'mitochondria', 'ribosome', 'golgi', 'rough-er', 'smooth-er', 'lysosome']

/**
 * "Any 2 organelles = Cell function": an organelle with itself, or any two
 * different specific organelles. The plain organelle is not paired with the
 * specific ones, because the outline already uses those pairs (organelle +
 * ribosome is the rough ER).
 */
const CELL_FUNCTION: Recipe[] = [r('cell-function', 'organelle', 'organelle')]
const SPECIFIC = ORGANELLES.filter((o) => o !== 'organelle')
for (let i = 0; i < SPECIFIC.length; i++)
  for (let j = i + 1; j < SPECIFIC.length; j++) CELL_FUNCTION.push(r('cell-function', SPECIFIC[i], SPECIFIC[j]))

/** What the hedgehog says when the game opens. */
export const WELCOME =
  'Build life from four atoms: combine them into a protein, DNA, a living cell, and finally the glowing jellyfish gene that tools like ours are built on.'

export const LEVELS: Level[] = [
  {
    id: 'protein',
    name: 'Protein',
    tagline: 'Combine atoms into functional groups, then build an amino acid and chain them into a protein.',
    goals: ['protein'],
    starters: ATOMS,
    recipes: [
      r('hydroxyl', 'hydrogen', 'oxygen'),
      r('carboxyl', 'carbon', 'oxygen'),
      r('amine', 'nitrogen', 'hydrogen'),
      r('side-chain', 'carbon', 'hydrogen'),
      r('amino-acid', 'carboxyl', 'amine', 'side-chain'),
      r('protein', 'amino-acid', 'amino-acid'),
    ],
  },
  {
    id: 'dna',
    name: 'DNA and RNA',
    tagline: 'Build sugars, phosphate groups, and backbones to assemble the molecules of life.',
    goals: ['dna', 'rna'],
    starters: [...LEVEL_1, 'phosphorus'],
    recipes: [
      r('deoxyribose', 'carbon', 'hydroxyl'),
      r('phosphate', 'phosphorus', 'oxygen'),
      r('ribose', 'deoxyribose', 'hydroxyl'),
      r('dna-backbone', 'deoxyribose', 'phosphate'),
      r('rna-backbone', 'ribose', 'phosphate'),
      r('rna', 'amine', 'rna-backbone'),
      r('dna', 'amine', 'dna-backbone'),
    ],
  },
  {
    id: 'cell',
    name: 'Animal cell',
    tagline: 'Assemble organelles, membranes, and cytoplasm into a fully functional animal cell.',
    goals: ['animal-cell'],
    starters: [...LEVEL_1, 'phosphorus', 'phosphate', 'dna', 'rna', 'sugar', 'water', 'enzyme'],
    recipes: [
      r('fatty-acid', 'carboxyl', 'carbon'),
      r('glycerol', 'sugar', 'hydroxyl'),
      r('head', 'phosphate', 'glycerol'),
      r('phospholipid', 'head', 'fatty-acid'),
      r('bilayer', 'phospholipid', 'protein'),
      r('organelle', 'bilayer', 'protein'),
      r('vacuole', 'organelle', 'water'),
      r('vacuole', 'bilayer', 'water'),
      r('vacuole', 'bilayer', 'bilayer'),
      r('nucleus', 'organelle', 'dna'),
      r('mitochondria', 'organelle', 'sugar'),
      r('energy', 'mitochondria', 'sugar'),
      r('movement', 'energy', 'energy'),
      r('ribosome', 'protein', 'rna'),
      r('golgi', 'organelle', 'movement'),
      r('rough-er', 'organelle', 'ribosome'),
      r('smooth-er', 'organelle', 'fatty-acid'),
      r('lysosome', 'organelle', 'enzyme'),
      r('lysosome', 'enzyme', 'enzyme'),
      r('cytoplasm', 'water', 'protein'),
      r('cell-structure', 'cytoplasm', 'bilayer'),
      ...CELL_FUNCTION,
      r('animal-cell', 'cell-structure', 'cell-function'),
    ],
  },
  {
    id: 'gfp',
    name: 'GFP plasmid',
    tagline: 'Engineer a glowing jellyfish gene into a plasmid: the foundation of synthetic biology.',
    goals: ['gfp-plasmid'],
    starters: [...LEVEL_1, ...LEVEL_2],
    recipes: [
      r('enzyme', 'protein', 'protein'),
      r('restriction-enzyme', 'protein', 'dna'),
      r('plasmid', 'restriction-enzyme', 'dna'),
      r('water', 'hydroxyl', 'hydrogen'),
      r('ocean', 'water', 'water'),
      r('life', 'carbon', 'carbon'),
      r('jellyfish', 'ocean', 'life'),
      r('gfp-plasmid', 'jellyfish', 'plasmid'),
    ],
  },
]

export const ELEMENT: Record<string, Element> = Object.fromEntries(ELEMENTS.map((e) => [e.id, e]))

/** The key a set of ingredients is looked up by, whichever order they are dropped in. */
export function recipeKey(inputs: string[]): string {
  return [...inputs].sort().join('+')
}

export interface RecipeBook {
  /** Two or three ingredients to what they make. */
  byInputs: Map<string, string>
  /** Three-ingredient recipes, for "these two want one more thing". */
  triples: Recipe[]
}

/** The recipes that work in a level: its own and every earlier level's, so nothing learned stops working. */
export function recipesFor(level: Level): Recipe[] {
  return LEVELS.slice(0, LEVELS.indexOf(level) + 1).flatMap((l) => l.recipes)
}

export function recipeBook(level: Level): RecipeBook {
  const recipes = recipesFor(level)
  return {
    byInputs: new Map(recipes.map((x) => [recipeKey(x.inputs), x.makes])),
    triples: recipes.filter((x) => x.inputs.length === 3),
  }
}

/**
 * Everything a level can produce from its starters, in the order a walkthrough
 * would make it. Used for the counter, the hints, and the dev-time check
 * that each level can be finished.
 */
export function reachable(level: Level): string[] {
  const have = new Set(level.starters)
  const found: string[] = []
  let grew = true
  while (grew) {
    grew = false
    for (const x of level.recipes) {
      if (have.has(x.makes) || !x.inputs.every((i) => have.has(i))) continue
      have.add(x.makes)
      found.push(x.makes)
      grew = true
    }
  }
  return found
}

/** What is wrong with the data, as plain sentences. Empty when it is sound. */
export function alchemyProblems(): string[] {
  const out: string[] = []
  const ids = new Set(ELEMENTS.map((e) => e.id))
  const seen = new Set<string>()
  for (const e of ELEMENTS) {
    if (seen.has(e.id)) out.push(`Two elements share the id "${e.id}".`)
    seen.add(e.id)
    if (!e.description) out.push(`"${e.name}" has no description.`)
  }
  const made = new Set<string>()
  for (const level of LEVELS) {
    const keys = new Map<string, string>()
    for (const id of [...level.starters, ...level.goals]) {
      if (!ids.has(id)) out.push(`Level "${level.name}" uses "${id}", which is not an element.`)
    }
    for (const x of recipesFor(level)) {
      const key = recipeKey(x.inputs)
      const other = keys.get(key)
      if (other && other !== x.makes)
        out.push(`Level "${level.name}": ${x.inputs.join(' + ')} makes both "${other}" and "${x.makes}" once earlier levels' recipes carry over.`)
      keys.set(key, x.makes)
    }
    for (const x of level.recipes) {
      for (const id of [...x.inputs, x.makes])
        if (!ids.has(id)) out.push(`Level "${level.name}" has a recipe using "${id}", which is not an element.`)
      if (x.inputs.length < 2 || x.inputs.length > 3)
        out.push(`Level "${level.name}": the recipe for "${x.makes}" needs two or three inputs.`)
      if (level.starters.includes(x.makes)) out.push(`Level "${level.name}" both starts with and makes "${x.makes}".`)
      made.add(x.makes)
    }
    const found = reachable(level)
    for (const goal of level.goals)
      if (!found.includes(goal)) out.push(`Level "${level.name}" cannot reach its goal "${goal}" from its starters.`)
    for (const x of level.recipes) {
      if (!found.includes(x.makes) && !level.starters.includes(x.makes))
        out.push(`Level "${level.name}": "${x.makes}" can never be made, because its ingredients cannot all be reached.`)
    }
  }
  for (const e of ELEMENTS) {
    if (!made.has(e.id) && !LEVELS.some((l) => l.starters.includes(e.id))) out.push(`"${e.name}" is never made and never a starter.`)
  }
  return out
}
