# Washington iGEM 2026 - project content reference

Working reference for filling in the wiki. Everything here is pulled from the
team's own documents in the "iGEM 2026 7/8/9/10" folders (Google Drive
snapshots). Each claim lists the file it came from so anyone can check it.

This is a planning file, not wiki copy. Some of it is not settled yet, and some
of it must not go on the public wiki at all (see "Do not publish" at the bottom).

## 0. Read this first: which project is which

The Drive folders mix three seasons. Do not blend them.

- 2026 (current): a de novo protein device that controls how much Smoothened
  (SMO) sits in the primary cilium, using the MMM complex (MOSMO, MEGF8, MGRN1).
  This is the project the wiki is about.
- 2025 "ExAway": minibinders that neutralise Pseudomonas aeruginosa Exotoxin A
  (ExoA). Won Silver. Shows up in the "Mary Gates UG Symposium" decks and the
  "UGRS Poster Text" file. Do not put ExoA on the 2026 wiki. Source:
  `iGEM 2026 8/Creative/2025 Season Recap Post - Rough draft.docx`.
- 2024 "Mighty Moieties": an antibiotics project. Prior year only.

Two more things that are NOT the 2026 build:
- "Hedgehog Sense" is an ideation-phase biosensor idea (a GLI1/SMO RNA toehold
  classifier) that did not win the vote. Source: `iGEM 2026 8/.../Top Projects
  White Pages/SB_ Hedgehog Sense.docx`. Do not describe it as the project.
- The ExoA minibinder task in the wet-lab onboarding is a Benchling training
  exercise, not the project. Source: `iGEM 2026 8/Wetlab/Spring Meetings/Spring
  Meetings.docx`.

## 1. The project (canonical framing)

Source of the current framing: `iGEM 2026 10/Wetlab/Wiki/How to frame the
project.docx`.

One line: a modular receptor-degradation device built as
[targeting module] - [inducible linker] - [E3 module]. The team validates it on
SMO, where MGRN1/MEGF8 is the native system, then shows the same module works on
receptors that MMM has no natural relationship with.

Two arms, both engineered, both genetically encodable, opposite directions on one
pathway:
- Up arm: a designed minibinder disrupts the MEGF8-MOSMO interface, so SMO stops
  getting cleared from the cilium, so Hedgehog signalling goes up.
- Down arm: chemically induced dimerisation (CID) forces MGRN1 onto a target
  receptor, so that receptor gets ubiquitinated and cleared, so signalling goes
  down.

The biology, in the team's words (`Meeting 14.pptx`, `Meeting 8.pptx`, promo
script):
- The MMM complex is MOSMO + MEGF8 + MGRN1. MGRN1 is a membrane-tethered E3
  ubiquitin ligase. MEGF8 and MOSMO are its transmembrane adapters, and MOSMO
  stabilises the MEGF8-MGRN1 binding.
- Normally MMM ubiquitinates SMO and marks it for degradation, clearing it from
  the primary cilium. SMO is active when it is in the cilium and drives Hedgehog
  signalling through GLI transcription factors.
- Too much Hedgehog signalling is linked to cancers (basal cell carcinoma, SHH
  medulloblastoma). Too little disrupts development. The team frames this as a
  window you want to tune, not a switch you flip.

Late-season reframe (important): the project moved from "a Hedgehog therapy"
toward "a modular research platform for controlling ciliary protein
localization." Sources: `iGEM 2026 8/Human Practices/IHP/IHP Wiki Outline.docx`,
`iGEM 2026 7/Main Team Meetings/Human Practices 8.5.26 Presentation.pptx`. The
promo script still leans therapeutic, so wiki messaging needs to pick one voice.
The "How to frame the project" doc is the most current source, so lead with the
platform framing and mention the disease motivation as the reason it matters.

Why it ports to other receptors: the down arm is tested by recruiting MGRN1 to
GPR161, a ciliary GPCR that MMM does not normally target. If forced proximity
ubiquitinates GPR161, the platform generalises. The team lists Wnt, TGF-beta,
BMP, and Notch as other pathways it could reach. iGEM village: Foundational
Advance. Source: `Meeting 12.pptx`, `Meeting 14.pptx`, mid-quarter deck.

