/* EDIT YOUR STORY HERE
 Step fields:
  c      chapter index (see CHAPTERS)
  h      optional heading
  t      text (\n for line breaks)
  letter reveals the next letter slot once she reaches this step
  ask    {a:[accepted answers, lowercase], hint}  text answer; unlocks Next after 3 wrong tries
  photo  id used in the saved filename; she takes/picks a photo, saved to Vercel Blob
  shop   true shows the Garmin watch carousel (src/Shop.jsx)
  karaoke true shows the karaoke setlist (src/Karaoke.jsx)
  burst  true throws confetti when she reaches this step
  credits true shows the 'Roll the credits' card (src/Credits.jsx)
  rabbit  true shows the White Rabbit gallery-wall puzzle (src/RabbitWall.jsx)
  studio  true shows the collage customise screen (frame, stickers, filter)
 Letters are earned out of order but fill WORD from left to right in the top bar. */
export const NAME = 'Norita';
export const WORD = 'MANGOCOCO';
export const GAMEMASTER = 'Alex';
export const CHAPTERS = ['Briefing', 'Chasing Rabbits', 'Molly Tea', 'Memory Match', 'Chinatown', 'Town Hall', 'Karaoke', 'Time Check', 'Wynyard', 'Finale'];

export const S = [
  { c: 0, h: `Happy birthday, ${NAME}!`, t: "Today you're a contestant on The Amazing Race: Sydney edition.\nNine letters are hidden across the city. Collect them all and unscramble them to find where you're eating tonight." },
  { c: 0, t: "Rules:\n1. No talking to strangers (photos only).\n2. Keep this page open on your phone.\n3. Stuck? Tap the menu at the top left to jump to a checkpoint." },
  { c: 1, h: 'Before the race...', t: "Somebody is running late. Very late. And very fluffy.\nCatch the White Rabbit as he hops around the gallery wall. Every frame hides a clue, but only three of them matter.", rabbit: true },
  { c: 1, h: 'Where it all began', t: "This is our first date, at the White Rabbit Gallery.\nGo back there and upload a photo that beats this one, and you'll uncover a letter. Bonus points for a peace sign.", image: 'first-date', photo: 'white-rabbit-gallery' },
  { c: 1, h: 'Better than ours?', t: "The judges have spoken. It's better than ours (probably). Here's your first letter.", letter: 'O' },
  { c: 2, h: 'Leg 1: Molly Tea', t: "Fuel up first. Your order is waiting at Molly Tea. [EDIT: which branch + how she picks it up]" },
  { c: 2, t: 'Check the cup sleeve or the bag. Another letter is hiding there.', letter: 'O' },
  { c: 2, h: 'One more thing...', t: "Before you leave, there's something you need to solve.\nA picture is hiding in 30 pieces. Put it back together to reveal your next clue.", puzzle: 'spot'},
  {
    c: 3,
    h: 'You know this place...',
    t: "Now you know where this photo was taken.\n\nGo there. Somewhere at this location, I've hidden a QR code.\n\nScan it to reveal your question. Come back here and enter your answer on the next page.",
    image: 'spot',
  },
  {
    c: 3,
    h: 'What did the QR code ask?',
    t: "Enter the answer you found at the location.",
    ask: {
      a: ['EDIT YOUR ANSWER'],
      hint: 'Think carefully about the question on the QR code.'
    }
  },
  { c: 3, t: "Correct! Here's your next letter.", letter: 'C' },
  { c: 4, h: 'Leg 3: Haymarket', t: "Colour challenge! Find 9 red things around Haymarket. Photos only, no talking to strangers." },
  { c: 4, t: "Tap a panel, snap something red, and watch your colour story build. Nine reds and it's ready to post.", collage: true },
  { c: 4, h: 'Make it yours', t: "Pick a frame, stickers and a filter, then save it and post it. Tap Next when you're done.", studio: true },
  { c: 4, t: 'Nice eye. Another letter is yours.', letter: 'M' },
  { c: 5, h: 'Photobooth time!', t: "Drag your gamemaster into a photobooth. You have to recreate a meme pose. [EDIT: where the booth is]" },
  { c: 5, t: "Swipe through the pose deck, or hit Surprise us. Pick one and commit.", booth: true },
  { c: 5, t: "Once your strip prints, take a photo of it (or of the two of us) and upload it here.", photo: 'photobooth' },
  { c: 5, t: "Absolute masterpiece. Here's a letter.", letter: 'G' },
  { c: 6, h: 'Karaoke time!', t: "Don't leave yet. Same spot, new mission: grab the mic with your gamemaster.\nGo crazy with songs you love, it's your birthday! [EDIT: where the karaoke is]" },
  { c: 6, t: "Your setlist: three songs, all duets with me. Tap each one once we've sung it.", karaoke: true },
  { c: 6, t: "Standing ovation. Here's your letter.", letter: 'A' },
  { c: 7, h: "What's the time?", t: "Time to get a watch!\nGo to the nearest JB Hi-Fi and buy a Garmin." },
  { c: 7, t: "Honestly, how many times have you asked me the time today? My stopwatch is exhausted." },
  { c: 7, t: "Fine, I did the research. Swipe through the shortlist and tap Show specs on each.", shop: true },
  { c: 7, t: "Pick your favourite and tell me tonight. No pressure. (Some pressure.) Here's a letter for your trouble.", letter: 'C' },
  {
    c: 8,
    h: 'Leg 6: Wynyard',
    t: "Where can I find these buses?\nThere's a QR code in that area. Go find it!",
    image: 'bus-clue',
  },
  {
    c: 8,
    h: 'A bridge in plain sight',
    t: "The QR code reveals a picture. What iconic Sydney landmark is it?",
    ask: {
      a: [
        'sydney harbour bridge',
        'harbour bridge',
        'the harbour bridge',
      ],
      hint: 'It connects the CBD to the North Shore.',
    },
  },
  {
    c: 8,
    h: 'Correct!',
    t: "Nice work. Here's your next letter.",
    letter: 'N',
  },
  {
    c: 8,
    h: 'One last view...',
    t: "Now go to our favourite spot where you can get the best view of the Harbour Bridge.\n\nTake a photo of yourself at the spot and upload it here to prove you made it!",
    photo: 'wynyard-harbour-view',
  },
  {
    c: 8,
    h: 'You made it!',
    t: "The view never gets old. You've earned your final letter!",
    letter: 'O',
  },
  { c: 9, h: 'Unscramble it!', t: 'You have all nine letters. Where are we eating tonight?' },
  { c: 9, t: 'Type the restaurant name.', ask: { a: ['mango coco', 'mangococo'], hint: 'Nine letters, two words. Think dessert.' } },
  { c: 9, h: 'Winner!', burst: true, t: `Happy birthday, ${NAME}. Head to Mango Coco and I'll meet you there. [EDIT: final message]` },
  { c: 9, h: "That's a wrap!", t: "Everything you made today, rolled into the end credits. Press play.", credits: true },
];