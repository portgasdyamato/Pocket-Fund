# Design Guidelines: The Financial Glow-Up

## Design Approach

**Reference-Based Approach** drawing from Gen-Z success stories:
- **Duolingo**: Gamification, streak mechanics, celebration moments
- **Nike Training Club**: Motivational language, progress visualization, achievement focus
- **Cash App**: Clean mobile-first, Gen-Z friendly, approachable finance
- **Strava**: Social challenges, leaderboards, performance tracking

**Core Design Principles:**
1. **High Energy, Zero Judgment**: Bold, confident, motivational - never boring or corporate
2. **Instant Gratification**: Immediate visual feedback for every action
3. **Game First, Finance Second**: Make budgeting feel like leveling up, not restricting
4. **Mobile-Native**: Design for thumbs, not desktops

## Typography System

**Headings:**
- Display/Hero: 700 weight, 3xl to 6xl scale, tight leading for punch
- H1: 700 weight, 2xl to 4xl
- H2: 600 weight, xl to 2xl
- H3: 600 weight, lg to xl

**Body & UI:**
- Primary body: 400 weight, base to lg
- Labels/Tags: 600 weight, sm to base, uppercase tracking for energy
- Numbers/Stats: 700 weight, tabular figures, emphasize impact
- Microcopy/Hints: 400 weight, sm, slightly loose leading

**Font Selection:** Google Fonts via CDN
- Headlines: Space Grotesk or Inter (700-800 weights)
- Body: Inter or DM Sans (400-600 weights)
- Accent/Stats: JetBrains Mono for numbers (tabular)

## Layout System

**Spacing Primitives:** Use Tailwind units of 1, 2, 4, 6, 8, 12, 16 for consistency
- Micro: p-1, gap-2 (tight elements)
- Standard: p-4, m-6, gap-4 (cards, components)
- Section: py-8, py-12, py-16 (vertical rhythm)
- Major: mt-12, mb-16 (page sections)

**Grid System:**
- Mobile: Single column, full-bleed cards
- Tablet: 2-column for stats, challenges
- Desktop: 3-column dashboard, 2-column detail views
- Max-width: max-w-7xl for dashboards, max-w-4xl for focused tasks

**Container Strategy:**
- Dashboard: Full viewport with fixed navigation, scrollable content areas
- Cards: Rounded-2xl corners, shadow-lg elevation
- Overlays: Rounded-3xl modals, slide-up sheets for mobile

## Component Library

### Navigation & Structure

**Mobile Bottom Tab Bar:**
- 5 primary actions: Dashboard, Fight Plan (Budget), Add Expense, Challenges, Profile
- Large touch targets (min 48px height)
- Icon + label combo
- Active state with heavier weight icon
- Icons: Heroicons via CDN

**Top Header:**
- Left: Back/Menu
- Center: Page title or streak counter
- Right: Notifications bell, settings
- Sticky positioning with subtle shadow on scroll

**Dashboard Layout:**
- Hero Stats Card: Financial health score with circular progress
- Quick Actions: 4-button grid (Log Expense, Start Challenge, View Fight Plan, Ask Coach)
- Current Fight: Active budget overview with progress bars
- Recent Wins: Achievement feed with celebratory badges
- This Week's Rounds: Challenge cards in horizontal scroll

### Core Components

**Cards:**
- Primary: Rounded-2xl, p-6, shadow-md, hover:shadow-lg transition
- Stat Cards: Icon + Big Number + Label + Trend indicator
- Challenge Cards: Title + Progress Ring + Points + CTA
- Transaction Cards: Icon + Description + Amount + Category tag

**Progress Indicators:**
- Circular Progress: Health score, challenge completion (0-100%)
- Linear Bars: Budget categories, spending limits
- Streak Flames: Daily login/logging streaks with fire emoji
- Level Badges: Milestone achievements with metallic treatments

**Buttons:**
- Primary CTA: Rounded-full, px-8, py-4, text-lg, font-600, shadow-md
- Secondary: Rounded-full, border-2, px-6, py-3
- Ghost: No background, underline on hover
- Floating Action (FAB): Fixed bottom-right, rounded-full, size-16, shadow-xl
- On images: Backdrop-blur-md background, rounded-full

**Input Fields:**
- Rounded-xl borders, p-4 padding
- Large touch targets for mobile
- Inline icons (left side)
- Error states with shake animation
- Success states with check mark