### Targets and comparators
- SMO (Smoothened): the validation target, because the ground truth is known.
- MEGF8-MOSMO interface: what the up-arm minibinder is designed against. The Kong
  lab has cryo-EM of MMM and a preprint (biorxiv 2025.09.11.675358) identifying a
  site whose mutation breaks complex assembly.
- GPR161: the generalisation control for the down arm.
- MC1R / MC4R: comparators, since MGRN1 targets them via adapters (ATRN route).
- ATRN / ATRNL1: an earlier target that was dropped, because there was no cryo-EM
  (only AlphaFold) and MMM had better structural data.
- SSTR3 is NOT in these documents. The old Notion-based site copy mentions it.
  Drop it unless the team has a source.

Project originator: Skyler Choi (Kong Lab). Sources across ideation decks.

## 2. Protein Design

Sources: `stepwise pipeline_ RFD3, MPNN, RF3 _how to_.pptx`, `Hyak
minidocs.docx`, `Bindcraft Slop.docx`, `Software.pptx`, `Principles of Minbinder
Design.docx`, the DiMaio meeting docs, `Minibinders round 0!.pptx`.

Pipeline (runs on the UW Hyak cluster in a RosettaCommons "foundry" container):
1. RFdiffusion3 (RFD3) generates binder backbones against the target, using
   hotspots and a binder length range.
2. ProteinMPNN designs sequences, 5 per backbone.
3. RoseTTAFold3 (RF3) forward-folds each sequence (about 40 sequences per hour
   per GPU). MOSMO and MEGF8 are templated because sequence databases were a
   bottleneck.
- A parallel track uses BindCraft (AlphaFold2 multimer hallucination) for fewer
  but more stringently filtered designs.

Filtering metrics: ipTM cutoff 0.8 (above 0.8 confident, below 0.6 failed),
plus pTM, minPAE (DiMaio called this the best single predictor of success),
Cα-RMSD kept under 2 Angstrom vs the designed model, and PyRosetta
InterfaceAnalyzer scores (interface dG, buried surface area, unsatisfied
H-bonds, shape complementarity). For target selection DiMaio's rule was:
extracellular or membrane targets, a solved structure and ideally a solved
complex, or AF3 pTM above 0.9 if there is no structure, and a small hydrophobic
binding patch.

Because MOSMO and MEGF8 surfaces are beta-sheet heavy, the team is looking at
beta-strand-conditioned RFdiffusion (Nat Commun 2025 s41467-025-67866-3), since
helix-focused binder design underperforms on edge-beta-strand targets. Source:
`Principles of Minbinder Design.docx`.

Compute: Hyak (via the UW Research Computing Club, funded by the Student
Technology Fee), plus one seat on the Institute for Protein Design cluster
(DIGS).

What actually exists as of these documents: about 24 distinct MOSMO binder
backbones carried into sequence design, most with 2 or 3 candidate sequences,
around 160 amino acids each. Source: `iGEM 2026 10/Protein Design/Mini-binder
Project Mosmo-MEGF8 (Sequences).xlsx`. Note: despite the filename there are no
MEGF8 binder sequences in that file, only MOSMO. There are no scored result
tables for the 2026 binders yet, and no MEGF8 binders and no wet-lab results.

Mentorship: Dr. Frank DiMaio (Institute for Protein Design) is the computational
mentor. He set the tool choices and target-selection rules above, told them to
use minPAE as the main success metric, and vetted the MOSMO/MEGF8 choice.

## 3. Kinetic Modeling

Sources: `KM_ Project Design Document.docx`, `Collaborative Document_ Version 0
Construction.docx`, `Parameter Database (Hh_MMM).xlsx`, `Dr. Herbert Sauro
Meeting Notes.docx`, the KM meeting slides, mid-quarter deck.

What it models: the simplified Hedgehog / MMM / SMO system as ODEs. Version 0 is
the simplified base model. The build order they taught was first-order ODEs, then
Hill equations, then Michaelis-Menten for the E3-ligase degradation step. After
advice from Dr. Herbert Sauro the toolchain moved from raw SciPy to Tellurium /
Antimony in Spyder, with SBML models from BioModels.

