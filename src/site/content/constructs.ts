/**
 * The genetic constructs, as data.
 *
 * Both `/parts` and the wetlab notebook draw the same diagrams, so the parts
 * themselves live here rather than inside either page. `ConstructDiagram`
 * turns a group into labelled domain blocks.
 *
 * A construct is a list of domains in the order they appear in the fusion.
 * `role` only sets the colour, so that the same kind of part is the same
 * colour everywhere: a receptor always reads as a receptor, a tag as a tag.
 * Lengths are not to scale and are not meant to be.
 */

export type DomainRole = "receptor" | "machinery" | "recruitment" | "tag" | "marker" | "other";

export interface Domain {
  label: string;
  role: DomainRole;
  /** A mutation or a residue range, shown inside the same block as the label. */
  note?: string;
}

export interface Construct {
  /** The fusion, written out, for anyone reading with a screen reader. */
  name: string;
  domains: Domain[];
  /** One line on what this construct is for. */
  purpose?: string;
}

export interface ConstructGroup {
  id: string;
  name: string;
  blurb?: string;
  constructs: Construct[];
}

/** What each colour means, shown as a legend under every diagram. */
export const DOMAIN_ROLES: { role: DomainRole; label: string }[] = [
  { role: "receptor", label: "receptor" },
  { role: "machinery", label: "MMM component" },
  { role: "recruitment", label: "recruitment domain" },
  { role: "marker", label: "fluorescent marker" },
  { role: "tag", label: "detection or purification tag" },
  { role: "other", label: "a part we designed" },
];

/**
 * The ten mammalian expression constructs ordered from GenScript, in
 * pcDNA3.1(+)-based vectors.
 */
export const RECRUITMENT_CONSTRUCTS: ConstructGroup[] = [
  {
    id: "cid",
    name: "Chemically induced recruitment",
    blurb: "Adding a rapalog brings the DmrA and DmrC domains together, so the protein carrying one is pulled to the protein carrying the other.",
    constructs: [
      {
        name: "SMO–DmrC(T2098L)–eGFP",
        purpose: "SMO fusion for chemically induced recruitment",
        domains: [
          { label: "SMO", role: "receptor" },
          { label: "DmrC", role: "recruitment", note: "T2098L" },
          { label: "eGFP", role: "marker" },
        ],
      },
      {
        name: "MGRN1–DmrA–His6",
        purpose: "Direct MGRN1 recruitment",
        domains: [
          { label: "MGRN1", role: "machinery" },
          { label: "DmrA", role: "recruitment" },
          { label: "His6", role: "tag" },
        ],
      },
      {
        name: "MGRN1(C279A/C282A)–DmrA–His6",
        purpose: "Catalytically inactive MGRN1 control",
        domains: [
          { label: "MGRN1", role: "machinery", note: "C279A/C282A" },
          { label: "DmrA", role: "recruitment" },
          { label: "His6", role: "tag" },
        ],
      },
      {
        name: "MEGF8 ICD(2602–2778)–DmrA–His6",
        purpose: "Recruitment of the MEGF8 intracellular domain",
        domains: [
          { label: "MEGF8 ICD", role: "machinery", note: "2602–2778" },
          { label: "DmrA", role: "recruitment" },
          { label: "His6", role: "tag" },
        ],
      },
    ],
  },
  {
    id: "alfa",
    name: "ALFA-based recruitment",
    blurb: "The same idea through a peptide tag and the nanobody that binds it, rather than through a rapalog.",
    constructs: [
      {
        name: "HA–MGRN1–NbALFA",
        purpose: "ALFA-based MGRN1 recruitment",
        domains: [
          { label: "HA", role: "tag" },
          { label: "MGRN1", role: "machinery" },
          { label: "NbALFA", role: "recruitment" },
        ],
      },
      {
        name: "HA–MGRN1(C279A/C282A)–NbALFA",
        purpose: "Catalytically inactive ALFA-recruitment control",
        domains: [
          { label: "HA", role: "tag" },
          { label: "MGRN1", role: "machinery", note: "C279A/C282A" },
          { label: "NbALFA", role: "recruitment" },
        ],
      },
      {
        name: "SMO–His6–ALFA",
        purpose: "ALFA-tagged SMO construct",
        domains: [
          { label: "SMO", role: "receptor" },
          { label: "His6", role: "tag" },
          { label: "ALFA", role: "recruitment" },
        ],
      },
    ],
  },
  {
    id: "gpr161",
    name: "Additional receptor constructs",
    blurb: "A second ciliary receptor put through both recruitment systems, which is what would test whether the platform generalises past SMO.",
    constructs: [
      {
        name: "GPR161–eGFP–DmrC(T2098L)",
        purpose: "Recruitment system for an additional ciliary receptor",
        domains: [
          { label: "GPR161", role: "receptor" },
          { label: "eGFP", role: "marker" },
          { label: "DmrC", role: "recruitment", note: "T2098L" },
        ],
      },
      {
        name: "GPR161–GFP–ALFA",
        purpose: "ALFA-tagged GPR161 receptor",
        domains: [
          { label: "GPR161", role: "receptor" },
          { label: "GFP", role: "marker" },
          { label: "ALFA", role: "recruitment" },
        ],
      },
    ],
  },
  {
    id: "control",
    name: "Experimental control",
    blurb: "Recruited like the others, but carrying no ubiquitination machinery, so it separates the effect of proximity from the effect of what is brought over.",
    constructs: [
      {
        name: "DmrA–mCherry",
        purpose: "Proximity-only control",
        domains: [
          { label: "DmrA", role: "recruitment" },
          { label: "mCherry", role: "marker" },
        ],
      },
    ],
  },
];

