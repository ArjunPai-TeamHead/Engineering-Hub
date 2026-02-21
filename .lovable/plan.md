

# EngiNexus — Mega Feature Expansion Plan

## Scope Assessment

This request covers ~15+ major feature areas. Given the constraints of a browser-based React/Vite platform (no native Rust/WASM, no real hardware access), we will implement everything that is feasible as rich, functional UI with real backend integration, and provide polished placeholder experiences for features requiring external engines (physics simulation, real hardware serial).

---

## Changes Overview

### 1. Auth Gating (All Routes Require Sign-In)
- Wrap the `AppLayout` with an auth check: if not logged in, redirect to `/auth`
- The landing page (`/`) remains public; all zone routes require authentication
- Add Google OAuth sign-in via Lovable Cloud managed auth

### 2. Google Authentication
- Use the `configure-social-auth` tool to enable Google OAuth
- Add a "Sign in with Google" button to the Auth page using `lovable.auth.signInWithOAuth("google")`

### 3. Settings Page
- New `/settings` route with sections: Profile, Account, Appearance (theme toggle), and Notifications
- Editable display name, bio, skill level, GitHub username, avatar URL
- Password change and sign-out options
- Add Settings icon to the sidebar footer

### 4. Combine Forge + Toolbox into "The Workshop"
- Merge the Forge and Toolbox into a single zone called "The Workshop" at `/workshop`
- Two tabs/sections: "Calculators" (all toolbox tools) and "Fabrication" (all forge tools)
- Update sidebar navigation (remove separate Forge/Toolbox entries, add Workshop)
- Keep all existing sub-routes working under `/workshop/...`

### 5. The Hive — Discord-Style Redesign
- Server/channel sidebar with collapsible categories (Text Channels, Voice Channels placeholder)
- User avatars with colored role indicators
- Message grouping by same-user consecutive messages
- Emoji reactions placeholder
- Online/offline member list panel on the right
- Discord-style message input bar with formatting hints
- Thread reply indicator

### 6. The Lab — Interactive Simulator UI
- Split-pane layout: left = 2D breadboard workspace, right = code editor
- Breadboard SVG grid with snap-to-grid component placement
- Draggable component palette from the component library
- Each component renders as a styled card/icon on the breadboard
- Component images generated via AI image generation for key components (MCUs, sensors, motors) -- stored as static SVG/icon representations
- Virtual Serial Monitor panel (bottom)
- GPIO State Matrix visualization
- Wire drawing tool (click pin-to-pin)
- "Simulate" button (shows toast: "WASM engine in development")
- Code editor panel with syntax highlighting (using a `<textarea>` with monospace styling and basic highlighting)
- Component Property Editor sidebar when a component is selected

### 7. Component Library Enhancement
- Add real pricing data from the user's provided list to each component
- Add `image` field with placeholder SVG icons per category
- Add detailed descriptions from the provided reference text

### 8. The Depot — Enhanced with Real Pricing + Payment
- Update all component prices to match the provided Robu.in/SparkFun prices
- Add INR and USD price columns
- Stripe integration for checkout (using the Stripe connector)
- "My Parts Box" inventory tracker (database-backed)
- "Can I Build It?" feature comparing owned parts against tutorial BOMs

### 9. More Toolbox/Workshop Calculators
- **Power Calculator**: Wattage from voltage and current
- **Capacitor Code Calculator**: Read ceramic capacitor markings
- **Inductor Color Code**: Like resistor calculator but for inductors
- **Wire Length Resistance**: Calculate resistance for a given wire gauge and length
- **Decibel Calculator**: Convert between power/voltage ratios and dB
- **Frequency/Wavelength Calculator**: Convert between frequency, wavelength, and period
- **Stripboard Planner**: Simple grid-based layout tool for Veroboard

---

## Technical Details

### File Changes

**New files:**
- `src/pages/Settings.tsx` — Settings page with profile editing
- `src/pages/Workshop.tsx` — Combined Forge+Toolbox landing page
- `src/components/lab/Breadboard.tsx` — SVG breadboard grid
- `src/components/lab/ComponentPalette.tsx` — Draggable component list
- `src/components/lab/CodeEditor.tsx` — Simple code editor panel
- `src/components/lab/SerialMonitor.tsx` — Virtual serial output
- `src/components/lab/GPIOMatrix.tsx` — Pin state visualization
- `src/components/lab/SimulatorWorkspace.tsx` — Main simulator layout
- `src/components/hive/ChannelSidebar.tsx` — Discord-style channel list
- `src/components/hive/MessageList.tsx` — Message rendering with grouping
- `src/components/hive/MemberList.tsx` — Online members panel
- `src/components/ProtectedRoute.tsx` — Auth gate wrapper
- `src/pages/toolbox/PowerCalc.tsx` — Power calculator
- `src/pages/toolbox/CapacitorCode.tsx` — Capacitor marking decoder
- `src/pages/toolbox/FrequencyCalc.tsx` — Frequency/wavelength tool
- `src/pages/toolbox/DecibelCalc.tsx` — dB calculator

**Modified files:**
- `src/App.tsx` — Add auth gating, new routes, merge forge/toolbox routes under workshop
- `src/components/AppSidebar.tsx` — Update nav (Workshop replaces Forge+Toolbox, add Settings)
- `src/pages/Auth.tsx` — Add Google sign-in button
- `src/pages/Lab.tsx` — Complete redesign as simulator workspace
- `src/pages/Hive.tsx` — Discord-style redesign
- `src/pages/Depot.tsx` — Real pricing, payment integration
- `src/data/componentLibrary.ts` — Add pricing, images, extended descriptions
- `src/hooks/useAuth.tsx` — Add loading screen/redirect logic
- `src/components/AppLayout.tsx` — Add auth check wrapper

### Database Changes
- New table: `user_inventory` (user_id, component_id, quantity) for "My Parts Box"
- RLS: Users can only CRUD their own inventory

### Auth Flow
1. User visits any route except `/` and `/auth`
2. If not authenticated, redirect to `/auth`
3. Auth page shows email/password + Google OAuth
4. On success, redirect to intended destination

### Simulator Architecture (Lab)
The simulator will be a rich interactive UI with:
- SVG-based breadboard (830 tie-point layout)
- Component placement via drag-and-drop from palette
- Wire connections stored in React state
- No actual circuit simulation (WASM engine noted as "coming soon")
- Code editor with basic C++/Python mode switching
- Serial monitor shows mock output or user-typed input

This gives the full Wokwi/Tinkercad visual experience while the real simulation engine is developed separately.

### Stripe Payment (Depot)
- Enable Stripe integration for one-click BOM checkout
- Create a checkout edge function that generates a Stripe checkout session
- Cart persists in React state; on "Buy" it sends the BOM to the edge function

