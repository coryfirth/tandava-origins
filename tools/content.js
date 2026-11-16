/* ==========================================================================
   Lifestyle Toolkit — content
   --------------------------------------------------------------------------
   Everything on /tools and /tools/start-here that is worth editing lives in
   this one file. Change a string here and the page changes. No other file
   needs touching.

   The two exceptions, both on /tools, are the hero and the big featured card:
   those sit in tools/index.html so you can read them in context, the way the
   rest of the site is written. The tool name inside that card still comes
   from PLACEHOLDER.toolName below.

   The prompt itself is NOT in here. It lives in tools/start-here-prompt.txt
   and the page loads that file at runtime, so replacing the .txt is the whole
   job of changing the prompt.
   ========================================================================== */

window.TK = (function () {
  'use strict';

  /* ------------------------------------------------------- placeholders --
     Nothing below is connected yet.

     Leave a value as an empty string and the page shows a dashed amber
     PLACEHOLDER box in its place, using the note as the description. Fill the
     value in and the box disappears on its own. That is the only change
     needed: no markup, no CSS, no JavaScript.

     TODO(integration): fill in every `value` below.                        */

  var PLACEHOLDER = {

    /* Step 2. Where a client downloads their full genetics report. */
    portalUrl: {
      value: '',
      note: 'Link to the results portal, where the genetics report is downloaded'
    },

    /* Step 2. The "forgot your login" link for that same portal. */
    resetUrl: {
      value: '',
      note: 'Link to reset the portal password'
    },

    /* Step 3. One set of steps per AI, for turning off training on chats.
       Write each as a list of short lines. An empty list shows the box. */
    optOutClaude: {
      value: [],
      note: 'Claude: the exact steps to turn off training on your chats'
    },
    optOutChatGPT: {
      value: [],
      note: 'ChatGPT: the exact steps to turn off training on your chats'
    },
    optOutGemini: {
      value: [],
      note: 'Gemini: the exact steps to turn off training on your chats'
    },

    /* The tool's final name. Until this is filled in, the page uses
       "Your Lifestyle Assistant" and marks it as not yet decided. */
    toolName: {
      value: '',
      note: 'Final name of the tool',
      fallback: 'Your Lifestyle Assistant'
    }
  };

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

  /* Step 2. The three files to collect. `link` and `linkAfter` are optional:
     they turn part of the line into a link, or append one. */
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
      links: [
        { label: 'Open the portal',   placeholder: 'portalUrl' },
        { label: 'Reset my password', placeholder: 'resetUrl' }
      ]
    }
  ];

  /* Step 3. One tab per AI. */
  var OPT_OUT = [
    { name: 'Claude',  placeholder: 'optOutClaude'  },
    { name: 'ChatGPT', placeholder: 'optOutChatGPT' },
    { name: 'Gemini',  placeholder: 'optOutGemini'  }
  ];

  /* Step 4. Where the prompt is loaded from. Replace that file to change the
     prompt: nothing else needs editing. */
  var PROMPT_URL = '/tools/start-here-prompt.txt';

  /* Step 5. The three AIs, and the line underneath them. */
  var LAUNCH = [
    { name: 'Claude',  url: 'https://claude.ai' },
    { name: 'ChatGPT', url: 'https://chatgpt.com' },
    { name: 'Gemini',  url: 'https://gemini.google.com' }
  ];

  var LAUNCH_NOTE = 'Then: start a new chat, attach your three files, paste your prompt, and press send.';

  return {
    PLACEHOLDER: PLACEHOLDER,
    SOON: SOON,
    SOON_HEADING: SOON_HEADING,
    STEPS: STEPS,
    STEP_NAMES: STEP_NAMES,
    FILES: FILES,
    OPT_OUT: OPT_OUT,
    PROMPT_URL: PROMPT_URL,
    LAUNCH: LAUNCH,
    LAUNCH_NOTE: LAUNCH_NOTE
  };
})();
