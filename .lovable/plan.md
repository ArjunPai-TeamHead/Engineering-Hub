

# EngiNexus — Phase 1: "The Foundation"

## Overview
Build the landing experience, authentication, engineering utilities, and basic community — giving students an immediately useful platform while the custom simulator is developed separately.

---

## 1. Landing Page & Branding
- Hero section introducing EngiNexus with the 8-zone concept
- Animated zone icons (Lab, Hive, Academy, Core, Depot, Forge, Toolbox, Grid)
- Call-to-action for sign-up
- Feature preview sections showing what's coming

## 2. Authentication & User Profiles
- Sign up / Log in with email (via Supabase Auth)
- User profiles with display name, avatar, bio, skill level
- Role badges: "Apprentice" (default), with placeholder for earned roles
- "My Dashboard" showing enrolled courses, saved projects, and reputation

## 3. The Toolbox — Engineering Utilities (Zone 7)
*Fully functional from day one — immediate value for students:*
- Resistor Color Code Calculator (visual, interactive)
- Ohm's Law Calculator
- Voltage Divider Calculator
- LED Series Resistor Calculator
- Battery Life Estimator
- 555 Timer Calculator with visual waveform
- Hex / Binary / Decimal Converter
- ASCII Table Reference
- Unit Converter (length, temperature, pressure)
- Regex Tester for serial data parsing

## 4. The Academy — Course Structure (Zone 3)
- Course catalog page with cards for IoT, Robotics, and AI paths
- Visual skill tree showing learning progression
- Individual lesson pages with markdown-rendered content
- Code snippets with syntax highlighting
- Progress tracking per user (stored in Supabase)
- Daily challenge placeholder (curated "Fix this code" puzzles)

## 5. The Hive — Basic Community (Zone 2)
- Channel-based text chat (General, Help, Showcase, Off-Topic)
- Real-time messaging powered by Supabase Realtime
- Code block support with syntax highlighting in messages
- Threaded replies
- User profiles visible on click
- Basic reputation display ("Volts" counter)

## 6. The Core — AI Assistant (Zone 4)
- Chat-based AI helper (via edge function calling an LLM API)
- Error Translator: paste a compiler error, get plain English explanation
- Component Substitution: "What can I use instead of X?"
- Idea Generator: "I have a servo and an LDR, what can I build?"
- Code explainer for Arduino/Python snippets

## 7. The Lab — Placeholder & Component Library (Zone 1)
- Interactive component library browser (search, filter, view specs)
- Component detail cards with pinout diagrams, descriptions, and datasheet links
- "Coming Soon" interactive preview showing the simulator vision
- Static breadboard viewer (SVG-based visual, no simulation yet)

## 8. Navigation & Layout
- Sidebar navigation with zone icons (Lab, Hive, Academy, Core, Toolbox)
- Responsive design for desktop and tablet
- Dark mode support (engineer-friendly)
- Toast notifications for actions

---

## Backend (Supabase)
- **Auth**: Email/password sign-up
- **Database**: Users, profiles, courses, progress, chat messages, reputation
- **Realtime**: Chat messaging
- **Edge Functions**: AI assistant API calls

## What This Delivers
Students get: useful calculators, a learning path, a community to ask questions, and an AI helper — all on day one. The simulator (WASM/Rust) can be developed as a separate project and embedded later.

