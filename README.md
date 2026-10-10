<div align="center">

F.TV

A smarter TV experience, powered by React Native

Explore content. Enjoy the big screen. Discover more with ViewAI Companion.







</div>

✨ About F.TV

F.TV is a cross-platform TV app built with React Native and a shared component architecture. It brings browsing, content details, video playback, and remote-friendly navigation into one TV-optimized experience.

The project also includes ViewAI Companion modules: an in-player companion panel, suggested questions, viewing context, and a highlights timeline. These components are organized so the companion experience can evolve independently from the core player.

Built for the big screen, with a focus on clear navigation, reusable UI, and a more interactive way to explore what you're watching.

🚀 Highlights

📺 TV-first experience

Browse content through TV-friendly screens and layouts.

Navigate with a remote control, keyboard, or supported platform input.

Use focus-aware controls designed for viewing from a distance.

Play video with player controls, seeking, buffering feedback, and exit navigation.

🧠 ViewAI Companion

AI Companion panel — a dedicated companion surface within the player experience.

Suggested questions — quick prompts to help viewers explore a title.

Viewing context — a place for relevant details about the content being watched.

Highlights timeline — components for presenting notable moments and highlight cards.

Modular service layer — companion logic is organized in aiService.ts for easier iteration and integration.

Note: the presence of companion UI components does not by itself guarantee a live AI backend. Check packages/shared-ui/src/services/aiService.ts for the current response implementation and configuration.

🌍 Multi-platform foundation

Shared UI package for common screens and components.

Expo-based app for supported React Native TV platforms and web.

Separate Vega app structure for Fire TV devices running Vega OS.

Platform-specific implementations selected through file extensions such as .android.ts, .ios.ts, and .kepler.ts.

🖼️ Preview



🧰 Tech stack

Technology

Role

React Native

Cross-platform application UI

Expo SDK

Development tooling and app workflows

TypeScript

Typed application code

Yarn Workspaces

Monorepo package management

React Navigation

Screen and drawer navigation

React TV Space Navigation

TV focus and spatial navigation

react-native-video

Video playback integration

Amazon Vega SDK

Vega OS app variant

🏗️ Project structure

F.TV/
├── apps/
│   ├── expo-multi-tv/       # Expo app for supported TV platforms and web
│   └── vega/                # Fire TV Vega OS app
├── packages/
│   └── shared-ui/
│       └── src/
│           ├── components/
│           │   ├── ai/      # AICompanionPanel, SuggestedQuestions
│           │   ├── context/ # ViewingContextPanel
│           │   ├── highlights/ # HighlightsTimeline, HighlightCard
│           │   └── player/  # Video player and controls
│           ├── screens/     # Home, details, player, explore, TV, settings
│           ├── services/    # Companion and app services
│           └── navigation/  # Shared navigation
├── package.json             # Workspace scripts and dependencies
├── yarn.lock
└── tsconfig.base.json

⚡ Getting started

Prerequisites

Node.js (18 or newer; use a version compatible with the installed dependencies)

Corepack, included with supported Node.js releases

Git

Platform tools where applicable: Android Studio/Android SDK for Android TV, Xcode on macOS for Apple TV, and the Amazon Vega SDK for the Vega app

1. Clone the repository

git clone https://github.com/samba06v/F.TV.git
cd F.TV

2. Install dependencies

Use Corepack to run the repository's configured Yarn version:

corepack yarn install

3. Start the app

Run commands from the repository root unless noted otherwise.

Target

Command

Start Expo / Metro

corepack yarn dev

Android TV / Fire TV (Fire OS)

corepack yarn dev:android

Apple TV (macOS required)

corepack yarn dev:ios

Web development

corepack yarn dev:web

Vega app

corepack yarn dev:vega

Vega production build

corepack yarn build:vega

The exact device or simulator steps depend on the target platform and its development tools. For app-specific scripts, see apps/expo-multi-tv/package.json and apps/vega/package.json.

Type-check the Expo app

cd apps/expo-multi-tv
corepack yarn exec tsc --noEmit

A successful type-check exits without printing errors.

🧭 Where the ViewAI code lives

File

Purpose

packages/shared-ui/src/components/ai/AICompanionPanel.tsx

Companion panel UI

packages/shared-ui/src/components/ai/SuggestedQuestions.tsx

Suggested prompt UI

packages/shared-ui/src/components/context/ViewingContextPanel.tsx

Viewing context panel

packages/shared-ui/src/components/highlights/HighlightsTimeline.tsx

Highlights timeline

packages/shared-ui/src/components/highlights/HighlightCard.tsx

Individual highlight card

packages/shared-ui/src/services/aiService.ts

Companion service logic

packages/shared-ui/src/screens/PlayerScreen.tsx

Player screen integration

🛠️ Development notes

Keep shared UI and cross-platform behavior in packages/shared-ui where possible.

Use platform-specific files when a feature genuinely needs a different implementation for Android, iOS/tvOS, or Vega OS.

Keep secrets and API keys out of Git. Use a backend or local environment configuration for credentials, and never commit real .env files.

Before submitting changes, run the relevant type-checks and tests for the app you changed.

🤝 Contributing

Contributions, bug reports, and ideas are welcome. For a change:

Create a feature branch.

Make and test your change.

Commit it with a descriptive message.

Open a pull request with a summary and screenshots when useful.

📄 License

This project includes the license terms in LICENSE. Review that file before redistributing or reusing the code.

<div align="center">

F.TV — made for the big screen.

</div>