The claim the model tests: whether the designed binder can restore wild-type
ciliary SMO levels in a basal cell carcinoma context. The test is a two-run
comparison, once wild type and once with PTCH1 set to zero (the most common BCC
mutation). The "tunability window" is where the second run's SMO profile matches
the first over time. Stated ambition: "a kinetic model-guided recruitment
platform that lets us dial SMO levels in the primary cilium instead of simply
blocking SMO activity." Source: mid-quarter deck.

Parameters and where they come from: concentrations from PaxDb, BioNumbers, and
DepMap; enzyme kinetics (Km, kcat) from BRENDA by EC number; degradation rates
from specific papers. The parameter database has values for SUFU, SMO, GLI-A,
GLI-R, MGRN1, MOSMO, MEGF8, PTCH1, E2 enzymes, and the MMM complex. Notable
figures: MMM is about 28.8 copies per cell (0.072 nM), SMO degradation about
8.6e-5 per second, PTCH1 about 45% lost in 3 hours, MGRN1 Km 0.30 mM and kcat
1.24 per mM per second (BRENDA). The low copy numbers are why they asked Sauro
about stochastic vs deterministic modelling.

Sauro's guidance (systems biology advisor): build a pipeline that selects among
candidate models rather than one big model, change one relationship per model so
AIC and BIC stay comparable, run Morris and Sobol sensitivity analysis, sample
parameters as Gaussians and report the output distribution with 95% intervals,
model the membrane as a compartment, treat the system like a PROTAC with a
three-binding-event proximity model, and use fold changes (knockout vs wild type)
as constraints because only relative data is available. His line worth quoting:
"you can only really show how models are wrong."

## 4. Wet Lab

Sources: `iGEM 2026 8/Wetlab/Protocols/Induced Proximity Assay.docx`, `iGEM 2026
7/Wetlab/Protocols/*`, `iGEM 2026 10/Wetlab/Protocols/Cell Transfection
Protocol.docx`, `260506 Mid Quarter Check In w_ JENNKONG.pptx`, `Summer
Meetings.docx`.

Four planned experiments:
1. Induced proximity (CID) proof of concept. Co-express tagged SMO, tagged
   MGRN1, and HA-Ubiquitin in NIH/3T3 cells. Constructs use FKBP and FRB with a
   rapalog to force SMO/MGRN1 proximity. Readout is immunoprecipitation plus an
   anti-HA-Ub Western. Controls include a catalytically dead MGRN1 (R318E) and a
   no-FKBP SMO.
2. Binder screen by mammalian two-hybrid in 96-well format (GAL4-DBD on
   MEGF8/MOSMO, VP16-AD on the de novo binder, GFP reporter). Around 125 to 130
   binders are realistically screenable.
3. SMO abundance change. Transfect hits into NIH/3T3, induce cilia by dropping to
   0.5% FBS, add varying SHH, then image ciliary SMO (median ciliary-SMO
   intensity, percent SMO-positive cilia).
4. Purify 5 to 10 top hits by IMAC (His-tag).

Protocols that exist as written documents: Induced Proximity Assay (the most
detailed, with construct designs, transfection recipe, NanoBiT option, and a
rapalog vs ALFA-tag trade-off), Flow Cytometry (verify binding to GFP-tagged
SMO), Golden Gate Assembly (NEBridge, BsaI-HFv2), MiniPrep (ZymoPURE), Cell
Transfection (HEK293T, PEI at DNA:PEI 1:3), and Golden Gate + IMAC reading notes.

Cell lines: NIH/3T3 (mouse, for ciliary and proximity assays) and HEK293T (for
transfection and two-hybrid). Designs are mouse-optimised for NIH/3T3.

Reagent notes for the Engineering/Notebook narrative: MEGF8 is 2,845 amino acids
(about 8.5 kb), which is over the GenScript FlashGene 3 kb cap, so full-length
MEGF8 likely comes from the Kong lab. CMV promoter chosen because the ciliary
readout needs 3 to 4 days. The SMO arm avoids a P2A site because the proline scar
would affect SMO signalling.

