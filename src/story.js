/* EDIT YOUR STORY HERE
 Step fields:
  c      chapter index (see CHAPTERS)
  h      optional heading
  t      text (\n for line breaks)
  letter reveals the next letter slot once she reaches this step
  ask    {a:[accepted answers, lowercase], hint}  text answer; unlocks Next after 3 wrong tries
  photo  id used in the saved filename; she takes/picks a photo, saved to Vercel Blob
  shop   true shows the Garmin watch carousel (src/Shop.jsx)
 Letters are earned out of order but fill WORD from left to right in the top bar. */
export const NAME = 'Norita';
export const WORD = 'MANGOCOCO';
export const CHAPTERS = ['Briefing', 'Molly Tea', 'Memory Match', 'Chinatown', 'Town Hall', 'Time Check', 'Wynyard', 'Finale'];

export const S = [
  { c: 0, h: `Happy birthday, ${NAME}!`, t: "Today you're a contestant on The Amazing Race: Sydney edition.\nNine letters are hidden across the city. Collect them all and unscramble them to find where you're eating tonight." },
  { c: 0, t: "Rules:\n1. No talking to strangers (photos only).\n2. Keep this page open on your phone.\n3. Stuck? Tap the menu at the top left to jump to a checkpoint." },
  { c: 1, h: 'Leg 1: Molly Tea', t: "Fuel up first. Your order is waiting at Molly Tea. [EDIT: which branch + how she picks it up]" },
  { c: 1, t: 'Check the cup sleeve or the bag. Your first letter is hiding there.', letter: 'O' },
  { c: 2, h: 'Leg 2: Memory Match', t: 'Somewhere nearby, a photo of us is stuck to a pole. [EDIT: location hint]' },
  { c: 2, t: 'Where was the photo taken? [EDIT: question]', ask: { a: ['edit this answer'], hint: '[EDIT: hint]' } },
  { c: 2, t: "Correct! Here's your next letter.", letter: 'C' },
  { c: 3, h: 'Leg 3: Chinatown', t: 'Photo challenge! Take a picture of something red, then upload it here.' },
  { c: 3, t: 'Upload your red thing.', photo: 'chinatown-red' },
  { c: 3, t: 'Nice eye. Another letter is yours.', letter: 'M' },
  { c: 3, t: 'Bonus: a selfie in front of a lantern or lucky cat.', photo: 'chinatown-selfie' },
  { c: 4, h: 'Leg 4: Town Hall', t: 'Time for couple trivia. Get it right to earn a letter.' },
  { c: 4, t: '[EDIT: question 1 about us]', ask: { a: ['edit this answer'], hint: '[EDIT: hint]' } },
  { c: 4, t: 'Roadblock: recreate a pose from a photo of us, then upload it.', photo: 'townhall-pose' },
  { c: 4, t: 'Roadblock done. Two letters for you.', letter: 'N' },
  { c: 4, t: 'And the second one.', letter: 'A' },
  { c: 5, h: "What's the time?", t: "Time to get a watch!\nGo to the nearest JB Hi-Fi and buy a Garmin." },
  { c: 5, t: "Honestly, how many times have you asked me the time today? My stopwatch is exhausted." },
  { c: 5, t: "Fine, I did the research. Swipe through the shortlist and tap Show specs on each.", shop: true },
  { c: 5, t: "Pick your favourite and tell me tonight. No pressure. (Some pressure.) Here's a letter for your trouble.", letter: 'C' },
  { c: 5, t: "And a bonus letter for good taste.", letter: 'O' },
  { c: 6, h: 'Leg 6: Wynyard', t: 'Almost there. Find the QR sticker near [EDIT: spot] and scan it. [EDIT: voice message / clue]' },
  { c: 6, t: 'Final photo dare: [EDIT: dare]', photo: 'wynyard-dare' },
  { c: 6, t: 'Two letters left, both yours.', letter: 'G' },
  { c: 6, t: 'The last one.', letter: 'O' },
  { c: 7, h: 'Unscramble it!', t: 'You have all nine letters. Where are we eating tonight?' },
  { c: 7, t: 'Type the restaurant name.', ask: { a: ['mango coco', 'mangococo'], hint: 'Nine letters, two words. Think dessert.' } },
  { c: 7, h: 'Winner!', t: `Happy birthday, ${NAME}. Head to Mango Coco and I'll meet you there. [EDIT: final message]` },
];
