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
  fan    true (with image + photo) fans her uploaded photo out over the image once it saves
  credits true shows the 'Roll the credits' card (src/Credits.jsx)
  rabbit  true shows the White Rabbit gallery-wall puzzle (src/RabbitWall.jsx)
  studio  true shows the collage customise screen (frame, stickers, filter)
 Letters are earned out of order but fill WORD from left to right in the top bar. */
export const NAME = 'Norita';
export const WORD = 'MANGOCOCO';
export const GAMEMASTER = 'Alex'; // EDIT: your name, shown in the end credits
export const CHAPTERS = ['Briefing', 'Chasing Rabbits', 'Memory Match', 'Chinatown', 'Town Hall', 'Karaoke', 'Molly tea', 'Time Check', 'Wynyard', 'Finale'];

export const S = [
  { c: 0, h: `Happy birthday, ${NAME}!`, t: "You've been chosen as a contestant on The Amazing Race: Sydney edition.\nNine letters are hidden across the city. Collect them all and uncover the final prize!" },
  { c: 0, t: "Rules:\n1. You won't be required to talk to strangers.\n2. Try and keep this page open on your phone.\n3. Stuck? Tap the menu at the top left to jump to a checkpoint." },
  { c: 1, h: 'Your first clue has appeared!', t: "There is a fluffy rabbit on the loose.\nTap it as it hops around the gallery wall. Every frame hides a clue, but only three of them matter.", rabbit: true },
  { c: 1, h: 'Where it all began', t: "This is our first date, at the White Rabbit Gallery.\nGo back there and upload a photo that beats this one, and you'll uncover a letter.", image: 'first-date', photo: 'white-rabbit-gallery', fan: true },
  { c: 1, h: 'Better than ours?', t: "The judges have spoken. It's better than ours (probably). Here's your first letter.", letter: 'O' },
  { c: 2, h: 'The rabbit left a jigsaw!', t: "This photo looks familiar... \n Put it back together to reveal your next clue.", puzzle: 'spot'},
  {
    c: 2,
    h: 'You know this place...',
    t: "Go there. Somewhere at this location, I've hidden a QR code.\n\nScan it to reveal your question, then come back here and enter your answer on the next page.",
    image: 'spot',
  },
  {
    c: 2,
    h: 'What did the QR code ask?',
    t: "Enter the answer you found at the location.",
    ask: {
      a: ['hi', 'hello', 'hey'],
      hint: 'Think carefully about the question on the QR code.'
    }
  },
  { c: 2, t: "Correct! Here's your next letter.", letter: 'C' },
  { c: 3, h: 'Colour Hunting!', t: "It's time to tick this trend off the bucket list. Find 9 red things around the area. \n Here's some inspiration:", image: 'red-hunt-inspiration' },
  { c: 3, t: "Tap a panel, snap something red, and watch your colour story build. Nine reds and it's ready to post.", collage: true },
  { c: 3, h: 'Make it yours', t: "Pick a frame, stickers and a filter, then save it and post it. Tap Next when you're done.", studio: true },
  { c: 3, t: 'What an amazing collage! Have another letter', letter: 'M' },
  { c: 4, h: 'Photobooth time!', t: "Your collage is making me want to visit a photobooth!\nLet's try and recreate some silly poses." },
  { c: 4, t: "Swipe through the pose deck, or hit Surprise us. Pick one and commit.", booth: true },
  { c: 4, t: "Once your strip prints, take a photo of it and upload it here.", photo: 'photobooth' },
  { c: 4, t: "Absolute masterpiece. Here's a letter.", letter: 'G' },
  { c: 5, h: "Don't leave!", t: "Same spot, new mission: let's play some karaoke!\nGo crazy, it's your birthday!" },
  { c: 5, t: "I suck at singing, so please play these three songs at least... \nTap each one once we've sung it and then sing as many as you want!", karaoke: true },
  { c: 5, t: "Beautiful, here's your letter.", letter: 'A' },  
  { c: 6, h: "Hydration time!", t: "You must be tired, recharge with some delicious Molly Tea.\nYour order should be ready soon!" },
  { c: 6, t: "Take a photo of both of us drinking our Molly Tea and upload it here as proof.", photo: 'molly-tea' },
  { c: 6, t: 'Check the cup sleeve or the bag. Another letter is hiding there.', letter: 'O' },
  { c: 7, h: "What's the time?", t: "Time to get a watch! Alex has prepared a special gift for you!" },
  { c: 7, t: "Fine, I did the research. Swipe through the shortlist and tap Show specs on each.", shop: true },
  { c: 7, t: "Unbox your new watch and put it on!\nI hope you like it, I can't wait for your next marathon! Here's another letter.", letter: 'C' },
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