Advisors: Dr. Jennifer Kong (Hedgehog biology, the MMM system is from her lab)
and Dr. Claudia Vasquez (wet lab). Adam Chazin-Gray, an IPD PhD student, mentored
hands-on lab work.

Gaps: the "Gene order master list" is empty (headers only), so nothing is
recorded as ordered or received yet. No SPR data. No measured binding affinities.
Everything is at the design and planning stage as of the July 2026 documents.

## 5. Human Practices (Integrated)

Sources: `iGEM 2026 8/Human Practices/IHP/IHP Wiki Outline.docx`, the individual
interview notes, `iGEM 2026 10/Human Practices/IHP/Stakeholder Spreadsheet.xlsx`,
`iGEM 2026 10/Human Practices/IHP/iGEM Interviewing Guidebook.docx`.

Interviews that have written notes (highest confidence, safe to build pages on):
- Dr. Ning Zheng (UW Pharmacology, ubiquitination). Told the team a transmembrane
  E3 PROTAC does not exist in the literature, so this is genuinely novel. Made a
  terminology correction that reshaped the project: because they augment an
  existing interaction, this is a "LockTAC," not a PROTAC. Pushed them to broaden
  past SMO to a modular "any protein can attach" system, using SMO as a positive
  control. This is a direct driver of the platform pivot.
- Dr. Stacey Ogden (St. Jude, Hedgehog signalling). Gave the disease landscape:
  Hedgehog upregulation drives basal cell carcinoma and about 30% of
  medulloblastoma. Set an explicit limit: the approach would not work on SUFU
  mutations or GLI-driven cases. Noted the W535L mutation locks SMO active, and
  that you should not give young children Hedgehog inhibitors, which argues for a
  tunable approach. Referred the team to Saikat Mukhopadhyay (GPR161 trafficking)
  and others.
- Dr. Herbert Sauro (UW Bioengineering, systems biology). Two meetings. Guidance
  is in section 3.

Contacted with email drafts, status not all confirmed (do not write "we
interviewed" until confirmed): Neil King (IPD), the Cirulli Lab (UW Med
Diabetes), Hong Qian (UW Applied Math), Erin Crotty (Seattle Children's,
medulloblastoma), Nicholas Vitanza (pediatric neuro-oncology), Sachin Gupta
(Hedgehog in cancer), Peter Brzovic (UW Biochemistry, ubiquitin complexes),
Patrick Stayton (drug delivery), Benjamin Freedman (cilia research), Dan Doherty
(ciliopathies), plus bioethics and commercialization contacts (Sara Goering,
Teddy Johnson, and others).

Planned IHP wiki structure (from the IHP Wiki Outline): three pillars, which are
a good spine for the page.
- Adoption: what cilia researchers need to use this as a tool.
- Responsible use: what it means to hand out something that alters ciliary
  localization, including a case study on auditory cilia as a "this is why it
  needs care" example.
- Design safety: designing so it is used safely (are neighbouring proteins
  ubiquitinated, does it interfere with normal trafficking).
Guiding question, usable verbatim: "How can we maximize scientific innovation for
researchers by making a ciliary protein engineering platform easy to adopt, and
encouraging responsible use in biologically sensitive systems?"

## 6. Education and Outreach

Sources under `.../Human Practices/Education/` and the WebDev "Little Alchemy"
folder.

Framing device from the 8.5.26 HP presentation: "SynBio Should Be..." with
buckets Engaging, Accessible, Fun for Kids, Fun for the Elderly, Inspiring.

- Video series: each episode decodes one real UW paper for a general audience and
  teaches a reusable roadmap (Title, Abstract, Figures, Discussion), paired with
  an interview of the paper's author. Episode 1 is "Lighting Up Cancer Research:
  How Fireflies Help Us Study Immune Cells" with Prof. Elizabeth Wayne. Tagline:
  "A scientific paper is not meant to be read like a novel. It's meant to be
  decoded."
