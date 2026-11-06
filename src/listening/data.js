// Content bank for the Listening module (adapted from the original practice prototype).

export const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
export const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function W(n) {
  return n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
}

export const PAIRS = [[13, 30], [14, 40], [15, 50], [16, 60], [17, 70], [18, 80], [19, 90]];

export const NAMES = [
  ['Oliver', 'Pemberton'], ['Hannah', 'Thornton'], ['Edward', 'Callaghan'], ['Charlotte', 'Whitaker'],
  ['Harry', 'Wetherby'], ['Sophie', 'Hargreaves'], ['Jack', 'Stephenson'], ['Emily', 'Whitcombe'],
  ['George', 'Fairbrother'], ['Olivia', 'Cartwright'],
];

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WORDS = ['knowledge', 'acknowledge', 'committee', 'queue', 'occurred', 'beginning', 'receive',
  'separate', 'definitely', 'irrelevant', 'informative', 'demanding', 'grateful', 'successful', 'necessary',
  'environment', 'government', 'accommodation', 'immediately', 'reasonable', 'address', 'library', 'believe',
  'achieve', 'recommend', 'favourite', 'argument', 'independence', 'assistant', 'lecturer', 'students', 'submit'];

export const SENT = [
  ['The committee', 'has acknowledged', 'its mistake.'],
  ['Knowledge of', 'the queue system', 'is very important.'],
  ['Several students', 'have already received', 'their results.'],
  ['The lecturer asked', 'the students to submit', 'their assignments.'],
  ['An assistant', 'gave us a list', 'of important documents.'],
  ['It is definitely', 'necessary to arrive', 'early on Mondays.'],
  ['The government', 'introduced a new', 'queue system.'],
  ['Their reply was', 'inaccurate and', 'completely irrelevant.'],
  ['We are grateful', 'for your help', 'with the library.'],
  ['The course was', 'demanding but', 'very informative.'],
];

export const PW = [['three', 'free'], ['thirty', 'forty'], ['thirteen', 'fourteen'], ['thin', 'fin'],
  ['thank', 'frank'], ['thought', 'fought']];

export const HY = [
  ['She has a part-time job.', 'part-time'], ['He works full-time.', 'full-time'],
  ['Check-in is at two o’clock.', 'check-in'], ['He is a well-known author.', 'well-known'],
  ['The information is up-to-date.', 'up-to-date'], ['She prefers self-study.', 'self-study'],
  ['It is a long-term plan.', 'long-term'], ['He bought a second-hand car.', 'second-hand'],
  ['It is a high-quality product.', 'high-quality'], ['The app is very user-friendly.', 'user-friendly'],
  ['Their well-being is important.', 'well-being'], ['It is an old-fashioned shop.', 'old-fashioned'],
];

export const PA = [
  ['The research was limited.', 'The study covered very little', 'The study was extensive', 'The study was recent'],
  ['The lecture was boring.', 'The lecture was dull', 'The lecture was confusing', 'The lecture was short'],
  ['The data is out of date.', 'The figures are no longer current', 'The figures are inaccurate', 'The figures are incomplete'],
  ['Students found the course demanding.', 'It required a lot of effort', 'It was too easy', 'They disliked the teacher'],
  ['There is hardly any evidence.', 'There is very little evidence', 'There is plenty of evidence', 'There is no evidence at all'],
  ['Profits fell sharply.', 'Profits dropped suddenly', 'Profits rose slowly', 'Profits stayed the same'],
  ['She obtained a visa.', 'She got a visa', 'She lost a visa', 'She needed a visa'],
  ['The shop is situated near the station.', 'The shop is located near the station', 'The shop closed near the station', 'The shop moved from the station'],
  ['Attendance is mandatory.', 'Attendance is compulsory', 'Attendance is optional', 'Attendance is rare'],
  ['We have sufficient funds.', 'We have enough money', 'We have no money', 'We have too much debt'],
  ['He was reluctant to speak.', 'He was unwilling to speak', 'He was eager to speak', 'He was unable to hear'],
  ['Water is scarce here.', 'Water is hard to find', 'Water is very cheap', 'Water is polluted'],
  ['The talk was informative.', 'It contained a lot of useful information', 'It was too long', 'It was very funny'],
  ['She acknowledged her mistake.', 'She admitted her mistake', 'She hid her mistake', 'She fixed her mistake'],
  ['The price is reasonable.', 'The price is not too high', 'The price is very low', 'The price is unfair'],
];

export const PR = [
  ['Telephone number: ___', 0], ['Surname: ___', 1], ['The hotel is next to the ___', 2],
  ['Monthly fee: £ ___', 0], ['The room is very ___', 3], ['Arrival time: ___ a.m.', 0],
  ['He works as a ___', 2], ['The food was ___', 3], ['Date of birth: ___', 0],
  ['Street name: ___ Road', 1],
];