/**
 * The split-transcription-factor screening system, ordered from Twist
 * Bioscience. Which half of the transcription factor sits on the binder and
 * which on the target is set by the final plasmid designs, so the halves are
 * drawn here without being assigned.
 */
export const SCREENING_CONSTRUCTS: ConstructGroup[] = [
  {
    id: "binders",
    name: "Designed binder constructs",
    blurb: "One per candidate, as a library of designs. Each binder carries one half of the split transcription factor.",
    constructs: [
      {
        name: "MEGF8-targeting binder fused to a split transcription factor half",
        purpose: "Tests a designed MEGF8 binder",
        domains: [
          { label: "MEGF8 binder", role: "other" },
          { label: "split TF half", role: "recruitment" },
        ],
      },
      {
        name: "MOSMO-targeting binder fused to a split transcription factor half",
        purpose: "Tests a designed MOSMO binder",
        domains: [
          { label: "MOSMO binder", role: "other" },
          { label: "split TF half", role: "recruitment" },
        ],
      },
    ],
  },
  {
    id: "targets",
    name: "Target constructs",
    blurb: "The intended target of each binder, carrying the complementary half. The two halves are GAL4 and VP16.",
    constructs: [
      {
        name: "MEGF8 fused to the complementary split transcription factor half",
        purpose: "The MEGF8 target",
        domains: [
          { label: "MEGF8", role: "machinery" },
          { label: "complementary half", role: "recruitment" },
        ],
      },
      {
        name: "MOSMO fused to the complementary split transcription factor half",
        purpose: "The MOSMO target",
        domains: [
          { label: "MOSMO", role: "machinery" },
          { label: "complementary half", role: "recruitment" },
        ],
      },
    ],
  },
  {
    id: "reporter",
    name: "Reporter and controls",
    blurb: "What the assay is read from, and what every binder is scored against.",
    constructs: [
      {
        name: "GFP reporter",
        purpose: "Switched on when the two transcription factor halves come together",
        domains: [{ label: "GFP reporter", role: "marker" }],
      },
      {
        name: "BFP marker",
        purpose: "Identifies the relevant cell population during flow cytometry",
        domains: [{ label: "BFP marker", role: "marker" }],
      },
      {
        name: "GB1-only carrier",
        purpose: "Filler DNA used in place of the target as the negative control",
        domains: [{ label: "GB1 carrier", role: "other" }],
      },
    ],
  },
];
