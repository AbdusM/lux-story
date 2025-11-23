/**
 * Analyze Yaquin dialogue compression
 */

const beforeSamples = [
  `*He's surrounded by dental models—sets of teeth, gum molds—and a ring light setup. He's talking to his phone.*

"Okay, guys, forget the textbook. Chapter 4 is garbage. This is how you actually mix the alginate so it doesn't gag the patient."

*He stops recording and sighs.*

Is it garbage? Or am I just uneducated?`,

  `Right? It says 'mix for 45 seconds.' If you do that, it sets in the bowl. You ruin the mold.

I've been a dental assistant for 8 years. I know the feel of the paste. I know the look in a patient's eyes when they're scared.

The books don't teach that.`,

  `I'm 'just' an assistant. I didn't go to dental school.

But the dentists ask *me* how to handle the difficult patients. They ask *me* to train the new hires.

I'm doing the work, but I don't have the paper.`,

  `I want to build a course. 'The Real Dental Assistant.'

Not theory. Reality. How to calm a crying kid. How to mix the paste. How to anticipate what the doctor needs before they ask.

But I keep looking at the syllabus and thinking... I need to include the history of dentistry. And anatomy. And ethics.`,

  `*He slams a notebook onto the table. It's thick, messy, and covered in coffee stains.*

"Look at this list. I'm trying to turn 8 years of instinct into a checklist. It's impossible."

*He points to three potential modules.*

"I only have time to film one pilot module this weekend. If I pick the wrong one, nobody watches, and I go back to cleaning spit valves."`,

  `*Eight weeks later. Yaquin is surrounded by three laptops, all open to different tabs. Support tickets. Refund requests. Student progress dashboards.*

*He looks exhausted.*

127 students. I have 127 students in my dental assistant course.

*He gestures at the screens.*

And I have 47 unread support messages, 15 refund requests, a comment from a DDS calling my work "amateur hour," and three dental offices asking to license my course for bulk training.

*He looks up.*

Turns out teaching is the easy part. Running a course business? That's the real education.`,

  `Students are saying the self-paced format doesn't work for them.

"I need live instruction."
"The videos are too fast."
"I can't stay motivated alone."

*He pulls up a review.*

"Great content, wrong format. I need a teacher, not a YouTube channel."

*He rubs his eyes.*

Half my students are career-switchers like me—motivated, self-directed. They're crushing it.

The other half? Dental office employees sent by their bosses. They're struggling. And asking for refunds.`,

  `I'm looking at the data.

**Self-motivated students**: 85% completion rate. Glowing reviews.
**Boss-mandated students**: 32% completion rate. Most of the refund requests.

*He sketches two paths.*

**Option 1**: Pivot to cohort-based. Fewer students, live instruction, higher price.

**Option 2**: Improve self-paced. Better async support, community forums, office hours.

**Option 3**: Two-tier model. Self-paced ($497) + Cohort premium ($1,497).

*He looks at you.*

What would you do?`,

  `A month ago, I thought running a course was about great content.

Now I know it's about:
- Customer service (support tickets, refunds, communication)
- Product iteration (v1 → v2 → v3)
- Strategic execution (cohorts, licensing, scaling)
- Operational systems (forums, office hours, feedback loops)

*He looks at his setup.*

I'm not just a teacher. I'm an educator-entrepreneur.

Teaching is the craft. Running a course business is the skill.

And the best part? Every problem is data. Every refund is a lesson. Every 1-star review tells me what to improve.`,
]

const afterSamples = [
  `*Dental models everywhere. Ring light. Recording.*|"Forget the textbook. Chapter 4's garbage. Here's how you actually mix alginate without gagging patients."|*Stops. Sighs.*|Is it garbage? Or am I just uneducated?`,

  `Says 'mix 45 seconds.' Do that—sets in the bowl. Mold ruined.|8 years experience. Know the paste feel. Know patient fear.|Books don't teach that.`,

  `'Just' an assistant. No dental school.|But dentists ask me about difficult patients. Ask me to train new hires.|Doing the work. No paper.`,

  `Want to build a course. 'The Real Dental Assistant.'|Reality—not theory. Calm crying kids. Mix paste. Anticipate doctor needs.|But the syllabus... keeps adding history. Anatomy. Ethics.`,

  `*Slams notebook down. Thick. Coffee-stained.*|"This list. 8 years instinct → checklist. Impossible."|*Points to three modules.*|"One pilot this weekend. Pick wrong—nobody watches. Back to cleaning spit valves."`,

  `*Eight weeks later. Three laptops. Support tickets. Refunds. Dashboards.*|*Exhausted.*|127 students.|*Gestures at screens.*|47 unread messages. 15 refunds. DDS calling it "amateur hour." Three offices want licensing.|*Looks up.*|Teaching's easy. Running course business? Real education.`,

  `Self-paced doesn't work.|"Need live instruction." "Videos too fast." "Can't stay motivated."|*Pulls up review.*|"Great content, wrong format. Need teacher, not YouTube."|*Rubs eyes.*|Half career-switchers—crushing it. Other half—boss-mandated. Struggling. Refunds.`,

  `Data:|**Self-motivated**: 85% completion. Glowing reviews.|**Boss-mandated**: 32% completion. Most refunds.|*Sketches paths.*|**Option 1**: Cohort-based. Fewer students, live, higher price.|**Option 2**: Improve self-paced. Forums, office hours.|**Option 3**: Two-tier. Self-paced ($497) + Cohort ($1,497).|*Looks at you.*|What would you do?`,

  `Month ago—thought course was about content.|Now know it's:|• Customer service|• Product iteration|• Strategic execution|• Operational systems|*Looks at setup.*|Not just teacher. Educator-entrepreneur.|Teaching is craft. Running business is skill.|Best part? Every problem is data. Every refund—lesson. Every 1-star—what to improve.`,
]

function countWords(text: string): number {
  return text.trim().split(/\s+/).length
}

function calculateCompressionStats() {
  console.log('=== YAQUIN DIALOGUE ARC COMPRESSION ANALYSIS ===\n')

  let totalBeforeWords = 0
  let totalAfterWords = 0

  beforeSamples.forEach((before, i) => {
    const after = afterSamples[i]
    const beforeWords = countWords(before)
    const afterWords = countWords(after)
    const compression = ((beforeWords - afterWords) / beforeWords * 100).toFixed(1)

    totalBeforeWords += beforeWords
    totalAfterWords += afterWords

    console.log(`Node ${i + 1}:`)
    console.log(`  Before: ${beforeWords} words`)
    console.log(`  After:  ${afterWords} words`)
    console.log(`  Compression: ${compression}%\n`)
  })

  const avgCompression = ((totalBeforeWords - totalAfterWords) / totalBeforeWords * 100).toFixed(1)

  console.log('=== SUMMARY ===')
  console.log(`Total nodes analyzed: ${beforeSamples.length}`)
  console.log(`Total words before: ${totalBeforeWords}`)
  console.log(`Total words after: ${totalAfterWords}`)
  console.log(`Average compression: ${avgCompression}%`)
  console.log(`\nTarget: 45-50% compression ✓`)
}

calculateCompressionStats()