export const MB = [
  { o: ["a lecturer's advice", "a friend's suggestion", 'career prospects', 'a family tradition', 'the location', 'the cost'],
    s: [
      ['Daniel', 'My uncle and my grandfather were both engineers, so it was almost expected that I would follow them.', 'a family tradition'],
      ['Maya', "I'd never thought of law until my tutor told me my arguments were strong enough for it.", "a lecturer's advice"],
      ['Jasper', "I wanted to stay near home, so I only looked at courses within an hour's drive.", 'the location'],
      ['Freya', 'My roommate kept saying I should try design, and eventually I did.', "a friend's suggestion"],
    ] },
  { o: ['noise', 'cost', 'size', 'location', 'cleanliness', 'neighbours'],
    s: [
      ['Amy', "I thought the neighbours would be the problem, but they're very quiet. It's the traffic outside that keeps me awake.", 'noise'],
      ['Ben', "The flat is big enough and the area is great, but the rent has gone up again.", 'cost'],
      ['Lola', "It's not expensive and it's close to work, but I can't even fit a table in the kitchen.", 'size'],
      ['Sam', "It's quiet, and the rent is fair, but it takes me an hour and a half to get to university.", 'location'],
    ] },
  { o: ['bus', 'bicycle', 'train', 'walking', 'car', 'taxi'],
    s: [
      ['Emily', 'I used to drive in every day, but parking was so expensive that I now cycle.', 'bicycle'],
      ['Jack', 'The train is faster, but the station is miles away, so I just take the bus from the end of my road.', 'bus'],
      ['Sophie', 'I live so close that I walk, although when it rains I sometimes get a lift.', 'walking'],
      ['Harry', 'My flat is right next to the station, so it takes ten minutes by train.', 'train'],
    ] },
  { o: ['too long', 'well organised', 'lacks evidence', 'unclear title', 'excellent visuals', 'too many quotations'],
    s: [
      ['Tom', 'At first I thought the report was too long, but actually it was just very well organised.', 'well organised'],
      ['Charlotte', "The charts are really nice, I'll give her that, but she doesn't support her claims with any data.", 'lacks evidence'],
      ['George', 'I like the ideas. The title confused me, though.', 'unclear title'],
      ['Olivia', "It's full of other people's words. I mean, there are quotations on almost every page.", 'too many quotations'],
    ] },
  { o: ["a doctor's recommendation", "a neighbour's invitation", 'a school project', 'a poster', 'a competition win', 'a new job'],
    s: [
      ['Aziz', 'My doctor said swimming would help my back, so I signed up the next week.', "a doctor's recommendation"],
      ['Nora', 'The woman next door asked me to come along one evening, and I never left.', "a neighbour's invitation"],
      ['Bekzod', 'We had to write about chess for a school assignment, and I got completely hooked.', 'a school project'],
      ['Gina', 'I walked past a notice on a lamp post advertising free trial lessons.', 'a poster'],
    ] },
  { o: ['relaxation', 'meeting people', 'fitness', 'a family tradition', 'learning a skill', 'a free trial'],
    s: [
      ['Lucy', 'I started painting because I wanted to unwind after work.', 'relaxation'],
      ['Tom', 'My dad and my grandad both played the violin, so I picked it up as a child.', 'a family tradition'],
      ['Priya', 'The first month was free, so I thought, why not?', 'a free trial'],
      ['Max', "I'd put on a bit of weight and the doctor suggested I get moving, so I joined a club.", 'fitness'],
    ] },
  { o: ['traffic', 'illness', 'a broken alarm', 'a missed train', 'bad weather', 'a lost key'],
    s: [
      ['Rob', 'I would have been on time, but the train left just as I reached the platform.', 'a missed train'],
      ['Kate', "My phone didn't ring this morning, so I overslept.", 'a broken alarm'],
      ['Dan', 'I felt rough all night, so I stayed in bed longer.', 'illness'],
      ['Beth', "The roads were fine, but I couldn't find my keys anywhere.", 'a lost key'],
    ] },
  { o: ['flashcards', 'group study', 'past papers', 'audio recordings', 'online videos', 'a private tutor'],
    s: [
      ['Nick', 'I record my lectures and listen to them on the bus.', 'audio recordings'],
      ['Ella', 'My friends and I meet every Thursday to go through the notes.', 'group study'],
      ['Zoe', "I've done every exam paper from the last five years.", 'past papers'],
      ['Ian', 'I cut up index cards and write one term on each.', 'flashcards'],
    ] },
];