- iGEM Alchemy (name not final): a browser drag-and-drop combination game where
  players build biomolecules from atoms up to a GFP plasmid across 4 levels. The
  full recipe list exists (Level 1 protein, Level 2 DNA/RNA, Level 3 animal cell,
  Level 4 GFP plasmid). This connects directly to the site Playground. Sources:
  `HP iGEM Little Alchemy.docx`, WebDev `4_9.pptx` (React/Vite scaffold).
- Trivia tabling: a spin-the-wheel game with 5 categories (Synthetic Biology
  Techniques, Famous Scientists, Washington iGEM, Environmental Bio, Ethics and
  Policy), each with a full question bank and an ethics discussion prompt. Run at
  the ASUW Spring Fair and Admitted Students Day.
- Central dogma bracelet ("Build a Baselet"): a take-home wearable model of the
  central dogma with color-coded nucleotide beads, a codon chart, and a QR to an
  AlphaFold model of the protein the player builds. Audience 8 to 18, about $0.20
  per person.
- Elderly home activity: a two-way "ask, teach, talk" session with pre and post
  surveys, teaching central dogma and cell signalling with a bucket-and-balls
  relay.
- DNA polymerase relay, SynBio Hotline video, and a "Scientists You Might Not
  Know" profile series (Frances Oldham Kelsey, Osamu Shimomura and GFP, Alice
  Ball, and others).
- Confirmed events: Engineering Discovery Days (Apr 30 to May 1), ASUW Fair
  (Apr 17), Admitted Students Day, SoundBio, Dawg Daze.

## 7. Team, subteams, advisors

Sources: `iGEM 2026 8/Operations/501(c)(3)/Student Leader Roster.xlsx`, `iGEM
2026 10/Operations/501(c)(3)/All Student Roster.xlsx`, Operations Handbook.

Leads with confirmed roles (this corrects the guessed roster in the current
site):
- Samaira Bakshi: Co-President and Wet Lab lead
- Alex Devgan: Co-President and Human Practices (Education) lead
- Eliza Dawley: Protein Design lead
- Aimee Furlan: Kinetic Modeling lead
- Jaiden Poon: Human Practices (Integrated) lead
- Winnie Lin: Fundraising lead, stepping down summer 2026
- Charlotte Hsu: Fundraising lead (replacing Winnie)
- Sophia Nguyen: Creative lead
- Neel Sundar: Web Development lead

Subteams (7): Wet Lab, Integrated Human Practices, Human Practices Education,
Protein Design (also called Protein Modeling), Kinetic Modeling, Creative
(Design/Social Media), Web Development, plus Fundraising/Finance and Operations.

Web Development members: Neel Sundar (lead), Rishabh Goenka, Iris Guo, Trevor
White. Rishabh is ECE and built the club website that the wiki work builds on.

The full roster (about 34 people with majors) is in the All Student Roster file.
Use it to replace the placeholder team beds. Do not publish the demographics
survey responses or scholarship status; those are internal.

Advisors: Frank DiMaio (Protein Design), Jennifer Kong and Claudia Vasquez (wet
lab), Herbert Sauro (modeling), Adam Chazin-Gray (IPD PhD mentor).

## 8. Sponsors and finance (for Attributions / Sponsors)

Source: funding letters and `Running list of grants.xlsx`.

Confirmed or recurring: Institute for Protein Design ($4,000 in 2025, plus lab
space and mentorship), Biochemistry Department ($2,000 per year), Biology
Department (small), Microbiology (small), Student Technology Fee (compute).
In-kind reagent grants in progress: Twist Bioscience, IDT, GenScript, NEB, Zymo.
Software: MathWorks, and free Claude access from Anthropic. Registration context
for the "why we fundraise" story: 2026 registration is about $9,010.

The Website Revision doc asks for gold/silver/bronze sponsor tiers on the
fundraising page.

## 9. The judge feedback (this is the wiki design brief)

Sources: `iGEM 2026 8/Operations/Judging Feedback Thoughts.docx`, `iGEM 2026
10/WebDev/260514 Website Revision Suggestions.docx`, WebDev meeting slides.

