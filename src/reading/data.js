// Original IELTS-style Academic passages (not copied from any copyrighted source).
// Each passage has ONE question type, matching the "one skill at a time" study approach.

export const PASSAGES = [
  {
    id: 'bees-urban',
    level: 1,
    qtype: 'tfng',
    title: 'Bees in the City',
    text: `For most of the twentieth century, beekeeping was seen as a rural activity, something practised on farms and in orchards far from busy streets. In the last two decades, however, a quiet movement has brought hives onto the rooftops of apartment blocks, office towers and even hospitals. Supporters of urban beekeeping argue that cities can be surprisingly good habitats for bees. Parks, gardens and even roadside verges often contain a wider variety of flowering plants than large single-crop farms, where one species may dominate for miles. This variety can provide bees with a more balanced diet across the seasons.

Critics, however, point out that city beekeeping is not without problems. Rooftop hives can become overcrowded in areas where many residents take up the hobby at once, and competition for the same local flowers may leave individual colonies with less food than expected. There is also concern that enthusiastic amateurs, drawn to beekeeping by its trendy image rather than real interest in insect welfare, sometimes neglect basic hive management, which can allow disease to spread between colonies.

Despite these concerns, several cities have reported a measurable rise in the number of registered hives over the past ten years, and some local governments now offer small grants to residents willing to install them. Researchers remain divided on whether this growth genuinely helps wild bee populations or whether it simply adds more competition for a limited number of flowers. What most agree on is that urban beekeeping has done a great deal to raise public awareness of the pressures faced by pollinating insects generally, even among people who will never keep a hive themselves.`,
    statements: [
      { text: 'Beekeeping was mainly a rural practice before the last twenty years.', answer: 'TRUE' },
      { text: 'Farmland always offers bees a better diet than cities do.', answer: 'FALSE' },
      { text: 'Overcrowding of hives can be a problem in some urban areas.', answer: 'TRUE' },
      { text: 'All amateur beekeepers neglect basic hive management.', answer: 'FALSE' },
      { text: 'Every city government now provides grants for new hives.', answer: 'NOT GIVEN' },
      { text: 'Scientists agree that urban beekeeping increases wild bee numbers.', answer: 'FALSE' },
    ],
  },
  {
    id: 'sleep-memory',
    level: 1,
    qtype: 'tfng',
    title: 'Sleep and the Developing Brain',
    text: `Parents are often told that children need more sleep than adults, but the reasons behind this advice are less commonly explained. Recent studies using brain-imaging technology suggest that sleep plays an active role in organising the vast amount of information a young brain absorbs each day. During certain stages of sleep, the brain appears to replay patterns of activity that occurred while the child was awake, a process some researchers believe strengthens new memories and connections between brain cells.

One study followed a group of primary school children over an academic year, comparing those who kept a consistent bedtime with those whose sleep schedule varied widely from night to night. Children with a regular bedtime scored noticeably higher on tests of vocabulary and problem-solving, even when the total number of hours slept was similar between the two groups. This finding led the researchers to suggest that consistency, not simply quantity, may be an important factor in how well sleep supports learning.

Not every scientist is convinced that timing matters as much as the study implies, and some have called for the research to be repeated with a larger number of participants before firm conclusions are drawn. Nevertheless, many sleep specialists now recommend that parents focus as much on keeping a steady routine as on ensuring their children simply spend enough hours in bed.`,
    statements: [
      { text: 'The passage explains why children are often told to sleep more than adults.', answer: 'TRUE' },
      { text: 'During sleep, the brain may replay patterns from the waking day.', answer: 'TRUE' },
      { text: 'The study found that total hours slept was the only factor that mattered.', answer: 'FALSE' },
      { text: 'Children with irregular bedtimes scored higher on vocabulary tests.', answer: 'FALSE' },
      { text: 'All scientists accept the study\'s conclusions without question.', answer: 'FALSE' },
      { text: 'The study included teenagers as well as primary school children.', answer: 'NOT GIVEN' },
    ],
  },
  {
    id: 'deep-sea-exploration',
    level: 1,
    qtype: 'gap',
    title: 'Mapping the Ocean Floor',
    text: `Although it covers more than two-thirds of the planet's surface, the ocean floor remains one of the least explored parts of Earth. Early mapping relied on dropping a weighted line overboard and measuring how far it sank before touching bottom, a slow method that could only provide a single depth reading at a time. The invention of sonar in the early twentieth century transformed this process, allowing ships to send out sound waves and measure how long they took to bounce back from the seabed below.

Modern research vessels now use multibeam sonar systems, which send out dozens of sound beams at once, building a detailed three-dimensional picture of the ocean floor as the ship moves. Even with this technology, scientists estimate that only a small percentage of the deep ocean has been mapped in high resolution, partly because of the enormous cost of operating specialised ships for months at a time.

A newer approach involves fitting autonomous underwater vehicles, which can travel without a human pilot on board, with sonar equipment and releasing them to survey areas that would be too dangerous or expensive to reach by traditional ship. Some of these vehicles can operate for weeks before needing to return to the surface, collecting data far beyond the limits of earlier expeditions. Marine scientists hope that as the cost of this technology falls, complete high-resolution maps of the seabed may finally become achievable within a few decades.`,
    gaps: [
      { before: 'The ocean floor covers more than', after: "of the planet's surface.", answer: ['two-thirds'], hint: '(a fraction)' },
      { before: 'Early depth readings were taken using a', after: 'dropped from a ship.', answer: ['weighted line', 'line'], hint: '(an object)' },
      { before: 'Sonar works by measuring how long sound waves take to', after: 'from the seabed.', answer: ['bounce back', 'return'], hint: '(a verb phrase)' },
      { before: 'Modern ships use multibeam sonar, which sends out many sound', after: 'at once.', answer: ['beams'], hint: '(a noun)' },
      { before: 'Autonomous underwater vehicles can travel without a human', after: 'on board.', answer: ['pilot'], hint: '(a person)' },
      { before: 'Some vehicles can operate for', after: 'before returning to the surface.', answer: ['weeks'], hint: '(a time period)' },
    ],
  },
  {
    id: 'remote-work',
    level: 2,
    qtype: 'gap',
    title: 'The Shift Towards Remote Work',
    text: `For decades, commuting to a shared office was taken for granted as a normal part of working life. A sudden, global shift away from this pattern forced organisations of every size to reconsider assumptions that had rarely been questioned before. Many businesses discovered, somewhat to their surprise, that productivity in several roles did not decline when employees worked from home, and in some cases it appeared to improve, at least according to internal performance measures.

This shift has not been free of difficulties. Managers accustomed to observing staff directly have had to develop new methods of measuring output, often relying more heavily on completed tasks and agreed deadlines than on hours spent visibly at a desk. Employees, meanwhile, have reported mixed experiences: some value the extra time gained by not commuting, while others describe a blurring of boundaries between work and personal life that leaves them feeling unable to switch off in the evening.

Surveys conducted across several industries suggest that a hybrid pattern, combining days at home with days in a shared office, has become the preferred arrangement for a majority of employees who have experienced both. Companies that have tried to insist on a complete return to the office five days a week have, in several well-publicised cases, faced resistance strong enough to affect staff retention. Economists studying city centres note a related consequence: a reduction in weekday footfall has hit businesses that depended on commuters, from sandwich shops to dry cleaners, prompting some town planners to reconsider what city centres are actually for in this new era.`,
    gaps: [
      { before: 'Before the shift, commuting to a', after: 'office was considered normal.', answer: ['shared'], hint: '(an adjective)' },
      { before: 'Many businesses found that', after: 'did not decline when staff worked from home.', answer: ['productivity'], hint: '(a noun)' },
      { before: 'Managers now rely more on completed tasks and agreed', after: 'rather than visible hours.', answer: ['deadlines'], hint: '(a noun)' },
      { before: 'Some employees describe a blurring of boundaries between work and', after: 'life.', answer: ['personal'], hint: '(an adjective)' },
      { before: 'A hybrid pattern is the preferred arrangement for a', after: 'of employees.', answer: ['majority'], hint: '(a noun)' },
      { before: 'A reduction in weekday', after: 'has hurt businesses near offices.', answer: ['footfall'], hint: '(a noun)' },
      { before: 'Town planners are reconsidering what city', after: 'are for.', answer: ['centres', 'centers'], hint: '(a noun)' },
    ],
  },
  {
    id: 'silk-road',
    level: 2,
    qtype: 'heading',
    title: 'Trade Along the Silk Road',
    paragraphs: [
      { label: 'A', text: 'The term "Silk Road" was coined by a nineteenth-century geographer to describe a network of trade routes connecting East Asia with the Mediterranean world. In reality, there was no single road at all, but rather a shifting web of paths across deserts, mountains and grasslands, used by merchants who rarely travelled the entire distance themselves.' },
      { label: 'B', text: 'Goods typically changed hands many times along the route. A bundle of silk might begin its journey carried by one trader, be sold at a market town, and continue onward in the care of several different merchants before reaching a buyer thousands of kilometres from where it started. This relay-like system meant that no single trader needed detailed knowledge of the entire route, only of the stretch they personally covered.' },
      { label: 'C', text: 'Although silk gave the network its name, it was far from the only commodity exchanged. Spices, precious stones, glassware, paper and even ideas about religion and science travelled alongside it. Buddhism, for example, spread from South Asia into Central and East Asia largely through contact made possible by these trade connections, carried not by merchants alone but by travelling monks and scholars.' },
      { label: 'D', text: 'Life for traders on these routes was far from easy. Caravans faced extreme temperatures, scarce water supplies, and the constant risk of robbery in remote stretches with no local authority to appeal to. Many trading towns grew wealthy largely by providing safe lodging, food and fresh animals to caravans passing through, profiting from the dangers merchants faced elsewhere.' },
      { label: 'E', text: 'The network gradually declined in importance as sea routes between Asia and Europe became more reliable and economical from around the fifteenth century onward. Ships could carry far greater quantities of goods than camel caravans, and avoided many of the overland dangers, though piracy and storms brought their own risks. Even so, the overland routes never disappeared completely, and some continued to carry regional trade long after their golden age had passed.' },
    ],
    headings: [
      'Why the network eventually lost its importance',
      'A name that does not reflect reality',
      'The hardships faced by those who travelled',
      'More than just silk changed hands',
      'How goods passed from trader to trader',
      'The role of religion in trade disputes',
      'Competition between neighbouring trading towns',
    ],
    headingAnswers: { A: 1, B: 4, C: 3, D: 2, E: 0 },
  },
  {
    id: 'octopus-intelligence',
    level: 2,
    qtype: 'sentence',
    title: 'The Curious Intelligence of the Octopus',
    text: `Octopuses present a puzzle for scientists who study animal intelligence, because their nervous system is organised so differently from that of mammals or birds. Rather than concentrating most of their neurons in a central brain, an octopus distributes roughly two-thirds of its neurons through its eight arms, which can act with a surprising degree of independence. An arm that has been separated from the body, in laboratory conditions, has been observed to continue reacting to stimuli for a short period, suggesting a form of local processing separate from the central brain.

This unusual arrangement has not stopped octopuses from displaying behaviour widely regarded as evidence of genuine problem-solving. In captivity, octopuses have learned to open screw-top jars to reach food inside, and several individuals have become known for repeatedly dismantling equipment in their tanks, apparently out of curiosity rather than any practical need. Aquarium staff have also reported individual octopuses recognising and showing an apparent dislike for specific members of staff, squirting water at them when they pass, while behaving normally toward others.

Researchers remain cautious about describing this behaviour in overly human terms, since doing so risks assuming similarities that may not truly exist between such different nervous systems. Still, the growing body of evidence has led a number of scientists to argue that intelligence may have evolved independently more than once in the animal kingdom, taking strikingly different physical forms in creatures separated by hundreds of millions of years of evolution.`,
    sentenceStarts: [
      'An octopus distributes most of its neurons',
      'A separated octopus arm',
      'Octopuses in captivity have learned',
      'Some octopuses appear to recognise',
      'Many researchers believe intelligence',
    ],
    sentenceEndings: [
      'may have evolved more than once, in very different forms.',
      'how to open jars to reach food.',
      'continues reacting to stimuli for a while.',
      'specific aquarium staff and treat them differently.',
      'through its arms rather than a central brain.',
    ],
    sentenceAnswers: [4, 2, 1, 3, 0],
  },
  {
    id: 'renewable-storage',
    level: 3,
    qtype: 'summary',
    title: 'The Challenge of Storing Renewable Energy',
    text: `Solar panels and wind turbines share a characteristic that distinguishes them sharply from traditional power stations: their output depends on conditions outside human control. A coal or gas plant can, within limits, increase or decrease production to match demand at a given moment, but a solar farm generates nothing after sunset regardless of how urgently electricity is needed. This mismatch between variable supply and relatively constant demand is often described as the central obstacle to a power grid that relies heavily on renewable sources.

Large-scale batteries have become one widely discussed solution, storing surplus electricity generated on sunny or windy days for use when conditions are less favourable. However, batteries capable of storing enough energy to support an entire city for several hours remain extremely expensive to build, and the raw materials required, including lithium and cobalt, are not evenly distributed around the world, raising concerns about long-term supply.

An alternative technique, pumped-storage hydropower, uses surplus electricity to pump water uphill into a reservoir, then allows it to flow back down through turbines to generate power again when needed. This method has existed for decades and can store far larger quantities of energy than most batteries, but it depends on suitable geography, specifically the availability of two reservoirs at different heights, which limits where it can be built.

A less mature but promising approach converts surplus electricity into hydrogen gas through a chemical process, storing the hydrogen for later use in generating electricity or powering vehicles. Although this method offers considerable flexibility, since hydrogen can be transported and stored in various ways, the conversion process currently loses a significant proportion of the original energy, making it less efficient than either batteries or pumped storage for most everyday applications.`,
    summary: 'Unlike traditional power stations, solar and wind output cannot be easily adjusted to match (1)___. Large batteries can store surplus energy, but they are costly and depend on materials such as (2)___ that are unevenly distributed. Pumped-storage hydropower moves water into a (3)___ and later releases it through turbines, though it requires suitable (4)___. Converting electricity into (5)___ offers flexibility but currently wastes a large share of the original energy.',
    wordbox: ['demand', 'lithium', 'reservoir', 'geography', 'hydrogen', 'turbines', 'batteries'],
    summaryAnswers: ['demand', 'lithium', 'reservoir', 'geography', 'hydrogen'],
  },
  {
    id: 'advertising-psychology',
    level: 3,
    qtype: 'tfng',
    title: 'The Psychology Behind Everyday Advertising',
    text: `Advertisers have long understood that the way a choice is presented can influence decisions just as much as the content of the choice itself, an insight that behavioural scientists now describe systematically. One well-documented example involves the placement of a conspicuously expensive option alongside two cheaper alternatives. Research suggests that adding this expensive item, even if very few customers actually purchase it, can increase sales of the second-most expensive option, apparently because it no longer appears as extreme a choice by comparison.

Colour choices in packaging and branding are rarely accidental either. Studies conducted across different markets have found broadly consistent associations, with blue frequently linked to trust and reliability, and red associated with urgency or excitement, though researchers caution that cultural context can shift these associations considerably. A colour scheme that signals trustworthiness in one country may carry entirely different associations elsewhere, which complicates the task of companies operating internationally.

Scarcity, whether genuine or implied, is another frequently used technique. Phrases suggesting that only a limited quantity remains, or that an offer expires soon, can accelerate a customer's decision by introducing a fear of missing out, a psychological response that appears to operate even among consumers who consciously recognise the tactic for what it is. Some researchers argue that repeated exposure to such tactics gradually reduces their effectiveness, as audiences become more sceptical, though clear long-term evidence for this decline remains limited.

Despite decades of research into these techniques, companies continue to debate how far such strategies should be pushed, aware that customers who feel manipulated may distrust a brand permanently once they recognise the tactic being used against them.`,
    statements: [
      { text: 'Adding an expensive option can increase sales of a cheaper item by comparison.', answer: 'TRUE' },
      { text: 'Colour associations are identical in every country studied.', answer: 'FALSE' },
      { text: 'Scarcity tactics only work on customers who do not notice them.', answer: 'FALSE' },
      { text: 'Clear long-term evidence shows that scarcity tactics always lose effectiveness over time.', answer: 'NOT GIVEN' },
      { text: 'All companies have stopped using these psychological techniques due to ethical concerns.', answer: 'FALSE' },
      { text: 'Red is more often linked to urgency than blue is.', answer: 'TRUE' },
    ],
  },
  {
    id: 'ancient-libraries',
    level: 3,
    qtype: 'mc',
    title: 'Preserving Knowledge Before the Printing Press',
    text: `Long before printing made books cheap and plentiful, preserving written knowledge required enormous human effort. Texts were copied entirely by hand, a process that could take a single scribe months to complete for a lengthy work, and every copy carried the risk of small errors creeping in, which might then be repeated in all future copies made from it. Despite this fragility, several ancient institutions managed to assemble remarkably large collections of texts, relying on networks of scholars, traders and rulers willing to fund the costly work of copying.

One of the most famous examples, a great library established in Egypt during the Hellenistic period, is said to have pursued an aggressive acquisition policy: ships arriving in its harbour were reportedly searched for books, which were confiscated, copied, and sometimes returned as copies rather than originals. Whether every detail of this practice is historically accurate remains debated among historians, since much of what is known comes from accounts written centuries after the library's most active period, making precise verification difficult.

Not all ancient collections suffered the dramatic destruction often associated with such institutions in popular imagination. Many simply declined gradually as funding dried up, scholars dispersed, or buildings fell into disrepair through ordinary neglect rather than catastrophe. This slower, less dramatic pattern of loss may in fact explain the disappearance of far more ancient texts than any single destructive event, however much attention the more dramatic stories receive in popular retellings.`,
    mc: [
      { q: 'Before printing, copying a lengthy text by hand could take a scribe…', options: ['a few days', 'several months', 'many years', 'only a few hours'], answer: 1 },
      { q: 'A risk of hand-copying mentioned in the passage is that…', options: ['scribes often refused to work', 'books became too expensive to buy', 'small errors could be repeated in later copies', 'only rulers were allowed to read the copies'], answer: 2 },
      { q: 'According to the passage, the famous Egyptian library\'s acquisition stories are…', options: ['fully confirmed by original records', 'completely invented by modern writers', 'debated, partly due to late historical sources', 'irrelevant to historians today'], answer: 2 },
      { q: 'The passage suggests that most ancient text collections were lost mainly through…', options: ['sudden, dramatic destruction', 'gradual neglect and declining funding', 'deliberate censorship by rulers', 'being copied too many times'], answer: 1 },
    ],
  },
];

export function levelTier(l) { return l; }