export const MC = [
  { k: 'p2', say: "Welcome to the Harbour Museum. Many visitors expect it to be quite small, but it actually has three floors. Most people begin on the top floor, but I'd recommend starting on the ground floor, where the shipbuilding exhibition is. Tickets are cheaper after two o'clock, and you can take photographs, but please don't use a flash in the maps room.",
    q: [['The museum is…', ['very small', 'larger than visitors expect', 'only one floor'], 1],
      ['The guide recommends starting on the…', ['top floor', 'ground floor', 'second floor'], 1],
      ['Tickets are cheaper…', ['in the morning', 'after two o’clock', 'at weekends'], 1],
      ['Visitors should not…', ['take photographs', 'use a flash', 'enter the maps room'], 1]] },
  { k: 'p2', say: 'Before you decide on a gym membership, there are a few things to consider. Many people think the monthly plan is cheaper, and it is, but only if you go more than twice a week. If you only go once a week, paying per visit costs less. Most members assume the evening classes are the most popular, but in fact the early morning yoga class has the longest waiting list.',
    q: [['The monthly plan is cheaper when you go…', ['once a week', 'more than twice a week', 'only at weekends'], 1],
      ['Best for one visit a week:', ['the monthly plan', 'paying per visit', 'a yearly plan'], 1],
      ['The longest waiting list:', ['evening classes', 'early morning yoga', 'lunchtime classes'], 1]] },
  { k: 'lec', say: "Today I'd like to talk about sleep. It's often said that adults need exactly eight hours, but research suggests the figure varies between seven and nine. What matters more is regularity. In one study, students who went to bed at the same time every night performed better in exams than those who slept longer but irregularly. Interestingly, the effect was strongest in the morning tests, not the afternoon ones.",
    q: [['Research suggests adults need…', ['exactly eight hours', 'between seven and nine hours', 'more than nine hours'], 1],
      ['What matters more than length?', ['regularity', 'bedroom temperature', 'napping'], 0],
      ['The effect was strongest in…', ['afternoon tests', 'morning tests', 'evening tests'], 1]] },
  { k: 'lec', say: 'Honeybees are often seen as a symbol of hard work, but a closer look shows something more complex. Each hive has around fifty thousand workers in summer, yet in winter this falls to roughly ten thousand. Contrary to popular belief, the queen does not give orders. The colony\'s decisions are made collectively, for example when choosing a new nest site, where scouts compete to persuade others by dancing.',
    q: [['Workers in a summer hive:', ['ten thousand', 'fifty thousand', 'one hundred thousand'], 1],
      ["Who makes the colony's decisions?", ['the queen', 'the colony collectively', 'the oldest bees'], 1],
      ['Scouts persuade others by…', ['dancing', 'making sounds', 'leaving scents'], 0]] },
  { k: 'p2', say: "Welcome to the City Library. The opening hours changed last month. We're now open until eight in the evening on weekdays, but we close at five on Saturdays. Membership is free for residents, though visitors pay a small fee. If you want to use the computers, you need to book in advance at the front desk.",
    q: [['On weekdays the library is open until…', ['five', 'eight', 'ten'], 1],
      ['On Saturdays it closes at…', ['five', 'six', 'eight'], 0],
      ['Membership is free for…', ['visitors', 'residents', 'students'], 1],
      ['To use the computers you must…', ['pay a fee', 'book in advance', 'bring a card'], 1]] },
  { k: 'p2', say: "The tour starts at nine and lasts about three hours. You don't need to bring a bike, because we provide them, but you should bring water and a hat. We'll stop halfway at a small farm, where you can buy fresh bread. In case of heavy rain, the tour will move to the following day.",
    q: [['The tour lasts about…', ['two hours', 'three hours', 'five hours'], 1],
      ['You should bring…', ['a bike', 'water and a hat', 'lunch'], 1],
      ['At the farm you can buy…', ['fresh bread', 'cheese', 'fruit'], 0],
      ['If it rains heavily, the tour will…', ['be cancelled', 'move to the next day', 'start later'], 1]] },
  { k: 'lec', say: 'Coral reefs cover less than one percent of the ocean floor, yet they support about a quarter of all marine species. The main threat is rising water temperature, which causes bleaching. Surprisingly, damaged reefs can recover, but only if the temperature drops within a few weeks.',
    q: [['Reefs cover…', ['less than one percent of the ocean floor', 'a quarter of the ocean floor', 'ten percent of the ocean floor'], 0],
      ['The main threat is…', ['fishing', 'rising temperature', 'tourism'], 1],
      ['Damaged reefs can recover if…', ['the temperature drops quickly', 'they are moved', 'fish are added'], 0]] },
];

export const DR = [
  ['Start at the entrance and go straight. Take the second left, and the library is on your right, opposite the fountain.',
    'Where is the library?', ['On the left, next to the fountain', 'On the right, opposite the fountain', 'On the right, next to the car park'], 1],
  ['From the entrance, turn right and walk past the café. The gift shop is at the end of the corridor, on the left.',
    'Where is the gift shop?', ['At the end of the corridor, on the left', 'Next to the café', 'At the entrance'], 0],
  ['Go through the main doors and take the first right. The lifts are straight ahead, between the stairs and the toilets.',
    'Where are the lifts?', ['Behind the stairs', 'Between the stairs and the toilets', 'Next to the main doors'], 1],
  ['Leave reception and turn left. Walk to the end of the hall, and the garden is behind the old chapel.',
    'Where is the garden?', ['Behind the old chapel', 'In front of reception', 'Next to the café'], 0],
  ['Turn left at the bank, then cross the bridge. The post office is the second building on your left, after the bakery.',
    'Where is the post office?', ['Before the bakery', 'After the bakery, on the left', 'Next to the bank'], 1],
  ['Go past the cinema, take the third right, and the museum is at the end of the road, facing the park.',
    'Where is the museum?', ['Facing the park', 'Next to the cinema', 'On the third left'], 0],
];
