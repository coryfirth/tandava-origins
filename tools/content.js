/* ==========================================================================
   Lifestyle Toolkit — content
   --------------------------------------------------------------------------
   Everything on /tools and /tools/start-here that is worth editing lives in
   this one file. Change a string here and the page changes. No other file
   needs touching.

   The two exceptions, both on /tools, are the hero and the big featured card:
   those sit in tools/index.html so you can read them in context, the way the
   rest of the site is written.

   The prompt itself is NOT in here. It lives in tools/start-here-prompt.txt
   and the page loads that file at runtime, so replacing the .txt is the whole
   job of changing the prompt.
   ========================================================================== */

window.TK = (function () {
  'use strict';

  /* ------------------------------------------------------------- shared --
     The portal. One address, used by the Sign in button in the bar and by
     the one in step 2, so it only ever has to change here. */
  var PORTAL_URL = 'https://app.tandavaretreats.com/';

  /* The tool's name, in both places it appears. */
  var TOOL_NAME = 'Your Lifestyle Assistant';

  /* ----------------------------------------------------------------- AI --
     The three assistants, used twice: the row under the hero on /tools, and
     the launch buttons on the last step.

     Each one carries its mark twice. `ink` is the flat silhouette in our own
     ink, faded under the hero the way the partner logos sit on the homepage.
     `colour` is the mark as its owner draws it, for the white launch buttons
     on the last step. Empty either one and the name is set in our type
     instead, so a missing file never leaves a hole. */
  var AI = [
    {
      name: 'Claude',
      url: 'https://claude.ai',
      ink: '/assets/logos-ai/ink/claude.webp',
      colour: '/assets/logos-ai/colour/claude.webp'
    },
    {
      name: 'ChatGPT',
      url: 'https://chatgpt.com',
      ink: '/assets/logos-ai/ink/chatgpt.webp',
      colour: '/assets/logos-ai/colour/chatgpt.webp'
    },
    {
      name: 'Gemini',
      url: 'https://gemini.google.com',
      ink: '/assets/logos-ai/ink/gemini.webp',
      colour: '/assets/logos-ai/colour/gemini.webp'
    }
  ];

  /* ------------------------------------------------------------- /tools --
     The eight tools that are not built yet. These are cards, not links.    */

  var SOON = [
    { group: 'Nutrition', name: 'Recipe Builder',       line: 'Meals built around your results.' },
    { group: 'Nutrition', name: 'Grocery List Builder', line: 'A weekly list that fits your profile.' },
    { group: 'Sleep',     name: 'Sleep Time Planner',   line: 'Find your window and protect it.' },
    { group: 'Sleep',     name: 'Sleep Routine Builder',line: 'An evening routine you can keep.' },
    { group: 'Movement',  name: 'Workout Planner',      line: 'Training that suits your results.' },
    { group: 'Organize',  name: 'Sunday Sync',          line: 'Plan your week in ten minutes.' },
    { group: 'Health',    name: 'Doctor Download',      line: 'A one-page sheet for your doctor.' },
    { group: 'Health',    name: 'Labs Translator',      line: 'Read your bloodwork beside your DNA.' }
  ];

  var SOON_HEADING = 'More tools on the way';

  /* ------------------------------------------------ /tools/start-here --
     Five steps, in order. Each one has an eyebrow, a two-tone headline
     (`title` is the plain part, `titleAccent` the clay-coloured part) and
     any number of paragraphs. `block` adds the interactive piece.          */

  var STEPS = [
    {
      eyebrow: 'Start here',
      title: 'Let’s build your ',
      titleAccent: 'personal lifestyle assistant.',
      body: [
        'In about 10 minutes you will have an AI assistant that knows your Lifestyle Profile, asks you a few questions, and walks you through your results.',
        'You need three files and the AI of your choice. We will take it one step at a time.'
      ]
    },
    {
      eyebrow: 'Step 2 · Gather',
      title: 'Grab your ',
      titleAccent: 'three files.',
      body: ['Tick each one off as you save it somewhere easy to find.'],
      block: 'files'
    },
    {
      eyebrow: 'Step 3 · Protect',
      title: 'Keep your data ',
      titleAccent: 'yours.',
      body: ['Before you upload anything, switch off the setting that lets your AI learn from your chats. Pick your AI to see how.'],
      block: 'tabs'
    },
    {
      eyebrow: 'Step 4 · Copy',
      title: 'Copy your ',
      titleAccent: 'prompt.',
      body: ['This is the one instruction your AI needs. Copy it now, you will paste it in the next step.'],
      block: 'prompt'
    },
    {
      eyebrow: 'Step 5 · Launch',
      title: 'Pick your AI ',
      titleAccent: 'and go.',
      body: ['Choose the one you like best. It opens in a new tab.'],
      block: 'launch'
    }
  ];

  /* A short word per step, read out after "Step 2 of 5" by a screen reader. */
  var STEP_NAMES = ['Welcome', 'Gather', 'Protect', 'Copy', 'Launch'];

  /* Step 2. The three files to collect. The last one carries the button
     through to the portal, which opens in its own tab. */
  var FILES = [
    {
      name: 'Your Lifestyle Profile',
      line: 'Attached to your “results are in” email'
    },
    {
      name: 'Your interpretation letter',
      line: 'Attached to the same email'
    },
    {
      name: 'Your genetics report',
      line: 'Download it from the portal.',
      action: {
        label: 'Sign in to the portal',
        url: PORTAL_URL,
        note: 'Reach out to your practitioner if you forget your login.'
      }
    }
  ];

  /* Step 3. One tab per AI: how to stop it training on your chats.
     These menus are renamed every few months, hence the dated footnote. */
  var OPT_OUT = [
    {
      name: 'Claude',
      steps: [
        'Open Settings.',
        'Choose Privacy.',
        'Find “Help improve our AI models” and switch it off.'
      ]
    },
    {
      name: 'ChatGPT',
      steps: [
        'Open your account menu and choose Settings.',
        'Choose Data controls.',
        'Select “Improve the model for everyone”, switch it off, and select Done.'
      ]
    },
    {
      name: 'Gemini',
      steps: [
        'Go to gemini.google.com.',
        'Click “Settings and help”, then “Activity”.',
        'Near the top, click “On”, then choose “Turn off”.'
      ],
      note: 'Turning this off also stops Gemini from saving your chats, so you may not be able to return to this conversation later.'
    }
  ];

  var OPT_OUT_FOOTNOTE = 'Settings change. Checked November 2026.';

  /* Step 4. Where the prompt is loaded from. Replace that file to change the
     prompt: nothing else needs editing. */
  var PROMPT_URL = '/tools/start-here-prompt.txt';

  /* Step 5. The line under the three buttons. */
  var LAUNCH_NOTE = 'Then: start a new chat, attach your three files, paste your prompt, and press send.';

  return {
    PORTAL_URL: PORTAL_URL,
    TOOL_NAME: TOOL_NAME,
    AI: AI,
    SOON: SOON,
    SOON_HEADING: SOON_HEADING,
    STEPS: STEPS,
    STEP_NAMES: STEP_NAMES,
    FILES: FILES,
    OPT_OUT: OPT_OUT,
    OPT_OUT_FOOTNOTE: OPT_OUT_FOOTNOTE,
    PROMPT_URL: PROMPT_URL,
    LAUNCH_NOTE: LAUNCH_NOTE
  };
})();
