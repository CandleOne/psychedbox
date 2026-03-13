/**
 * Seed script: Insert the "Psychedelics in the Deep South" blog post into the database.
 *
 * Usage:  node data/seed-south-blog.mjs
 */

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "psychedbox.db");
const db = new Database(dbPath);

const slug = "psychedelics-in-the-deep-south-grassroots-reform-and-the-road-ahead";
const title =
  "Psychedelics in the Deep South: Grassroots Reform, Legislative Breakthroughs, and the Road Ahead";
const description =
  "From Georgia's historic House vote to grassroots organizers in Alabama, Louisiana, and Florida, the psychedelic reform movement is taking root in the most unlikely — and most important — region of the country.";
const category = "News";
const tags = JSON.stringify([
  "psychedelics",
  "deep south",
  "legislation",
  "reform",
  "decriminalize nature",
  "veterans",
  "grassroots",
  "psilocybin",
  "georgia",
  "florida",
  "alabama",
  "louisiana",
  "community",
]);
const image = "/uploads/psychedelics-in-the-south-cover.png";
const imageAlt =
  "Illustrated map of the Deep South highlighting psychedelic reform organizations and grassroots chapters";
const author = "PsychedBox Team";
const readTime = "14 min read";

const body = JSON.stringify([
  {
    type: "paragraph",
    text: "When people talk about psychedelic reform in America, the conversation usually centers on Oregon, Colorado, or the research hubs of Johns Hopkins and NYU. But there's another story unfolding — quieter, grittier, and arguably more consequential — in the states that rarely make the headlines: Georgia, Florida, Alabama, and Louisiana. The Deep South.",
  },
  {
    type: "paragraph",
    text: "The 2025 and 2026 legislative sessions have seen a record-breaking surge of psychedelics-related bills across the country. More than three dozen were introduced across over a dozen states. Yet the South — with its conservative politics, strict drug laws, and deep military culture — has been widely viewed as a no-go zone for reform. That perception is changing, fast.",
  },
  {
    type: "paragraph",
    text: "This post is a field guide to the psychedelic reform landscape across the Deep South: the legislation being filed, the organizations doing the groundwork, and why this region may be the most important frontier in the entire psychedelic movement.",
  },

  // ── GEORGIA ────────────────────────────────────────────────────────────────
  {
    type: "heading",
    text: "Georgia: A Crack in the Wall",
  },
  {
    type: "paragraph",
    text: "Georgia is the Southern state to watch right now. In February 2025, House Bill 382 was introduced to amend Georgia's classification of psilocybin by excluding FDA-approved formulations from the Schedule I controlled substances list. If the FDA greenlights a specific psilocybin-based medication, Georgia law would no longer treat it as a strict Schedule I substance.",
  },
  {
    type: "paragraph",
    text: "In March 2026, HB 382 passed the Georgia House with an extraordinary 167-to-0 vote — a unanimous, bipartisan statement that made national news in psychedelic advocacy circles. The bill now heads to the Georgia Senate, where its fate will hinge on committee assignments and the political calculus of an election year.",
  },
  {
    type: "paragraph",
    text: "A second bill, House Bill 717, went even further. Introduced by a bipartisan group of state representatives, HB 717 would amend Georgia law to allow psychedelic-assisted treatment and therapy to be provided by licensed healthcare professionals once FDA approval is granted. The bill envisioned a dedicated Board to establish rules and issue licenses beginning in July 2026. Although neither HB 717 nor HB 382 passed during the 2025 session, both were eligible for reconsideration — and HB 382's 2026 passage shows the momentum is real.",
  },
  {
    type: "paragraph",
    text: "Georgia also has an institutional asset that could become central to the reform narrative: the Emory Healthcare Veterans Program. Based in Atlanta, the program has experience in both veteran treatment and emerging psychedelic therapies, and studies coming out of the institution have shown substantial evidence supporting psilocybin-assisted psychotherapy for treatment of depressive disorders.",
  },

  // ── FLORIDA ────────────────────────────────────────────────────────────────
  {
    type: "heading",
    text: "Florida: Grassroots Pressure in the Sunshine State",
  },
  {
    type: "paragraph",
    text: "Florida remains one of the strictest states in the Southeast when it comes to psychedelic substances — psilocybin is classified as a Schedule I controlled substance, and possession carries serious felony penalties. But beneath the legislative surface, the grassroots infrastructure is growing fast.",
  },
  {
    type: "paragraph",
    text: "Florida is also home to the Psilocybin Access and Services Act, a bill introduced in recent legislative sessions that would create a state-regulated framework for psilocybin-assisted therapy. While the bill has not yet advanced out of committee, it has generated significant discussion among Florida legislators and drawn support from veterans' advocacy groups statewide.",
  },

  // ── ALABAMA ────────────────────────────────────────────────────────────────
  {
    type: "heading",
    text: "Alabama: Among the Strictest Laws in the Nation",
  },
  {
    type: "paragraph",
    text: "Alabama has some of the harshest psychedelic penalties in the country. Under Alabama Code § 13A-12-212, possessing psilocybin mushrooms is classified as a felony, carrying penalties of 1 to 5 years in prison or fines up to $7,500. Penalties for sales or transfers are even more severe, with sentences ranging from 2 to 20 years of imprisonment.",
  },
  {
    type: "paragraph",
    text: "Despite this hostile legal environment, there is growing interest in psychedelic-assisted therapies, particularly through the veterans' advocacy lens. Alabama is home to a large military population, and organizations like VETS (Veterans Exploring Treatment Solutions) have identified the state as a key target for education and outreach. Advocates have cited Alabama — alongside Mississippi, South Carolina, and Tennessee — as a state with increasing interest in ibogaine research funding for veteran PTSD treatment.",
  },

  // ── LOUISIANA ──────────────────────────────────────────────────────────────
  {
    type: "heading",
    text: "Louisiana: Legal Ambiguity and Grassroots Energy",
  },
  {
    type: "paragraph",
    text: "Louisiana's legal framework around psychedelics is uniquely murky. State law prohibits psilocybin under the same category as heroin and LSD, and does not recognize any medicinal benefits of psilocybin mushrooms. However, the law places psilocybin as less dangerous than opiates and notably does not specify detailed consequences for possessing, selling, or cultivating psychedelic mushrooms — creating a legal grey zone that makes grassroots community building all the more important.",
  },
  {
    type: "paragraph",
    text: "This ambiguity is part of what makes the grassroots organizations operating in Louisiana — including the Psychedelic Society of New Orleans and the Louisiana Psychedelic Society — so vital. They are creating spaces for education, harm reduction, and community support in a state where the legal landscape could shift in either direction.",
  },

  // ── GRASSROOTS ORGANIZATIONS ───────────────────────────────────────────────
  {
    type: "heading",
    text: "The Grassroots Network: Who's Doing the Work",
  },
  {
    type: "paragraph",
    text: "Across the Deep South, a patchwork of grassroots organizations is laying the foundation for reform — hosting community meetings, running harm reduction education, lobbying local officials, and building the kind of on-the-ground infrastructure that every successful legalization movement in history has required. Here are the key players.",
  },

  {
    type: "subheading",
    text: "Decriminalize Nature Florida",
  },
  {
    type: "paragraph",
    text: "The Florida chapter of Decriminalize Nature works to decriminalize entheogenic plants and fungi across the state. Operating out of a statewide network, DN Florida educates communities about the therapeutic potential of plant medicines, advocates for policy reform at the municipal and state level, and connects Floridians with resources for safe and intentional use. Their work is particularly focused on building political will in a state with a large and diverse population that spans deep-red rural counties and progressive urban centers. Follow their work on [Instagram](https://www.instagram.com/decrimnaturefl).",
  },

  {
    type: "subheading",
    text: "Decriminalize Nature Georgia",
  },
  {
    type: "paragraph",
    text: "Decriminalize Nature Georgia (DecriminalizeNatureGeorgia.org) has been a driving force behind the advocacy that made Georgia's legislative breakthroughs possible. The chapter focuses on community education, lobbying state legislators, and building coalitions with healthcare professionals and veterans' groups. Their work helped create the political environment in which bills like HB 382 and HB 717 could gain traction — and their continued advocacy is critical as HB 382 moves to the Senate. Follow their work on [Instagram](https://www.instagram.com/decriminalizenaturegeorgia).",
  },

  {
    type: "subheading",
    text: "Decriminalize Nature Baton Rouge",
  },
  {
    type: "paragraph",
    text: "The Baton Rouge chapter of Decriminalize Nature operates in one of Louisiana's most politically complex environments. Through community outreach, social media education, and partnership with local advocates, DN Baton Rouge is working to shift public perception around entheogenic plants and push for municipal-level decriminalization. You can connect with them on Instagram at @decrimnaturebr or via email at Decrimnaturebr@gmail.com. Follow their work on [Instagram](https://www.instagram.com/decriminalizenaturebatonrouge).",
  },

  {
    type: "subheading",
    text: "Psychedelic Society of New Orleans",
  },
  {
    type: "paragraph",
    text: "The Psychedelic Society of New Orleans serves as a hub for psychedelic education, harm reduction, and community building in one of the South's most culturally vibrant cities. The organization hosts regular meetups, discussion circles, and educational events that bring together people from all walks of life to explore the science, history, and personal dimensions of psychedelic experiences. In a city with deep roots in spiritual and ceremonial traditions, the Society provides a grounded, evidence-based complement to New Orleans' existing culture of consciousness exploration. Learn more at their [website](https://www.psychedelicsocietynola.com).",
  },

  {
    type: "subheading",
    text: "Louisiana Psychedelic Society",
  },
  {
    type: "paragraph",
    text: "The Louisiana Psychedelic Society takes a statewide approach to advocacy and education. The organization focuses on connecting individuals across Louisiana who are interested in psychedelic science, therapy, integration, and policy reform. Through workshops, guest speaker events, and community networking, the LPS is building a coalition that can advocate for legislative change as the national reform movement gains momentum. Connect with them on [Facebook](https://www.facebook.com/share/1DD3BZ6MK7/).",
  },

  {
    type: "subheading",
    text: "People of TechnoColor",
  },
  {
    type: "paragraph",
    text: "People of TechnoColor is a collective that centers the experiences and leadership of people of color in the psychedelic space. Recognizing that communities of color have been disproportionately harmed by drug criminalization — and historically excluded from the emerging psychedelic wellness industry — People of TechnoColor creates spaces for BIPOC individuals to engage with psychedelic education, healing, and advocacy on their own terms. Their work is essential in ensuring that the psychedelic reform movement in the South is equitable and inclusive. Connect with them on [Facebook](https://www.facebook.com/share/g/1CERkU3AGd/).",
  },

  {
    type: "subheading",
    text: "Mobile Bay Psychedelic Society",
  },
  {
    type: "paragraph",
    text: "Operating on the Alabama Gulf Coast, the Mobile Bay Psychedelic Society provides a rare space for psychedelic community building in one of the most legally restrictive states in the nation. The Society hosts discussion groups, educational events, and integration circles — creating a supportive environment for people to explore psychedelic experiences safely and connect with others in a region where open conversation about these topics can carry real social risk. Follow them on [Instagram](https://www.instagram.com/mobilebaypsychedelics).",
  },

  {
    type: "subheading",
    text: "Psychedelic Discussion & Integration Group",
  },
  {
    type: "paragraph",
    text: "This community-centered group provides a space for individuals to process and integrate psychedelic experiences in a supportive, non-judgmental setting. Integration — the practice of making sense of and applying insights from psychedelic experiences to everyday life — is increasingly recognized as a critical component of safe and effective psychedelic use. Groups like this fill a vital gap in the South, where access to psychedelic-informed therapists and clinicians is extremely limited.",
  },

  {
    type: "subheading",
    text: "Birmingham Psychedelic Society",
  },
  {
    type: "paragraph",
    text: "The Birmingham Psychedelic Society brings together advocates, educators, and community members across the Birmingham metro area to foster open dialogue about psychedelic science, therapy, and reform. The group complements the city's integration-focused community by providing a broader platform for education, networking, and political engagement in one of Alabama's most important urban centers. Connect with them on [Facebook](https://www.facebook.com/share/g/1A71JEsVHS/).",
  },

  {
    type: "subheading",
    text: "Huntsville Psychedelic Society",
  },
  {
    type: "paragraph",
    text: "Based in Huntsville, Alabama — a city better known for its aerospace industry and military installations — the Huntsville Psychedelic Society is building community around psychedelic education and advocacy in an unlikely but strategically important location. Huntsville's large veteran and defense-sector population makes it a natural target for conversations about psychedelic-assisted therapy for PTSD and depression, and the Society is working to bridge the gap between cutting-edge psychedelic research and local community needs. Follow them on [Instagram](https://www.instagram.com/huntsvillepsychedelicsociety).",
  },

  {
    type: "subheading",
    text: "North Georgia Community for Psychedelics and Transformation",
  },
  {
    type: "paragraph",
    text: "Serving the northern reaches of the state, the North Georgia Community for Psychedelics and Transformation focuses on education, community support, and personal growth through responsible engagement with psychedelic experiences. The group serves as a regional anchor for Georgians outside of Atlanta who are interested in psychedelic science, integration, and the broader movement toward reform. Find upcoming events on [Meetup](https://www.meetup.com/north-georgia-society-for-psychedelics-transformation/).",
  },

  {
    type: "subheading",
    text: "PsyAtlanta",
  },
  {
    type: "paragraph",
    text: "PsyAtlanta is Atlanta's local psychedelic community hub, bringing together therapists, researchers, advocates, and curious community members for regular events, workshops, and discussions. As the largest city in the Southeast, Atlanta is a natural epicenter for psychedelic advocacy in the region, and PsyAtlanta plays a critical role in connecting the city's diverse population with evidence-based psychedelic education and harm reduction resources.",
  },

  {
    type: "subheading",
    text: "Athens Psychedelic Society",
  },
  {
    type: "paragraph",
    text: "The Athens Psychedelic Society serves the Athens, Georgia community \u2014 home to the University of Georgia and a thriving counterculture scene \u2014 with education, harm reduction resources, and community events centered on psychedelic science and advocacy. The Society provides a vital connection point for students, researchers, and community members interested in the growing body of evidence supporting psychedelic-assisted therapies. Follow them on [Instagram](https://www.instagram.com/athenspsychedelic).",
  },

  {
    type: "subheading",
    text: "Tampa Bay Psychedelic, Inc.",
  },
  {
    type: "paragraph",
    text: "Tampa Bay Psychedelic, Inc. is a nonprofit organization dedicated to psychedelic education, community building, and advocacy in the Tampa Bay region of Florida. The organization hosts regular events including speaker series, film screenings, and community discussions, and works to build support for psychedelic policy reform among Florida's Gulf Coast communities. Their nonprofit structure enables them to pursue grants and partnerships that sustain long-term advocacy work. Follow them on [Instagram](https://www.instagram.com/tampabaypsychedelictribe).",
  },

  {
    type: "subheading",
    text: "Space Coast Psychedelic Society",
  },
  {
    type: "paragraph",
    text: "Serving Florida's Space Coast — the Brevard County area known for Kennedy Space Center and a large military and aerospace workforce — the Space Coast Psychedelic Society provides education, community support, and harm reduction resources. Like Huntsville, the Space Coast's concentration of veterans and defense-sector workers creates a natural constituency for psychedelic-assisted therapy advocacy, and the Society is working to connect those communities with the latest research and resources. Follow them on [Instagram](https://www.instagram.com/spacecoastpsychedelicsociety).",
  },

  {
    type: "subheading",
    text: "South Florida Psychedelic Society",
  },
  {
    type: "paragraph",
    text: "The South Florida Psychedelic Society serves the Miami-Dade, Broward, and Palm Beach communities with psychedelic education, integration support, and advocacy. South Florida's diverse, international population and its proximity to Latin American and Caribbean traditions of plant medicine give the Society a unique cultural context. The group hosts regular meetups and educational events and works to build political support for psychedelic reform in one of the most densely populated regions in the Southeast. Connect with them on [Facebook](https://www.facebook.com/share/g/18GQJ1cAxH/).",
  },

  // ── VETERANS ───────────────────────────────────────────────────────────────
  {
    type: "heading",
    text: "The Veterans Angle: The South's Most Compelling Pathway",
  },
  {
    type: "paragraph",
    text: "In a region defined by its military installations, veteran populations, and patriotic culture, veterans' advocacy may be the most politically viable entry point for psychedelic reform. And the momentum here is genuinely exciting.",
  },
  {
    type: "paragraph",
    text: "The precedent was set in Texas. In 2021, Texas passed HB 1802 — the first law of its kind in the country — directing the state to conduct a clinical trial for psychedelic-assisted therapies for veterans struggling with PTSD. It passed with overwhelming bipartisan support. Then in 2025, Texas built on that success by passing Senate Bill 2308, establishing the Texas Ibogaine Initiative — a first-of-its-kind, state-funded public-private partnership clinical research program focused on ibogaine, backed by $50 million in state funding.",
  },
  {
    type: "paragraph",
    text: "The ripple effects are being felt across the South. Advocates have cited efforts in Alabama, Mississippi, South Carolina, and Tennessee as states with increasing interest in ibogaine research funding for veteran PTSD treatment.",
  },
  {
    type: "paragraph",
    text: "Organizations like VETS (Veterans Exploring Treatment Solutions) have joined forces with the Navy SEAL Foundation, Green Beret Foundation, and Wounded Warrior Project to launch the VALOR Coalition — a united effort to advance mental health policy, expand access to psychedelic-assisted therapies, and end the veteran suicide crisis. In 2024, the VA announced funding for MDMA- and psilocybin-assisted therapy studies, marking the first time the agency directly supported psychedelic research for veteran mental health.",
  },
  {
    type: "quote",
    text: "The veteran community is uniquely positioned to change hearts and minds on psychedelic therapy in the South. These are people who have served their country, who are suffering, and who are finding healing through these medicines. That story transcends political lines.",
    attribution: "PsychedBox Editorial",
  },

  // ── FEDERAL ────────────────────────────────────────────────────────────────
  {
    type: "heading",
    text: "The Federal Wild Card",
  },
  {
    type: "paragraph",
    text: "At the federal level, a fascinating political tension is brewing. The Kennedy-aligned MAHA (Make America Healthy Again) movement has included psychedelic reform in its health freedom platform, creating an unusual alignment between progressive psychedelic advocates and a segment of the conservative health-freedom movement. At the same time, more traditionally conservative factions remain deeply skeptical of any drug policy liberalization.",
  },
  {
    type: "paragraph",
    text: "This federal ambiguity creates both risks and opportunities for Southern states. A favorable federal signal — such as FDA approval of psilocybin-assisted therapy — could unlock Georgia's HB 382 framework overnight. Conversely, a crackdown could set back years of grassroots progress. Advocates believe that targeted lobbying, veteran-centered messaging, and sustained public education campaigns will be the keys to navigating this uncertain landscape.",
  },

  // ── WHY IT MATTERS ─────────────────────────────────────────────────────────
  {
    type: "heading",
    text: "Why the South Matters More Than You Think",
  },
  {
    type: "paragraph",
    text: "An analytic model based on marijuana legalization timelines projects that a majority of states will legalize psychedelics by 2033–2037. But that timeline only holds if the groundwork is being laid now in the states that matter most — and that includes Georgia, Alabama, Louisiana, and Florida.",
  },
  {
    type: "paragraph",
    text: "The organizations profiled in this post — Decriminalize Nature chapters, psychedelic societies, integration groups, and equity-focused collectives — are doing the hardest work in the hardest places. They're hosting meetings in living rooms, lobbying skeptical legislators, building coalitions with veterans and healthcare professionals, and creating community in regions where openness about psychedelic use can carry real personal and professional risk.",
  },
  {
    type: "paragraph",
    text: "If psychedelic reform only happens on the coasts, it's not a national movement — it's a cultural bubble. The Deep South is where the movement proves whether it can truly reach everyone.",
  },

  // ── GET INVOLVED ───────────────────────────────────────────────────────────
  {
    type: "heading",
    text: "Get Involved: Find Your Community",
  },
  {
    type: "paragraph",
    text: "Ready to connect with the psychedelic reform movement in the South? Here's where to start:",
  },
  {
    type: "list",
    items: [
      "Decriminalize Nature – Find your local chapter: decriminalizenature.org/take-action/find-a-local-chapter/",
      "Global Psychedelic Society Locator – Find groups near you: globalpsychedelic.org/locator/",
      "Psychedelic Alpha – Join the community and stay informed: psychedelicalpha.com/join",
      "VETS (Veterans Exploring Treatment Solutions) – Learn about psychedelic-assisted therapy for veterans: vfroundation.org",
      "VALOR Coalition – Veterans' coalition for psychedelic mental health policy: valorcoalition.org",
    ],
  },
  {
    type: "quote",
    text: "The most powerful thing you can do for psychedelic reform in the South is show up. Join a local meeting. Share this post. Have the conversation. The groundwork being laid today in these communities is what makes tomorrow's policy changes possible.",
    attribution: "PsychedBox Editorial",
  },
]);

// Check for existing post with same slug
const existing = db
  .prepare("SELECT id FROM blog_posts WHERE slug = ?")
  .get(slug);
if (existing) {
  console.log(
    `Post with slug "${slug}" already exists (id: ${existing.id}). Updating...`
  );
  db.prepare(
    `
    UPDATE blog_posts
    SET title = ?, description = ?, category = ?, tags = ?, image = ?, image_alt = ?,
        author = ?, read_time = ?, body = ?, published = 1, updated_at = datetime('now')
    WHERE slug = ?
  `
  ).run(
    title,
    description,
    category,
    tags,
    image,
    imageAlt,
    author,
    readTime,
    body,
    slug
  );
  console.log("Post updated successfully.");
} else {
  const result = db
    .prepare(
      `
    INSERT INTO blog_posts (slug, title, description, category, tags, image, image_alt, author, read_time, body, published, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))
  `
    )
    .run(
      slug,
      title,
      description,
      category,
      tags,
      image,
      imageAlt,
      author,
      readTime,
      body
    );
  console.log(`Blog post inserted with id: ${result.lastInsertRowid}`);
}

db.close();
console.log("Done.");
