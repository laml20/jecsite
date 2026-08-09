# Your Checklist — Mis XV Años

Everything you do by hand. The technical build is in `website-spec.md`; you don't need to read that one.

Work roughly top to bottom — later sections depend on earlier ones. **Start with §1 and §6 today**, because those two have waiting time built in that nothing else can shorten.

---

## 1. Domain and hosting — do this first

DNS changes and HTTPS certificates take hours to a day, and they're the only steps you cannot rush at the end.

- [ ] Decide: **public repo, GitHub Pro, or Cloudflare Pages.** GitHub Pages on the free plan only publishes from a **public** repository, meaning your source — every name, address, and phone number in it, plus the full edit history — is browsable by anyone and indexable by Google. Options:
  - GitHub Pro, ~$4/month. Private repo works. Subscribe now, cancel after the party.
  - Cloudflare Pages. Free, private repos, and your domain works there identically.
  - Accept the public repo. You've said this isn't a worry, which is fair — someone would need your GitHub username first, and nobody browsing GitHub is looking for a quinceañera. Just know the random path is visible there.
- [ ] Point your domain at the host (whoever builds the site can do this with you — it's four DNS records).
- [ ] **Decide where the invitation actually lives.** Recommended, and it does what you're after:
  - The invitation sits at a random path — `misquincejessica.com/a7f3k9`. This is the link you text people. **They tap it and they're in. They never see a phone field.**
  - The bare domain is a separate near-empty page: her name, "Mis XV Años," and a phone box. No date, no venues, no addresses. Enter a number that's on your guest list and it forwards you to the real link.
  - A stranger who guesses the domain gets a name and nothing else. A guest who deleted your text can get themselves back in without asking you.
- [ ] **Pick the random path.** Six or more random characters — `a7f3k9`, not `jessica15` or `quince2026`. Anything guessable defeats the point. Write it down somewhere you won't lose it.
- [ ] **Wait for HTTPS to go green before doing anything else.** Up to 24 hours.
- [ ] Put a placeholder page up so you can confirm the domain actually resolves. Then forget about it until launch.

---

## 2. Images out of Canva

**Share → Download** in Canva. For individual elements: select just that element → Download → PNG → **transparent background** (needs Canva Pro). Without Pro, put the element alone on a blank page and download that page.

If transparency is a problem, download the whole design as **PDF Print** — it embeds images at full resolution and they can be pulled out of the PDF afterward.

### The list

- [ ] **Marble background — clean plate.** No text, no envelope, nothing on top. See §3 below; this one has a trick to it.
- [ ] **Envelope**, sealed, front view. As large as Canva will give you (~1600px wide).
- [ ] **Wax seal**, separately, on its own. It needs to animate independently of the envelope.
- [ ] **Countdown frame** — the thin gold rule box. **Export this at 3× size, ~1100px wide.** Thin gold lines are the one asset where low resolution really shows.
- [ ] **Ornamental flourish divider** (the one used twice).
- [ ] **Icons**, each separately: church, reception building, place setting, waltz couple, champagne flutes, disco ball, dress + suit, gift box, envelope-with-bow, and the 4-point sparkle.

### Three text images (this replaces buying fonts)

Amoresa and Stoic are paid fonts. Canva licenses them for use *inside* Canva, not for putting on a website. But you don't need to buy anything — these three strings never change and never translate, so export them as **pictures of text**:

- [ ] `Jessica Anahí Mendoza` in **Amoresa** — transparent PNG, ~840px wide. **Crop it tight to the letters**, with no empty transparent space above or below. Extra padding baked into the file throws off the spacing on the page and makes her name look like it's floating.
- [ ] `José Arturo y María de Jesús Mendoza` in **Stoic** — transparent PNG, ~900px wide
- [ ] `Lizeth Alejandra y David Arturo Mendoza` in **Stoic** — transparent PNG, ~900px wide

Exporting a design you made in Canva is squarely covered by your Canva license. This will also match your mockup *better* than a webfont would, because Stoic has hundreds of swashes and alternates that Canva applies automatically and that can't be reproduced exactly in CSS.

---

## 3. The marble background specifically

Your current file is 735 × 1300. That's nearly enough width for a phone, but the page is about 6000 pixels tall, so it has to come from somewhere.

**Try this first — it makes everything else unnecessary:**

- [ ] In Canva, create a **new design at 1500 × 6000 px**.
- [ ] Drag the same marble background onto it so it fills the canvas.
- [ ] Download as PNG.

That gives a native-resolution, full-length background with no upscaling and no tiling. Ten minutes, and it's the best possible outcome.

If that doesn't work:

- [ ] Send me the cleanest plate you can get at any resolution, and I'll build a mirrored vertical tile — flipping a copy of the image and stacking it makes a join that's seamless by construction, and it repeats along one axis only, which avoids the wallpaper look you were right to worry about.

---

## 4. Fonts

Six fonts, all free on Google Fonts. Download the font families (the `.ttf` files) from fonts.google.com:

- [ ] Tangerine
- [ ] Great Vibes
- [ ] Cinzel Decorative
- [ ] **Source Serif 4** — note: this is what "Source Serif Pro" is called now. The old name returns nothing.
- [ ] Lancelot
- [ ] Ovo

- [ ] **Check the accents before anything else.** Type `Anahí — María de Jesús — Recepción — ¡Su presencia! — ¿Asistirás?` in each font and look at it. Ovo, Lancelot, and Tangerine are small single-weight releases and may be missing characters. A missing accent gets swapped for a different font mid-word and looks obviously broken. Tell me if any fail and I'll substitute.

---

## 5. Audio

- [ ] **Sparkle sound** — under 1.5 seconds.
- [ ] **Background music** — instrumental, 2–3 minutes, will loop. Keep the file under 3 MB.
- [ ] **Use royalty-free music, not a commercial track.** Pixabay Music and Free Music Archive are both free and fine. A copyrighted song won't break the site, but it's worth doing properly.

---

## 6. RSVP setup — start this early too

You asked whether you need a backend and whether free ones exist. **Yes and yes** — a Google Sheet with a script attached does everything you need, costs nothing, and has no submission limit. Your RSVPs land in a spreadsheet you can open on your phone.

Because you want to control **how many guests each family gets**, the form works as a lookup: a guest enters their phone number, the site greets them by name, and they count up how many adults and kids are coming. **They're never told their limit** — it only appears if they try to go past it, at which point they're told how many seats they have and can request one more. That way nobody is anchored to their maximum: a family of three doesn't discover they "have" five and find two more people to bring.

- [ ] Create a Google Sheet with two tabs, named exactly **`Invitados`** and **`Respuestas`**.
- [ ] In `Invitados`, columns: **Nombre | Teléfono | Invitados | Idioma**

  | Nombre | Teléfono | Invitados | Idioma |
  |---|---|---|---|
  | Familia Ramírez | 2815550134 | 5 | es |
  | Tía Carmen | 7135550199 | 1 | en |

- [ ] **Fill in your guest list.** This is the real work — one row per household. Notes on each column:
  - **Nombre** — written exactly as you'd want that person greeted, since the site shows it back to them verbatim. "Tía Carmen" displays as "Tía Carmen," not "Familia Tía Carmen."
  - **Teléfono** — **digits only**. No dashes, spaces, parentheses, or `+1`. This is what guests are matched on, so consistency matters more than readability here.
  - **Invitados** — the total number of seats for that household. They'll split it into adults and kids themselves.
  - **Idioma** — `es` or `en`. Leave it blank if you're not sure and it'll default to Spanish. This is mainly so you know what language to write each family's reminder texts in.

  Do this while the site is being built; it's the long pole.
- [ ] In `Respuestas`, columns: **Marca de tiempo | Teléfono | Nombre | Asistirá | Adultos | Niños | Lugares solicitados | Motivo | Teléfono alt | Mensaje | Idioma** — then leave it alone. The script fills it.
  - `Adultos` + `Niños` is your real headcount. `Lugares solicitados` is extra seats people asked for and haven't been given, so they never quietly inflate your count.
- [ ] **Decide whether to allow extra-seat requests at all.** If someone tries to go past their seats, the form can offer a "request one more" option that logs it for you to answer by text. Nobody who stays within their number ever sees it. If you'd rather the limit be final, say so and it comes out — the message then just says to text you, and each extra seat is a plate and a chair.
- [ ] Set the Sheet's sharing to **restricted**, not "anyone with the link." It has guests' phone numbers in it.
- [ ] Decide **whose Google account** owns it — yours or a parent's. Whoever it is gets the email notifications.
- [ ] Give me **a phone number for the fallback text link**, used if someone's connection drops mid-RSVP.
- [ ] Decide whether you want an **email every time someone confirms.** (I'd say yes.)

**After the party:** delete the Sheet. It's a list of your guests' phone numbers.

---

## 7. Sending it out

For distributing the link and chasing RSVPs:

- **WhatsApp** — free. If a lot of family is in Mexico or first-generation, this is where they already are. Groups for updates, broadcast lists for announcements (note: broadcast recipients must have you saved as a contact, which trips people up).
- **Group text from your phone** — free, but iMessage caps group size and Android group MMS gets unreliable past ~20 people. Send in batches of 10–15.
- **A bulk texting service** — the TikTok method. SimpleTexting, Textedly, EZ Texting. Roughly $20–40/month, cancel after. You get scheduled sends and reminder workflows. Read their rules first; these platforms have consent requirements and do suspend accounts over uploaded lists.

**Don't use bit.ly or TinyURL on the link.** It's tempting because the random path is ugly, but it works against you: shortened links in bulk texts get flagged as spam and silently dropped, a text from an unfamiliar number with a bit.ly link looks like phishing, and the short codes are short enough that people scan them in bulk — which undoes the whole point of the random path. Your own domain is more likely to be delivered and more likely to be trusted. Nobody types the link anyway; they tap it.

If you want something for printed items — invitations, a sign at the reception — use a **QR code** pointing at the real URL. Same benefit, none of the downsides.

**Honestly:** unless you're over ~150 guests, WhatsApp or plain SMS in batches will do it, and you'll have the Sheet to track who hasn't replied.

---

## 8. Questions I still need answered

**Content**
- [x] ~~**Accents.**~~ Settled — accents everywhere. Canonical spellings, now applied throughout both documents: **Jessica Anahí Mendoza**, **José Arturo y María de Jesús Mendoza**, **Lizeth Alejandra y David Arturo Mendoza**.

  **One action this creates for you:** the two Stoic name images and the Amoresa name image are pictures of text, so the accents have to be right *in Canva* before you export. Re-check `Anahí`, `José`, `María`, and `Jesús` on the canvas — nothing downstream can fix a missing accent baked into a PNG.
- [x] ~~**The itinerary timing.**~~ Confirmed as intended — dinner is served 6:00–8:00 PM, and the blessing is at 7:00 PM because guests won't all have arrived by six. Noted in the spec so nobody "corrects" it during the build.
- [x] ~~**Review the English translations.**~~ Approved as written. The copy deck in the spec is final.
- [x] ~~**Padrinos/madrinas or court of honor.**~~ No court — no section. Section order stays exactly as specified.

**Choices** — all settled.
- [x] ~~Countdown target~~ — counts down to **Mass, 12:00 PM CDT on August 29, 2026**.
- [x] ~~Header buttons~~ — **language toggle top-left, music toggle top-right.**
- [x] ~~Calendar buttons~~ — **two separate entries**, Misa and Recepción.

---

## 9. Before you send the link

- [ ] Open it on a **real iPhone** and a **real Android**, not just a computer. Audio and the reveal animation behave differently on actual phones.
- [ ] Test the whole RSVP on the live site: a known number, an unknown number, and a submission.
- [ ] Check both languages on a small phone — *Código de Vestimenta* is the longest heading and most likely to break the layout.
- [ ] Turn your phone sideways and make sure nothing spills off the screen.
- [ ] Open it on a laptop too — it should look like a card sitting on a pink surface, not a stretched phone screen.
- [ ] On Android, pull down from the top of the invitation. It should bring back the envelope, **not** refresh the page.
- [ ] Have one non-technical relative try it in front of you and say nothing while they do. That test finds more than all the others.