**Tags & Badges:**
- Rounded-full, px-3, py-1, text-sm, font-600, uppercase tracking-wide
- Category tags: Small, pill-shaped
- Points badges: Larger, with icon prefix
- Streak indicators: Flame emoji + number

### Data Visualization

**Health Score (Dashboard Hero):**
- Large circular progress (200px+ diameter on mobile)
- Animated fill on page load
- Central score number (0-100)
- Surrounding text: "Your Financial Health"

**Spending Charts:**
- Donut chart for category breakdown
- Simple bar charts for week-over-week
- Trend lines with gradient fills
- Interactive tooltips on hover/tap

**Challenge Progress:**
- Ring progress for active challenges
- Mini progress bars in challenge cards
- Completion checkmarks and celebration confetti

### Gamification Elements

**Victory Moments:**
- Full-screen celebration overlay when goals hit
- Confetti animation (use canvas-confetti library)
- Bold achievement text with points earned
- Share to social CTA

**Streak Tracking:**
- Fire emoji + number in top corner
- Growing flame intensity with longer streaks
- Warning state at risk of breaking

**Point System:**
- Always visible running total in header
- "+50 Points!" toast notifications
- Leaderboard rankings (if social features enabled)

**Level System:**
- Progress bar showing next level
- Badge collection gallery
- "You just leveled up!" animations

### AI Coach Interface

**Chat Interface:**
- Bottom-anchored input with send button
- Message bubbles: Coach (left-aligned), User (right-aligned)
- Typing indicators with dots animation
- Quick reply chips below coach messages
- Emoji reactions for coach encouragement

**Coach Personality:**
- Avatar: Simple illustration or emoji representation
- Response style: Short, punchy, supportive messages
- Use motivational slang: "Let's get it!", "That's a W!", "You're crushing it!"
- Celebrate wins, gentle on setbacks

### Expense Logging

**Quick Add Interface:**
- Large amount input (front and center, big type)
- Category selection grid (icons + labels)
- Optional note field
- Voice input option
- Camera receipt scan button
- Swipe to confirm animation

**Category Icons:**
- Food: Fork/knife (Heroicons: cake)
- Transport: Car (Heroicons: truck)
- Shopping: Bag (Heroicons: shopping-bag)
- Entertainment: Ticket (Heroicons: ticket)
- Bills: Document (Heroicons: document-text)
- Other: Tag (Heroicons: tag)

### Challenge System

**Challenge Cards:**
- Title with emoji prefix
- Difficulty badge (Easy/Medium/Hard)
- Points reward (large, prominent)
- Progress ring or bar
- Time remaining countdown
- Join/Continue CTA

**Challenge Types:**
- Daily: 24hr countdown
- Weekly: Progress across 7 days
- Monthly: Longer-term goals
- Special Events: Limited time, bonus points

## Animations & Interactions

**Use Sparingly - High Impact Only:**
- Page transitions: Slide animations between views
- Success states: Confetti on goal completion
- Progress: Smooth fill animations for bars/rings
- Micro: Subtle scale on button press (scale-95 active state)
- Loading: Skeleton screens, not spinners

**Avoid:**
- Parallax scrolling
- Excessive hover effects
- Auto-playing carousels
- Distracting background animations

## Images

**Hero Image (Landing/Marketing Page):**
- Full-width, 70vh height hero image
- Image description: Diverse Gen-Z individuals celebrating financial wins - fist bumps, smartphone showing savings app, vibrant energy, modern setting (coffee shop or co-working space)
- Overlaid headline with backdrop-blur buttons

**Dashboard:**
- Achievement badges: Custom illustrated icons for milestones
- Empty states: Friendly illustrations for "No expenses yet," "Start your first challenge"
- Coach avatar: Simple, friendly character illustration

**Challenge Thumbnails:**
- Small icons representing challenge types (piggy bank, coffee cup, shopping bag)
- Keep lightweight, icon-based rather than photos

**Celebration Screens:**
- Illustrated trophies, medals, confetti patterns
- Bold graphics, not photographic

## Responsive Behavior

**Mobile (base to md):**
- Single column layouts
- Bottom navigation
- Full-width cards with m-4
- Sticky headers
- Slide-up modals

**Tablet (md to lg):**
- 2-column grid for stats
- Side-by-side budget categories
- Expanded challenge cards

**Desktop (lg+):**
- 3-column dashboard
- Persistent sidebar navigation (left)
- Detail panels (right)
- Hover states more prominent

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus visible states with 2px ring
- Touch targets minimum 44x44px
- High contrast text throughout
- Screen reader friendly progress announcements