# REPUBLIK +62: Menteri Mangkrak (working title)

A hardcore-difficulty satirical management/roguelite about running a ministry in a state where the budget evaporates, the project never finishes, and the only thing that works is going viral.

> **Legal/safety note.** Characters are *fictional composite archetypes with parody names*, built from documented public events, not portraits of named individuals. Indonesian defamation law (UU ITE / KUHP) is real. Keep it that way: mock the system and the pattern, never name or caricature a real person as guilty of something they have not been convicted of.

---

## 1. Research: raw material (documented events)

| Theme | What happened | Why it is game-able |
|---|---|---|
| **Mega-corruption** | PT Timah tin case: prosecutors estimate ~Rp 300T state loss, mostly environmental damage ([SEA Actions](https://www.seaanticorruption.org/2025/07/10/when-greed-met-tin-the-unfolding-catastrophe-of-indonesias-largest-corruption-case/), [Wikipedia](https://en.wikipedia.org/wiki/Indonesian_tin_mining_scandal)). Pertamina fuel case (2025) first put at Rp 193.7T, later reports ~Rp 285T ([oilprice](https://oilprice.com/Latest-Energy-News/World-News/Indonesia-Widens-17-Billion-Corruption-Probe-Into-State-Energy-Firm.html), [East Asia Forum](https://eastasiaforum.org/2025/07/15/indonesias-billion-dollar-fuel-fraud-exposes-deep-corruption-crisis/)). | Numbers so large they become a joke. Loss counters with absurd zeros. |
| **Digital collapse** | June 2024 ransomware (Brain Cipher/LockBit variant) hit the National Data Center; 282 agencies affected, ~$8M ransom demanded, only ~44 agencies had backups ([Investortrust](https://investortrust.id/national/31450/telkom-data-pemerintah-yang-diserang-ransomware-tak-bisa-dipulihkan), [detik](https://inet.detik.com/security/d-7409192/detik-detik-ransomware-brain-cipher-lumpuhkan-pusat-data-indonesia)). Immigration services were disrupted. | "Did you back up?" "No." as a recurring loss condition. |
| **Flagship program failure** | Free Meals (MBG): Lancet analysis counts 177 outbreaks, 20,000+ children by end-2025; mothers protested with pots and pans ([Lancet](https://www.thelancet.com/journals/lansea/article/PIIS2772-3682(26)00019-3/fulltext), [ABC](https://www.abc.net.au/news/2025-10-05/indonesia-free-meal-program-poisons-thousands-of-kids/105836302)). | Real harm, so handle with care: satirize the *officials' response* (denial, renaming, blaming), never the victims. |
| **White-elephant infrastructure** | Whoosh rail: ~$6B budget to ~$7.3B, ~75% China Development Bank loan, ridership short of projections, Rp 4.2T loss in 2024; the operator's parent called it a "ticking time bomb" ([Asia Sentinel](https://www.asiasentinel.com/p/indonesia-high-speed-rail-time-bomb), [Rail Journal](https://www.railjournal.com/financial/pt-kai-takes-chinese-loans-for-whoosh-cost-overrun/), [Indonesia Business Post](https://indonesiabusinesspost.com/5064/corporate-affairs/jakarta-bandung-high-speed-rail-a-ticking-time-bomb-amid-mounting-debt-kai)). | Cost-overrun mechanic, "proyek mangkrak" (stalled project) core loop. |
| **Fugitives** | Harun Masiku: named KPK suspect Jan 2020, Interpol Red Notice, years later still not caught, with activists alleging protection ([Jakarta Post](https://www.thejakartapost.com/indonesia/2023/08/13/kpk-search-continues-for-graft-fugitive-harun-masiku), [Tempo](https://en.tempo.co/amp/1677314/anti-graft-activists-deems-kpk-lack-of-commitment-to-find-harun-masiku)). | Hide-and-seek / "kabur" stealth levels where the pursuer is suspiciously slow. |
| **Everyday graft** | Ombudsman recorded 16,000 public-service maladministration complaints in 2021, ~11% about pungli; police were the most-cited bribery category in a TI survey ([Ombudsman RI](https://ombudsman.go.id/news/r/ombudsman-tahun-ini-aduan-pungli-di-layanan-publik-masih-tinggi), [Bisnis](https://kabar24.bisnis.com/read/20211215/15/1478063/ini-sebabnya-pungli-di-indonesia-sulit-diberantas)). A minister said it persists because society treats it as normal. | Every NPC interaction has a "biaya administrasi" toll. |
| **"No viral, no justice"** | Public perception that cases move only once social media makes them viral ([kumparan](https://kumparan.com/skyyblauw/indonesia-no-viral-no-justice-24HyLPIREBI), [Unima](https://ejurnal.unima.ac.id/index.php/paradigma/article/download/9852/5268/39011)). | **The central mechanic** (see below). |
| **Protest culture / satire tradition** | Aug 2025 protests began over lawmakers' housing allowance (~Rp 50M/month, reported as ~20x minimum wage in some regions); a delivery rider, Affan Kurniawan, was killed by a police armored vehicle; protesters flew the One Piece Jolly Roger instead of the national flag ([Wikipedia](https://en.wikipedia.org/wiki/August_2025_Indonesian_protests), [Straw Hats' Jolly Roger](https://en.wikipedia.org/wiki/Straw_Hats'_Jolly_Roger)). | Proves the audience: Indonesians already satirize through memes and pop culture. Tone guide: laugh *with* the public, never at the dead. |

**Research gaps (verify before shipping):** e-KTP case details, Harun Masiku's status after June 2024, whether the Whoosh restructuring has finished, and exact Pertamina loss figures (sources range widely). Re-check anything that becomes in-game "fact".

---

## 2. Linking it to a game

### Premise
You are the newly appointed **Menteri** of a random ministry. Your official KPI is "serve the people." Your real KPI is surviving the term without being named a suspect, while the budget shrinks at every layer it passes through.

### Genre
Hardcore roguelite management + microgame chaos (WarioWare meets Papers, Please meets Reigns). Short runs (15-20 min = one "term"), brutal difficulty, permadeath = "dipanggil KPK" or "reshuffle."

### Core mechanic: the Leaking Budget
Budget travels as a visible stream of coins through tiers: Pusat → Kementerian → Dirjen → Dinas → Vendor → Lapangan. Each tier skims a visible percentage ("potongan"). Rp 100 allocated, Rp 11 reaches the actual road/school/kitchen. You win nothing by being honest; you can *plug leaks*, but each plug makes a boss angry. The satire is in the tuning.

### Hardcore pillars
1. **Viral Meter ("No Viral, No Justice").** Problems are *ignored* until a post goes viral; only then does the bureaucracy sprint (for 24 hours, then forgets). Players must manufacture virality, or spin it away.
2. **Proyek Mangkrak.** Every project you launch has a cost-overrun clock. Finishing is rare and usually worse than abandoning.
3. **Backup? What Backup?** Random "ransomware" events delete a save-slot's worth of progress unless you paid for a boring Backup upgrade earlier. The game teaches by punishing.
4. **Ngeles Mode (spin).** Press-conference microgame: pick the dodge phrase that fits the question. Wrong match = scandal escalates.
5. **Rapat Maraton.** Meeting microgame: stay awake, nod, sign the right paper among decoys.
6. **Kabur.** Stealth chase where the pursuer's speed is tied to how many allies you've paid.
7. **Reshuffle Roulette.** Every few minutes a random cabinet swap moves you to a ministry you know nothing about. Skills reset, grudges don't.

### Microgames (examples)
- **Tender Gaib:** rig the bidding by matching the "pemenang" in a lineup before the timer ends.
- **Gunting Pita:** ribbon-cutting at a half-built bridge; keep the camera angle hiding what's missing.
- **Laporan ABS:** "Asal Bapak Senang." Tweak a report's charts so every metric goes up and the boss smiles.
- **Dapur Darurat (careful):** a *food-safety audit* level where the player actually *must* do the right thing against bureaucratic obstacles. Plays it straight to avoid mocking victims.

### Win/lose
- **Lose:** Rakyat Rage hits 100, KPK Heat hits 100, or Budget hits 0 before any project completes.
- **"Win":** survive the term. The ending screen compares your "Legacy" to your "Wealth" and a final credit-roll: *"Semua tokoh fiktif. Kemiripan hanya kebetulan yang sangat sistemik."* ("All characters fictional. Resemblance is a very systemic coincidence.")

### Tone and satire rules
- **Punch up, not down.** Targets: officials, contractors, party machines, bureaucratic ritual. Never ordinary workers, victims, or dead protesters.
- **Pattern over person.** Jokes about *how the system works*, not "this named man is a crook."
- **Rakyat as player's conscience.** Recurring "Warga Netizen" chorus reacts like a comment section.
- **Language:** mix of formal bureaucratic Indonesian (*"mohon izin, ndan"*, *"sesuai arahan"*, *"dalam rangka"*) and street slang for contrast.

---

## 3. Characters (fictional archetypes inspired by documented patterns)

| Character | Archetype | Signature behavior / ability | Real pattern parodied |
|---|---|---|---|
| **Bapak Menteri Anu** (playable) | The Appointee | Starts with a 5-star title, 0 relevant skills. "Sesuai arahan" shields one hit per level. | Cabinet posts for reasons other than expertise |
| **Dirjen Mark-Up** | The Skimmer | Always takes "just 10%." Each tier he sits on adds a visible coin leak. | Budget mark-ups; tin/fuel mega-cases |
| **Pak Vendor "PT Sejahtera Abadi Jaya Makmur"** | The Contractor | Wins every tender. Delivers 40% of the bridge and a lot of sparkling banners. | Stalled and overrun projects (Whoosh-style overruns) |
| **Staf Ahli Ngeles** | The Spin Doctor | Sells you dodge phrases. "Itu hoaks, tapi kami sudah evaluasi." | Press-conference deflection |
| **Mas Admin Server** | The IT Chief | Proudly states "Backup itu kan opsional." Triggers ransomware events. | 2024 National Data Center breach |
| **Tuan Buron (Si Kabur)** | The Fugitive | Boss-level that's always "in the country, we believe." Appears in the credits. | Long-running fugitive suspects |
| **Bu Anggota Dewan** | The Legislator | Allowance shown as a number that grows across the run. Votes yes on anything with a snack box. | Lawmaker benefit scandals |
| **Komandan Sidak** | The Photo-Op Inspector | Appears only when virality > 70, does one dramatic inspection, vanishes. | "No viral, no justice" |
| **Ibu Warga & Abang Ojol** | The Public | Not enemies. Their anger meter is your clock; they can be *helped* by the rare honest action. | Protest culture, pots-and-pans moms (handle respectfully) |
| **Bapak Penegak (KPK-ish)** | The Auditor Boss | Slow, then sudden. Heat decays if you "settle," which is itself a mini-joke about the system. | Anti-graft enforcement |

---

## 4. Tech/structure suggestion

The repo currently holds a Godot 4 toddler car game. Recommend a **separate project folder** (or new repo) for this one so the toddler game keeps its own audience and CI/Pages deploy. Suggested stack: Godot 4 (2D, fast iteration, exports to web), data-driven events in JSON so the community can mod new scandals.

## 5. Suggested next steps
1. Pick a name and a ministry to prototype the vertical slice with (Public Works: the bridge + Leaking Budget is the easiest to read).
2. Build the Leaking Budget screen alone: coin streams, tiers, percentages. Playtest whether it's funny with zero art.
3. Add Viral Meter + one microgame (Ngeles press conference).
4. Do a sensitivity pass on anything referencing real harm (food poisoning, protester deaths) before showing it publicly.
