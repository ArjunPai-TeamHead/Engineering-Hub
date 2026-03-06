

## Plan: Replace Courses with PDF Content + Add Quizzes & Progress Tracking

### What's Changing

The PDF contains **38 Raspberry Pi robotics projects** (R1-R38) covering LEDs, buttons, RGB, buzzers, sensors, motors, robot car control, IoT (Blynk), GUI (Tkinter), Bluetooth (BlueDot), and LCD displays. These will be organized into a single structured Raspberry Pi course. The existing Arduino, OpenCV, and PyGame courses will be kept since the user previously requested them. The old IoT, Robotics Basics, AI/TinyML, and Line-Following courses will be removed.

### Course Structure (4 courses total)

**1. Raspberry Pi Robotics 2025** (from PDF) -- grouped into ~8 lessons:
- Lesson 1: LED Basics (R1-R3: blink, user-controlled, blinker)
- Lesson 2: LED Projects (R4-R5: math quiz, guess the number)
- Lesson 3: Traffic Light & RGB LEDs (R6-R8: traffic sim, RGB colors, user-controlled RGB)
- Lesson 4: Buttons & Interactions (R9-R12: button LED, dual-button, toggle, RGB switcher)
- Lesson 5: Buzzer, GUI & Bluetooth (R13-R18: buzzer piano, GUI LED, BlueDot)
- Lesson 6: IoT & Sensors (R19-R24: Blynk, LDR, PIR, intruder alarm)
- Lesson 7: DC Motors & Robot Car (R25-R31: motor control, robot assembly, keyboard/GUI/BlueDot control)
- Lesson 8: IoT Robot & Advanced Projects (R32-R38: BlueDot robot, Blynk robot, light-following, LCD projects)

**2. Arduino Robotics 2025** (keep existing)
**3. OpenCV Computer Vision 2025** (keep existing)
**4. PyGame Game Development 2025** (keep existing)

### Quizzes

Add a `quiz` field to the `Lesson` interface:

```typescript
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface Lesson {
  // ...existing fields
  quiz?: QuizQuestion[];
}
```

Each lesson gets 2-3 quiz questions at the end. Examples:
- "What does `gpio.setmode(gpio.BCM)` do?" with multiple choice
- "Which pin mode is used for LEDs?" etc.

### Lesson Progress Tracking

The `course_progress` table already exists. Add a "Mark Complete" button on the lesson page and a quiz score check. Show progress on the course page (completed lessons highlighted, progress bar).

### Files to Change

1. **`src/data/courses.ts`** -- Replace all courses. Remove old IoT/Robotics/AI courses. Add new RPi course from PDF. Keep Arduino, OpenCV, PyGame. Add quiz data to all lessons. Update skill paths.

2. **`src/pages/academy/LessonPage.tsx`** -- Add quiz UI at the bottom of each lesson (multiple-choice cards). Add "Mark as Complete" button that saves to `course_progress` table. Show completion state.

3. **`src/pages/academy/CoursePage.tsx`** -- Show progress bar at the top. Show checkmarks on completed lessons. Fetch progress from `course_progress` table for logged-in users.

4. **`src/pages/Academy.tsx`** -- Show course completion percentage on course cards. Update skill paths display.

### Technical Details

- Quiz component: radio group selections, submit button, score display with correct/incorrect highlights
- Progress: use existing `course_progress` table with `useAuth` hook for user context
- Upsert on mark complete: `supabase.from('course_progress').upsert({ user_id, course_id, lesson_id, completed: true, completed_at: new Date() })`
- Progress query: `supabase.from('course_progress').select('*').eq('user_id', userId).eq('course_id', courseId)`
- No schema changes needed -- `course_progress` table already has all required columns

