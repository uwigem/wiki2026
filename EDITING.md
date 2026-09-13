# Editing the wiki

**You do not need to install anything.** You can change any words on the wiki
from your browser, on github.com, in about five minutes.

This page is for changing text: fixing a sentence, adding a paragraph, writing
your bio, filling in your subteam's section. If you want to add a whole new page
or run the site on your laptop, read [CONTRIBUTING.md](CONTRIBUTING.md) instead.

## Before your first edit

Two things, once:

1. Make a free GitHub account if you do not have one: <https://github.com/signup>.
2. Send your GitHub username to Web Dev and ask to be added to the **uwigem**
   organisation.

The repo is private, so until step 2 is done every link on this page will show
you a "404" page. That is not you doing something wrong.

## Where the words are

Find the thing you want to change, then open that file.

| I want to change | Open this file |
| --- | --- |
| Text on any Project or Impact page | [`src/site/content/pages.ts`](src/site/content/pages.ts) |
| My name, role, or bio on the Team page | [`src/site/content/team.ts`](src/site/content/team.ts) |
| An entry on the Notebook timeline | [`src/site/content/timeline.ts`](src/site/content/timeline.ts) |
| The project title, tagline, or footer links | [`src/site/content/site.ts`](src/site/content/site.ts) |
| A link in the top menu | [`src/site/content/nav.ts`](src/site/content/nav.ts) |

Everything else is the machinery that draws the site. You do not need it.

## The five steps

1. **Open the file** using a link from the table above.

2. **Click the pencil** at the top right of the file. Its tooltip says *Edit this
   file*. You are now typing straight into the page.

3. **Find your text and change it.** Press `Ctrl+F` (`Cmd+F` on a Mac) to search
   the file for a phrase you recognise from the website.

4. **Click the green `Commit changes...` button**, top right. A box opens.
   - In the first line, say what you changed: `Fix the SMO sentence on Results`.
   - Choose **"Create a new branch for this commit and start a pull request"**.
     This matters. Do not pick "Commit directly to the main branch".
   - Click **Propose changes**, then **Create pull request** on the next screen.

5. **Wait about a minute.** A check runs on your change.
   - **Green tick:** you are done. Post the link on the Web Dev channel.
   - **Red X:** something in the file is broken. See
     [If you get a red X](#if-you-get-a-red-x) below. Nothing is live yet and
     nothing is damaged.

Your change goes onto the real wiki when someone reviews and merges it.

## The three rules

The content files are text wrapped in a little punctuation. The words are yours
to change freely. The punctuation around them is what the site needs in order to
read them.

**1. Keep the quote marks at both ends.**

```
body: 'Work is done in the advising lab under its existing protocols.',
```

Change the words between the `'` marks. Leave the `'` at the start, the `'` at
the end, and the `,` after it exactly where they are.

**2. If your text has an apostrophe, use double quotes.**

A `'` inside the text ends the text early and breaks the page.

```
body: 'We didn't see binding.',     <- broken
body: "We didn't see binding.",     <- correct
```

**3. Every line ends with a comma.**

If you add a new line, it needs a `,` at the end, and so does the one above it.

That is the whole list. If you keep the punctuation and only change the words,
you cannot break the site.

## Making a word bold

Put two asterisks either side:

```
body: 'The **MMM complex** clears SMO from the cilium.',
```

This works in the `body:` of a paragraph or a card, and nowhere else. In a title,
a heading or a note, `**` just shows up as asterisks on the page. Use it for the
two or three terms a reader should come away with, not for general emphasis.

## Marking something you cannot finish

If you are leaving a gap, say so in the file rather than leaving it blank. Write:

```
TODO(wetlab): add the binding numbers once the assay runs.
```

Put your subteam in the brackets. These show up as a dashed **still to come**
panel on the page, which is deliberate: it is better for everyone to see what is
missing than to find a page that quietly says nothing.

## If you get a red X

Click **Details** next to the failed check. Near the bottom of the log there is a
line with a file name and a line number, like:

```
src/site/content/pages.ts(214,7): error TS1005: ',' expected.
```

That means line 214 of that file. Nine times out of ten it is one of the three
rules above: a missing comma, or an apostrophe inside single quotes.

To fix it, go back to your pull request, click **Files changed**, click the
pencil, fix it, and commit again to the same branch. The check runs again.

If you cannot see it, post the pull request link on the Web Dev channel and say
you are stuck. That is completely normal and it is much better than guessing.

## Things worth knowing

- **Nothing you do here can break the live wiki.** Your change sits in a pull
  request until someone merges it.
- **You cannot lose work by making a mistake.** Every version is kept.
- **Do not edit anything under `src/engine/`.** That is the code that draws the
  garden, and one number in it changes the colour of every page. A check will
  stop you if you try.
- **Do not put team documents in here.** No meeting notes, no Drive exports, no
  spreadsheets, no anything with a password in it. This repo is only the website.