What the judges and the team said the wiki must do:
- Show what was learned and how findings changed decisions. Make dry lab and
  human practices explicitly feed back into wet lab and vice versa.
- Justify design choices on the page (for example, why peptides over small
  molecules: specificity and binding affinity).
- One coherent linked story, not a set of requirement boxes. A judge quote: "the
  wiki is also somewhat confusing as it does not explicitly show information,
  sections should link together and a coherent story should be developed."
- Make navigation and headers obviously clear.
- Integrate subteam results into the story instead of leaving them detached.
- Include failed and negative data as part of the engineering process. In 2025
  the team hid assay failures, which the judges did not want.
- Start the wiki early, generate real figures, keep style consistent throughout.
- Accessibility: ARIA labels and alt text.
- Medal targeting: 2025 missed Excellence in Model and Excellence in Education,
  and only reached Silver. Aim higher and pick the Excellence categories on
  purpose.

Required pages named in the WebDev deck and Operations Handbook: Project
Description, Engineering, Attributions, Contribution and other gold-medal pages,
Safety, plus the promo video deliverable. The wiki is hosted on iGEM GitLab;
images must be hosted at tools.igem.org and video at video.igem.org, no YouTube
embeds.

## 10. Branding and promo

- No final project name or logo yet. WebDev gets these from Creative. Keep the
  site title as a clear placeholder until then.
- Promo video: max 2 minutes, background light purple #f3edff, a recurring teal
  primary-cilium drawing, logo reveal at the platform moment. Hook line: "What do
  childhood brain cancer, heart disease, adult skin cancer and missing teeth have
  in common? A tiny hair on some cells, called the primary cilia."
- Creative direction for the year: less bubbly fonts, less wordy.

## 11. Gaps to fill later (data the wiki needs and does not have yet)
- Final project name and logo.
- Any scored results for the 2026 binders, and any wet-lab results at all.
- MEGF8 binder sequences.
- A real Safety page. There is no biosafety document in the folders.
- Citations for the disease statistics (they currently come from slides).
- Confirmed interview outcomes for everyone beyond Zheng, Ogden, and Sauro.
- Reconcile therapy vs research-platform messaging (use the platform framing).

## 12. Do not publish (found in the source folders)
- A shared-account password that appears in the Interviewing Guidebook. Keep it
  out of any file that ships. Not repeated here.
- The finance passwords document.
- Individual demographic and scholarship survey responses.
- Any stakeholder marked declined, and any interview not yet confirmed, should
  not be written up as a completed interview.

## Source index (highest-value files)
- Project framing: `iGEM 2026 10/Wetlab/Wiki/How to frame the project.docx`
- Protein Design pipeline: `iGEM 2026 7/Protein Design/stepwise pipeline_ RFD3,
  MPNN, RF3 _how to_.pptx`, `iGEM 2026 9/Protein Design/Hyak minidocs.docx`
- Binder sequences: `iGEM 2026 10/Protein Design/Mini-binder Project Mosmo-MEGF8
  (Sequences).xlsx`
- Modeling: `iGEM 2026 8/Kinetic Modeling/KM_ Project Design Document.docx`,
  `Parameter Database (Hh_MMM).xlsx`, `Dr. Herbert Sauro Meeting Notes.docx`
- Wet lab: `iGEM 2026 8/Wetlab/Protocols/Induced Proximity Assay.docx`,
  `260506 Mid Quarter Check In w_ JENNKONG.pptx`
- IHP: `iGEM 2026 8/Human Practices/IHP/IHP Wiki Outline.docx`, interview notes in
  `iGEM 2026 7/Human Practices/IHP/`
- Education: `iGEM 2026 8/Human Practices/Education/HP iGEM Little Alchemy.docx`
  and the Trivia Tabling and activity docs
- Team: `iGEM 2026 8/Operations/501(c)(3)/Student Leader Roster.xlsx`,
  `iGEM 2026 10/Operations/501(c)(3)/All Student Roster.xlsx`
- Wiki brief: `iGEM 2026 8/Operations/Judging Feedback Thoughts.docx`,
  `iGEM 2026 10/WebDev/260514 Website Revision Suggestions.docx`
