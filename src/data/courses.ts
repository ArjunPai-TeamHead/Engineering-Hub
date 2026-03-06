export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  quiz?: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  path: "IoT" | "Robotics" | "AI" | "Programming";
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  lessons: Lesson[];
  prerequisites: string[];
}

export const courses: Course[] = [
  // ═══════════════════════════════════════════════════════
  // RASPBERRY PI ROBOTICS 2025 (from PDF — 38 projects)
  // ═══════════════════════════════════════════════════════
  {
    id: "rpi-robotics-2025",
    title: "Raspberry Pi Robotics 2025",
    path: "Robotics",
    level: "Beginner",
    description: "38 hands-on Raspberry Pi projects — LEDs, buttons, RGB, buzzers, sensors, motors, IoT, GUI, Bluetooth & LCD.",
    prerequisites: [],
    lessons: [
      {
        id: "rpi25-01",
        title: "LED Basics (R1–R3)",
        duration: "25 min",
        content: `# LED Basics — Blink, User-Controlled & Blinker

## R1. LED Blink

The classic "Hello World" of electronics — make an LED blink on and off.

### Components
- Raspberry Pi
- 1x LED + resistor
- Breadboard & jumper wires

### Code

\`\`\`python
import RPi.GPIO as gpio
import time

led_pin = 21

gpio.setmode(gpio.BCM)
gpio.setup(led_pin, gpio.OUT)

print("LED Blink Program Started (Press CTRL+C to stop)")

try:
    while True:
        gpio.output(led_pin, gpio.HIGH)
        print("LED is ON")
        time.sleep(1)

        gpio.output(led_pin, gpio.LOW)
        print("LED is OFF")
        time.sleep(1)

except KeyboardInterrupt:
    print("\\nProgram stopped by user. Cleaning up GPIO...")
    gpio.cleanup()
\`\`\`

### Key Concepts
- **gpio.setmode(gpio.BCM)** — Use Broadcom pin numbering
- **gpio.setup(pin, gpio.OUT)** — Configure pin as output
- **gpio.output(pin, gpio.HIGH/LOW)** — Send signal
- **gpio.cleanup()** — Reset all pins on exit

---

## R2. User Input-Controlled LED

Control the LED with text commands.

\`\`\`python
import RPi.GPIO as gpio

led_pin = 21

gpio.setmode(gpio.BCM)
gpio.setup(led_pin, gpio.OUT)

print("Type 'on', 'off', or 'exit'")

try:
    while True:
        command = input("Enter command: ").lower()

        if command == "on":
            gpio.output(led_pin, gpio.HIGH)
            print("LED is ON")
        elif command == "off":
            gpio.output(led_pin, gpio.LOW)
            print("LED is OFF")
        elif command == "exit":
            print("Exiting program...")
            break
        else:
            print("Invalid command.")

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\`

---

## R3. User-Controlled LED Blinker

Ask the user how many times to blink.

\`\`\`python
import RPi.GPIO as gpio
import time

led_pin = 21

gpio.setmode(gpio.BCM)
gpio.setup(led_pin, gpio.OUT)

try:
    blinks = int(input("Enter number of blinks: "))

    for i in range(blinks):
        gpio.output(led_pin, gpio.HIGH)
        print(f"Blink {i+1}: LED is ON")
        time.sleep(1)

        gpio.output(led_pin, gpio.LOW)
        print(f"Blink {i+1}: LED is OFF")
        time.sleep(1)

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\``,
        quiz: [
          { question: "What does gpio.setmode(gpio.BCM) do?", options: ["Sets the pin numbering to Broadcom SOC channel", "Sets the pin numbering to physical board numbers", "Enables all GPIO pins", "Resets the GPIO state"], correctIndex: 0 },
          { question: "What signal level turns an LED ON?", options: ["gpio.LOW", "gpio.HIGH", "gpio.PWM", "gpio.INPUT"], correctIndex: 1 },
          { question: "Why do we call gpio.cleanup() at the end?", options: ["To save power", "To reset all GPIO pins to a safe state", "To turn off the Raspberry Pi", "To update firmware"], correctIndex: 1 },
        ],
      },
      {
        id: "rpi25-02",
        title: "LED Projects (R4–R5)",
        duration: "25 min",
        content: `# LED Projects — Math Quiz & Guess the Number

## R4. Interactive LED Math Quiz

Use a green LED for correct answers and a red LED for wrong answers.

### Components
- Raspberry Pi
- Green LED (correct) + Red LED (wrong)
- Breadboard & jumper wires

### Code

\`\`\`python
import RPi.GPIO as gpio
import time
import random

green_led = 21
red_led = 16

gpio.setmode(gpio.BCM)
gpio.setup(green_led, gpio.OUT)
gpio.setup(red_led, gpio.OUT)

def generate_question():
    num1 = random.randint(1, 10)
    num2 = random.randint(1, 10)
    return num1, num2, num1 * num2

try:
    while True:
        num1, num2, correct_answer = generate_question()
        user_answer = int(input(f"What is {num1} * {num2}?: "))

        if user_answer == correct_answer:
            gpio.output(green_led, gpio.HIGH)
            gpio.output(red_led, gpio.LOW)
            print("Correct! Green LED is ON.")
        else:
            gpio.output(green_led, gpio.LOW)
            gpio.output(red_led, gpio.HIGH)
            print(f"Wrong! The correct answer is {correct_answer}.")

        time.sleep(2)
        gpio.output(green_led, gpio.LOW)
        gpio.output(red_led, gpio.LOW)

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\`

---

## R5. Guess the Number with LED Feedback

Three LEDs indicate: green = correct, yellow = too low, red = too high.

\`\`\`python
import RPi.GPIO as gpio
import time
import random

green_led = 21
yellow_led = 16
red_led = 12

gpio.setmode(gpio.BCM)
gpio.setup(green_led, gpio.OUT)
gpio.setup(yellow_led, gpio.OUT)
gpio.setup(red_led, gpio.OUT)

target_number = random.randint(1, 10)
guess_count = 0

try:
    while True:
        user_guess = int(input("Guess a number between 1 and 10: "))
        guess_count += 1

        if user_guess == target_number:
            gpio.output(green_led, gpio.HIGH)
            gpio.output(yellow_led, gpio.LOW)
            gpio.output(red_led, gpio.LOW)
            print(f"Correct! You took {guess_count} guess(es).")
            time.sleep(2)
            break
        elif user_guess < target_number:
            gpio.output(yellow_led, gpio.HIGH)
            print("Too low! Yellow LED is ON.")
        else:
            gpio.output(red_led, gpio.HIGH)
            print("Too high! Red LED is ON.")

        time.sleep(2)
        gpio.output(green_led, gpio.LOW)
        gpio.output(yellow_led, gpio.LOW)
        gpio.output(red_led, gpio.LOW)

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\``,
        quiz: [
          { question: "What Python module generates random numbers?", options: ["math", "random", "os", "sys"], correctIndex: 1 },
          { question: "In the math quiz project, what happens when the answer is correct?", options: ["Red LED turns on", "Both LEDs turn on", "Green LED turns on", "Buzzer sounds"], correctIndex: 2 },
        ],
      },
      {
        id: "rpi25-03",
        title: "Traffic Light & RGB LEDs (R6–R8)",
        duration: "30 min",
        content: `# Traffic Light & RGB LEDs

## R6. Traffic Light Simulation

Cycle through green → yellow → red like a real traffic light.

\`\`\`python
import RPi.GPIO as gpio
import time

green_led = 21
yellow_led = 16
red_led = 12

gpio.setmode(gpio.BCM)
gpio.setup(red_led, gpio.OUT)
gpio.setup(yellow_led, gpio.OUT)
gpio.setup(green_led, gpio.OUT)

try:
    while True:
        gpio.output(green_led, gpio.HIGH)
        print("Green Light - GO")
        time.sleep(5)

        gpio.output(green_led, gpio.LOW)
        gpio.output(yellow_led, gpio.HIGH)
        print("Yellow Light - SLOW DOWN")
        time.sleep(2)

        gpio.output(yellow_led, gpio.LOW)
        gpio.output(red_led, gpio.HIGH)
        print("Red Light - STOP")
        time.sleep(5)

        gpio.output(red_led, gpio.LOW)

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\`

---

## R7. RGB LED Colors

Cycle through 7 colors using a single RGB LED.

### Components
- RGB LED (Common Cathode)
- Breadboard & jumper wires

\`\`\`python
import RPi.GPIO as gpio
import time

red_pin = 21
green_pin = 20
blue_pin = 16

gpio.setmode(gpio.BCM)
gpio.setup(red_pin, gpio.OUT)
gpio.setup(green_pin, gpio.OUT)
gpio.setup(blue_pin, gpio.OUT)

try:
    while True:
        # Red
        gpio.output(red_pin, gpio.HIGH)
        gpio.output(green_pin, gpio.LOW)
        gpio.output(blue_pin, gpio.LOW)
        print("Red"); time.sleep(1)

        # Green
        gpio.output(red_pin, gpio.LOW)
        gpio.output(green_pin, gpio.HIGH)
        print("Green"); time.sleep(1)

        # Blue
        gpio.output(green_pin, gpio.LOW)
        gpio.output(blue_pin, gpio.HIGH)
        print("Blue"); time.sleep(1)

        # Yellow (R+G)
        gpio.output(red_pin, gpio.HIGH)
        gpio.output(green_pin, gpio.HIGH)
        gpio.output(blue_pin, gpio.LOW)
        print("Yellow"); time.sleep(1)

        # Magenta (R+B)
        gpio.output(green_pin, gpio.LOW)
        gpio.output(blue_pin, gpio.HIGH)
        print("Magenta"); time.sleep(1)

        # Cyan (G+B)
        gpio.output(red_pin, gpio.LOW)
        gpio.output(green_pin, gpio.HIGH)
        print("Cyan"); time.sleep(1)

        # White (R+G+B)
        gpio.output(red_pin, gpio.HIGH)
        print("White"); time.sleep(1)

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\`

---

## R8. User Input-Controlled RGB LED

Let the user choose colors by typing letters.

\`\`\`python
import RPi.GPIO as gpio

red_pin = 21
green_pin = 20
blue_pin = 16

gpio.setmode(gpio.BCM)
gpio.setup(red_pin, gpio.OUT)
gpio.setup(green_pin, gpio.OUT)
gpio.setup(blue_pin, gpio.OUT)

colors = {
    "r": (1,0,0), "g": (0,1,0), "b": (0,0,1),
    "y": (1,1,0), "m": (1,0,1), "c": (0,1,1), "w": (1,1,1)
}

try:
    while True:
        user_input = input("Enter color (r,g,b,y,m,c,w): ").lower()
        if user_input in colors:
            r, g, b = colors[user_input]
            gpio.output(red_pin, r)
            gpio.output(green_pin, g)
            gpio.output(blue_pin, b)
        else:
            print("Invalid input!")

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\``,
        quiz: [
          { question: "How do you create yellow with an RGB LED?", options: ["Red + Blue", "Red + Green", "Green + Blue", "All three colors"], correctIndex: 1 },
          { question: "In a Common Cathode RGB LED, the common pin connects to:", options: ["5V", "3.3V", "GND", "GPIO pin"], correctIndex: 2 },
          { question: "What is the traffic light sequence?", options: ["Red → Green → Yellow", "Green → Yellow → Red", "Yellow → Red → Green", "Green → Red → Yellow"], correctIndex: 1 },
        ],
      },
      {
        id: "rpi25-04",
        title: "Buttons & Interactions (R9–R12)",
        duration: "30 min",
        content: `# Buttons & Interactions

## R9. Button-Controlled LED

LED turns on while the button is pressed.

\`\`\`python
import RPi.GPIO as gpio
import time

led_pin = 21
button_pin = 16

gpio.setmode(gpio.BCM)
gpio.setup(led_pin, gpio.OUT)
gpio.setup(button_pin, gpio.IN, pull_up_down=gpio.PUD_UP)

try:
    while True:
        if gpio.input(button_pin) == 0:
            gpio.output(led_pin, gpio.HIGH)
            print("Button Pressed - LED ON")
        else:
            gpio.output(led_pin, gpio.LOW)
            print("Button Released - LED OFF")
        time.sleep(0.1)

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\`

### Key Concept: Pull-Up Resistor
\`pull_up_down=gpio.PUD_UP\` enables an internal pull-up resistor. The button reads HIGH when not pressed and LOW when pressed.

---

## R10. Dual-Button LED Control

One button turns the LED ON, another turns it OFF.

\`\`\`python
import RPi.GPIO as gpio
import time

led_pin = 21
button_on = 16
button_off = 12

gpio.setmode(gpio.BCM)
gpio.setup(led_pin, gpio.OUT)
gpio.setup(button_on, gpio.IN, pull_up_down=gpio.PUD_UP)
gpio.setup(button_off, gpio.IN, pull_up_down=gpio.PUD_UP)

try:
    while True:
        if gpio.input(button_on) == gpio.LOW:
            gpio.output(led_pin, gpio.HIGH)
            print("ON Button Pressed")

        if gpio.input(button_off) == gpio.LOW:
            gpio.output(led_pin, gpio.LOW)
            print("OFF Button Pressed")

        time.sleep(0.1)

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\`

---

## R11. LED Toggle Switch

Each button press toggles the LED state.

\`\`\`python
import RPi.GPIO as gpio
import time

led_pin = 21
button_pin = 16

gpio.setmode(gpio.BCM)
gpio.setup(button_pin, gpio.IN, pull_up_down=gpio.PUD_UP)
gpio.setup(led_pin, gpio.OUT)

led_state = False

try:
    while True:
        if gpio.input(button_pin) == 0:
            time.sleep(0.1)  # Debounce
            while gpio.input(button_pin) == 0:
                pass
            led_state = not led_state
            gpio.output(led_pin, led_state)
            print("LED ON" if led_state else "LED OFF")

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\`

---

## R12. RGB LED Color Switcher

Each button press generates a random RGB color.

\`\`\`python
import RPi.GPIO as gpio
import time
import random

red_pin = 21
green_pin = 20
blue_pin = 16
button_pin = 12

gpio.setmode(gpio.BCM)
gpio.setup(red_pin, gpio.OUT)
gpio.setup(green_pin, gpio.OUT)
gpio.setup(blue_pin, gpio.OUT)
gpio.setup(button_pin, gpio.IN, pull_up_down=gpio.PUD_UP)

try:
    while True:
        if gpio.input(button_pin) == 0:
            time.sleep(0.1)
            while gpio.input(button_pin) == 0:
                pass
            gpio.output(red_pin, random.randint(0, 1))
            gpio.output(green_pin, random.randint(0, 1))
            gpio.output(blue_pin, random.randint(0, 1))

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\``,
        quiz: [
          { question: "What does a pull-up resistor do?", options: ["Keeps the pin HIGH when the button is not pressed", "Keeps the pin LOW when the button is not pressed", "Increases voltage", "Controls motor speed"], correctIndex: 0 },
          { question: "What is 'debouncing'?", options: ["Speeding up the button", "A small delay to avoid false triggers from mechanical bounce", "Resetting the GPIO", "Changing pin mode"], correctIndex: 1 },
          { question: "In toggle mode, how is state tracked?", options: ["Using a counter", "Using a boolean variable that flips each press", "Using a timer", "Using an interrupt"], correctIndex: 1 },
        ],
      },
      {
        id: "rpi25-05",
        title: "Buzzer, GUI & Bluetooth (R13–R18)",
        duration: "40 min",
        content: `# Buzzer, GUI & Bluetooth Control

## R13. Raspberry Pi Buzzer Piano

4 buttons play different musical notes through a buzzer using PWM.

\`\`\`python
import RPi.GPIO as gpio
import time

buzzer_pin = 21
button_pins = [26, 19, 13, 6]
notes = [262, 294, 330, 349]  # C, D, E, F

gpio.setmode(gpio.BCM)
gpio.setup(buzzer_pin, gpio.OUT)
gpio.setup(button_pins, gpio.IN, pull_up_down=gpio.PUD_UP)

buzzer = gpio.PWM(buzzer_pin, 1)

try:
    while True:
        for i, button in enumerate(button_pins):
            if gpio.input(button) == 0:
                buzzer.ChangeFrequency(notes[i])
                buzzer.start(50)
                print(f"Playing Note {notes[i]} Hz")
                time.sleep(0.2)
                buzzer.stop()

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\`

---

## R14. GUI Button-Controlled LED (Tkinter)

Control an LED with a graphical interface.

\`\`\`python
import RPi.GPIO as gpio
import tkinter as tk

led_pin = 21
gpio.setmode(gpio.BCM)
gpio.setup(led_pin, gpio.OUT)

def led_on():
    gpio.output(led_pin, gpio.HIGH)
    label.config(text="LED is ON")

def led_off():
    gpio.output(led_pin, gpio.LOW)
    label.config(text="LED is OFF")

window = tk.Tk()
window.title("LED Controller")
window.geometry("500x300")

button_on = tk.Button(window, text="LED ON", bg="#b4dd1e",
                      font=("Arial", 15), command=led_on)
button_on.pack(pady=20)

button_off = tk.Button(window, text="LED OFF", bg="#ff4444",
                       font=("Arial", 15), command=led_off)
button_off.pack(pady=20)

label = tk.Label(window, text="LED is OFF", font=("Arial", 13))
label.pack(pady=10)

window.mainloop()
\`\`\`

---

## R15. GUI Widgets-Controlled LED

Advanced GUI with buttons, radio buttons, entry box, and brightness slider.

Uses PWM for brightness control:

\`\`\`python
pwm = gpio.PWM(led_pin, 1000)  # 1000 Hz
pwm.start(0)

def set_brightness(val):
    pwm.ChangeDutyCycle(int(val))
\`\`\`

---

## R16. BlueDot App-Controlled LED

Control LED wirelessly via Bluetooth using the BlueDot app.

\`\`\`python
import RPi.GPIO as gpio
from bluedot import BlueDot
from signal import pause

led_pin = 21
gpio.setmode(gpio.BCM)
gpio.setup(led_pin, gpio.OUT)

bd = BlueDot()

def led_on():
    gpio.output(led_pin, gpio.HIGH)

def led_off():
    gpio.output(led_pin, gpio.LOW)

bd.when_pressed = led_on
bd.when_released = led_off

pause()
\`\`\`

---

## R17–R18. BlueDot Multi-Button & RGB Control

Create multi-button Bluetooth interfaces for ON/OFF and color selection using \`BlueDot(cols=4, rows=2)\`.`,
        quiz: [
          { question: "What does PWM stand for?", options: ["Power Width Mode", "Pulse Width Modulation", "Pin Write Method", "Periodic Wave Monitor"], correctIndex: 1 },
          { question: "What Python library creates GUI windows on Raspberry Pi?", options: ["flask", "tkinter", "pygame", "bluedot"], correctIndex: 1 },
          { question: "How does BlueDot communicate with the Raspberry Pi?", options: ["WiFi", "USB", "Bluetooth", "IR remote"], correctIndex: 2 },
        ],
      },
      {
        id: "rpi25-06",
        title: "IoT & Sensors (R19–R24)",
        duration: "40 min",
        content: `# IoT & Sensors

## R19. IoT LED Control Using Blynk App

Control an LED from anywhere in the world using the Blynk IoT platform.

\`\`\`python
import RPi.GPIO as gpio
from BlynkLib import Blynk
import time

BLYNK_AUTH = "YOUR_TOKEN_HERE"
led_pin = 21

gpio.setmode(gpio.BCM)
gpio.setup(led_pin, gpio.OUT)

blynk = Blynk(BLYNK_AUTH)

@blynk.on("V0")
def control_led(value):
    if int(value[0]) == 1:
        gpio.output(led_pin, gpio.HIGH)
    else:
        gpio.output(led_pin, gpio.LOW)

while True:
    blynk.run()
    time.sleep(0.1)
\`\`\`

---

## R20. IoT RGB LED Control Using Blynk

Use a Blynk menu widget to select colors remotely.

---

## R21. Automatic Street Light Using LDR

An LDR (Light Dependent Resistor) detects darkness and automatically turns on an LED.

\`\`\`python
import RPi.GPIO as gpio
import time

ldr_pin = 21
led_pin = 20

gpio.setmode(gpio.BCM)
gpio.setup(ldr_pin, gpio.IN)
gpio.setup(led_pin, gpio.OUT)

try:
    while True:
        if gpio.input(ldr_pin) == 1:  # Dark
            gpio.output(led_pin, gpio.HIGH)
            print("Dark detected - LED ON")
        else:
            gpio.output(led_pin, gpio.LOW)
            print("Light detected - LED OFF")
        time.sleep(1)

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\`

---

## R22. Morning Wake-Up Alarm Using LDR

When the LDR detects morning light, a buzzer alarm sounds. Press a button to stop it.

---

## R23. PIR Motion Sensor-Activated LED

\`\`\`python
import RPi.GPIO as gpio
import time

pir_pin = 21
led_pin = 20

gpio.setmode(gpio.BCM)
gpio.setup(pir_pin, gpio.IN)
gpio.setup(led_pin, gpio.OUT)

try:
    while True:
        if gpio.input(pir_pin) == 1:
            gpio.output(led_pin, gpio.HIGH)
            print("Motion Detected - LED ON")
        else:
            gpio.output(led_pin, gpio.LOW)
            print("No Motion - LED OFF")
        time.sleep(0.5)

except KeyboardInterrupt:
    gpio.cleanup()
\`\`\`

---

## R24. Intruder Detection & Alarm System

Combines PIR sensor + red/green LEDs + buzzer + button to create a full security system.

- PIR detects motion → red LED + buzzer ON
- Button press → stops alarm, returns to safe mode (green LED)`,
        quiz: [
          { question: "What does LDR stand for?", options: ["Light Dependent Resistor", "Low Data Rate", "Linear Digital Receiver", "LED Driver Relay"], correctIndex: 0 },
          { question: "What type of sensor detects motion?", options: ["LDR", "PIR", "LM35", "Potentiometer"], correctIndex: 1 },
          { question: "What does the Blynk platform enable?", options: ["Local-only control", "IoT control from anywhere via the internet", "Direct USB control", "Bluetooth control"], correctIndex: 1 },
        ],
      },
      {
        id: "rpi25-07",
        title: "DC Motors & Robot Car (R25–R31)",
        duration: "45 min",
        content: `# DC Motors & Robot Car

## R25. Button-Controlled DC Motor

Control motor direction with 3 buttons: forward, backward, stop.

\`\`\`python
import time
import RPi.GPIO as gpio
from Raspi_MotorHAT import Raspi_MotorHAT

mh = Raspi_MotorHAT(addr=0x6f)
motor = mh.getMotor(3)
motor.setSpeed(150)

forward_button = 21
backward_button = 16
stop_button = 12

gpio.setmode(gpio.BCM)
gpio.setup(forward_button, gpio.IN, pull_up_down=gpio.PUD_UP)
gpio.setup(backward_button, gpio.IN, pull_up_down=gpio.PUD_UP)
gpio.setup(stop_button, gpio.IN, pull_up_down=gpio.PUD_UP)

try:
    while True:
        if gpio.input(forward_button) == 0:
            motor.run(Raspi_MotorHAT.FORWARD)
        elif gpio.input(backward_button) == 0:
            motor.run(Raspi_MotorHAT.BACKWARD)
        elif gpio.input(stop_button) == 0:
            motor.run(Raspi_MotorHAT.RELEASE)
        time.sleep(0.1)

except KeyboardInterrupt:
    motor.run(Raspi_MotorHAT.RELEASE)
    gpio.cleanup()
\`\`\`

---

## R26. Keyboard-Controlled DC Motor

Use arrow keys to control the motor using \`pynput\` library.

---

## R27. BlueDot App-Controlled DC Motor

Swipe up/down on BlueDot to control motor direction via Bluetooth.

---

## R28. Robot Car Assembly & Movements

### 4-Motor Robot Car Setup

\`\`\`python
from Raspi_MotorHAT import Raspi_MotorHAT
import time

mh = Raspi_MotorHAT(addr=0x6f)

rightFront = mh.getMotor(1)
rightBack = mh.getMotor(2)
leftFront = mh.getMotor(3)
leftBack = mh.getMotor(4)

speed = 150
for m in [rightFront, rightBack, leftFront, leftBack]:
    m.setSpeed(speed)

def move_forward():
    for m in [rightFront, rightBack, leftFront, leftBack]:
        m.run(Raspi_MotorHAT.FORWARD)

def move_backward():
    for m in [rightFront, rightBack, leftFront, leftBack]:
        m.run(Raspi_MotorHAT.BACKWARD)

def turn_left():
    rightFront.run(Raspi_MotorHAT.BACKWARD)
    rightBack.run(Raspi_MotorHAT.BACKWARD)
    leftFront.run(Raspi_MotorHAT.FORWARD)
    leftBack.run(Raspi_MotorHAT.FORWARD)

def turn_right():
    rightFront.run(Raspi_MotorHAT.FORWARD)
    rightBack.run(Raspi_MotorHAT.FORWARD)
    leftFront.run(Raspi_MotorHAT.BACKWARD)
    leftBack.run(Raspi_MotorHAT.BACKWARD)

def stop_motors():
    for m in [rightFront, rightBack, leftFront, leftBack]:
        m.run(Raspi_MotorHAT.RELEASE)
\`\`\`

---

## R29. User Input-Controlled Robot
Use w/a/s/d/x keyboard commands to drive the robot.

## R30. Keyboard-Controlled Robot
Use arrow keys with \`pynput\` for real-time control.

## R31. GUI Button-Controlled Robot
Tkinter GUI with directional buttons + keyboard bindings for driving.`,
        quiz: [
          { question: "What does the Raspi_MotorHAT library control?", options: ["LEDs", "DC Motors via an I2C HAT", "Servos", "Buzzers"], correctIndex: 1 },
          { question: "How does a 4-wheel robot turn left?", options: ["All wheels go left", "Right wheels forward, left wheels backward", "All wheels stop", "Only left wheels move"], correctIndex: 1 },
          { question: "What does motor.run(Raspi_MotorHAT.RELEASE) do?", options: ["Runs the motor forward", "Runs the motor backward", "Stops the motor", "Sets the motor speed"], correctIndex: 2 },
        ],
      },
      {
        id: "rpi25-08",
        title: "IoT Robot & Advanced Projects (R32–R38)",
        duration: "45 min",
        content: `# IoT Robot & Advanced Projects

## R32. BlueDot App-Controlled Robot

Drive your robot car wirelessly using Bluetooth.

\`\`\`python
from bluedot import BlueDot
from Raspi_MotorHAT import Raspi_MotorHAT

mh = Raspi_MotorHAT(addr=0x6f)
# ... setup 4 motors ...

bd = BlueDot()

def on_press(pos):
    if pos.top:
        move_forward()
    elif pos.bottom:
        move_backward()
    elif pos.left:
        turn_left()
    elif pos.right:
        turn_right()

def on_release(pos):
    stop_motors()

bd.when_pressed = on_press
bd.when_released = on_release
\`\`\`

---

## R33. IoT Robot Control Using Blynk App

Control the robot from anywhere using Blynk virtual pins (V1–V5).

Each virtual pin maps to a direction: Forward, Backward, Left, Right, Stop.

---

## R34. Light-Following Robot

Uses two LDR sensors to follow a light source.

\`\`\`python
import RPi.GPIO as GPIO
from Raspi_MotorHAT import Raspi_MotorHAT

GPIO.setmode(GPIO.BCM)
left_sensor = 17
right_sensor = 18
GPIO.setup(left_sensor, GPIO.IN)
GPIO.setup(right_sensor, GPIO.IN)

while True:
    left = GPIO.input(left_sensor)
    right = GPIO.input(right_sensor)

    if left == 0 and right == 0:
        move_forward()    # Both detect light
    elif left == 0:
        turn_left()       # Light on left
    elif right == 0:
        turn_right()      # Light on right
    else:
        stop_motors()     # No light
\`\`\`

---

## R35. Displaying Names on LCD

\`\`\`python
from RPLCD.i2c import CharLCD

lcd = CharLCD(i2c_expander='PCF8574', address=0x27,
              port=1, cols=16, rows=2, backlight_enabled=True)

lcd.cursor_pos = (0, 0)
lcd.write_string("Raspberry Pi")
lcd.cursor_pos = (1, 0)
lcd.write_string("Robotics")
\`\`\`

---

## R36. User Input-Controlled LCD Display

Accept user input and display it on the 16x2 LCD screen.

## R37. Countdown Timer on LCD

Display a countdown from 10 to 0, then beep the buzzer 3 times.

## R38. Scrolling GUI Input Text on LCD

Scroll long user-entered text across the LCD display.`,
        quiz: [
          { question: "How does the light-following robot decide direction?", options: ["Using ultrasonic sensors", "Using two LDR sensors comparing left and right light levels", "Using GPS", "Using a compass"], correctIndex: 1 },
          { question: "What communication protocol does the I2C LCD use?", options: ["SPI", "UART", "I2C", "Bluetooth"], correctIndex: 2 },
          { question: "What is the main advantage of Blynk over BlueDot?", options: ["Faster response", "Control from anywhere via internet, not just Bluetooth range", "Better graphics", "More buttons"], correctIndex: 1 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // ARDUINO ROBOTICS 2025
  // ═══════════════════════════════════════════════════════
  {
    id: "arduino-robotics",
    title: "Arduino Robotics 2025",
    path: "Robotics",
    level: "Beginner",
    description: "Complete Arduino robotics course — from LED blinking to autonomous obstacle-avoiding robots.",
    prerequisites: [],
    lessons: [
      {
        id: "ar-01", title: "Arduino IDE & Board Setup", duration: "15 min",
        content: `# Arduino IDE & Board Setup

## Installing the Arduino IDE
1. Download from [arduino.cc](https://www.arduino.cc/en/software)
2. Install and open the IDE
3. Go to **Tools → Board → Arduino Uno**
4. Go to **Tools → Port** and select your USB port

## Your First Sketch

\`\`\`cpp
void setup() {
  Serial.begin(9600);
  Serial.println("Hello Arduino!");
}

void loop() {
  // Runs repeatedly forever
}
\`\`\`

## Understanding the Board
- **Digital Pins (0-13)**: HIGH/LOW signals
- **Analog Pins (A0-A5)**: Read 0-1023 values
- **PWM Pins (~3,5,6,9,10,11)**: Simulate analog output
- **5V / 3.3V / GND**: Power pins`,
        quiz: [
          { question: "What function runs once when the Arduino powers on?", options: ["loop()", "setup()", "main()", "init()"], correctIndex: 1 },
          { question: "What range do analog pins read?", options: ["0-255", "0-1023", "0-100", "0-5"], correctIndex: 1 },
        ],
      },
      {
        id: "ar-02", title: "LEDs, Buttons & Digital I/O", duration: "20 min",
        content: `# LEDs, Buttons & Digital I/O

## Blinking an LED

\`\`\`cpp
#define LED_PIN 13

void setup() { pinMode(LED_PIN, OUTPUT); }

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(500);
  digitalWrite(LED_PIN, LOW);
  delay(500);
}
\`\`\`

## Reading a Button

\`\`\`cpp
#define BUTTON_PIN 2
#define LED_PIN 13

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  if (digitalRead(BUTTON_PIN) == LOW) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}
\`\`\`

## Traffic Light Project

\`\`\`cpp
int pins[] = {4, 3, 2};
int durations[] = {3000, 1000, 3000};

void setup() {
  for (int i = 0; i < 3; i++) pinMode(pins[i], OUTPUT);
}

void loop() {
  for (int i = 0; i < 3; i++) {
    digitalWrite(pins[i], HIGH);
    delay(durations[i]);
    digitalWrite(pins[i], LOW);
  }
}
\`\`\``,
        quiz: [
          { question: "What does INPUT_PULLUP do?", options: ["Enables an internal pull-up resistor", "Sets pin as output", "Increases voltage", "Enables PWM"], correctIndex: 0 },
          { question: "What does digitalWrite(pin, HIGH) do?", options: ["Reads the pin value", "Sets the pin to 5V", "Sets the pin to 0V", "Toggles the pin"], correctIndex: 1 },
        ],
      },
      {
        id: "ar-03", title: "Analog Sensors & PWM", duration: "25 min",
        content: `# Analog Sensors & PWM

## Reading a Potentiometer

\`\`\`cpp
#define POT_PIN A0
#define LED_PIN 9

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int val = analogRead(POT_PIN);
  int brightness = map(val, 0, 1023, 0, 255);
  analogWrite(LED_PIN, brightness);
  delay(50);
}
\`\`\`

## Temperature Sensor (TMP36)

\`\`\`cpp
void loop() {
  int raw = analogRead(A1);
  float voltage = raw * (5.0 / 1023.0);
  float tempC = (voltage - 0.5) * 100.0;
  Serial.print("Temp: ");
  Serial.println(tempC);
  delay(1000);
}
\`\`\``,
        quiz: [
          { question: "What does analogWrite() use to simulate analog output?", options: ["DAC", "PWM", "ADC", "SPI"], correctIndex: 1 },
          { question: "What does map(val, 0, 1023, 0, 255) do?", options: ["Converts digital to analog", "Scales a value from one range to another", "Maps GPIO pins", "Creates a lookup table"], correctIndex: 1 },
        ],
      },
      {
        id: "ar-04", title: "Servo & DC Motors", duration: "25 min",
        content: `# Servo & DC Motors

## Servo Motor Control

\`\`\`cpp
#include <Servo.h>
Servo myServo;

void setup() { myServo.attach(9); }

void loop() {
  for (int angle = 0; angle <= 180; angle++) {
    myServo.write(angle);
    delay(15);
  }
  for (int angle = 180; angle >= 0; angle--) {
    myServo.write(angle);
    delay(15);
  }
}
\`\`\`

## DC Motor Control with L298N

\`\`\`cpp
#define ENA 10
#define IN1 8
#define IN2 9

void forward(int speed) {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, speed);
}

void stopMotors() {
  analogWrite(ENA, 0);
}
\`\`\``,
        quiz: [
          { question: "What is a servo motor's range of rotation?", options: ["0-90°", "0-180°", "0-360°", "0-270°"], correctIndex: 1 },
          { question: "What does the L298N motor driver control?", options: ["Servo motors", "Stepper motors", "DC motor speed and direction", "LED brightness"], correctIndex: 2 },
        ],
      },
      {
        id: "ar-05", title: "Ultrasonic Sensor & Distance", duration: "20 min",
        content: `# Ultrasonic Sensor (HC-SR04)

## How It Works
1. Send a 10μs pulse on TRIG
2. Measure echo duration on ECHO
3. Distance = duration × 0.034 / 2

\`\`\`cpp
#define TRIG 7
#define ECHO 6

float getDistance() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long duration = pulseIn(ECHO, HIGH);
  return duration * 0.034 / 2.0;
}

void loop() {
  float dist = getDistance();
  Serial.print("Distance: ");
  Serial.print(dist);
  Serial.println(" cm");
  delay(200);
}
\`\`\``,
        quiz: [
          { question: "What does the HC-SR04 measure?", options: ["Temperature", "Light level", "Distance using ultrasonic waves", "Humidity"], correctIndex: 2 },
          { question: "How is distance calculated from echo duration?", options: ["duration × 0.034 / 2", "duration × speed_of_light", "duration / 1000", "duration × 2"], correctIndex: 0 },
        ],
      },
      {
        id: "ar-06", title: "Obstacle-Avoiding Robot", duration: "35 min",
        content: `# Building an Obstacle-Avoiding Robot

## Components
- Arduino Uno, L298N, 2 DC motors
- HC-SR04 ultrasonic sensor + servo
- Chassis, wheels, battery pack

## Algorithm
1. Drive forward while no obstacle within 25 cm
2. When blocked, stop and look left (180°) and right (0°)
3. Turn toward direction with more clearance
4. Resume driving

\`\`\`cpp
#include <Servo.h>

Servo sweepServo;

void loop() {
  float dist = getDistance();

  if (dist > 25) {
    forward(180);
  } else {
    stopMotors();
    delay(200);

    float leftDist = lookDirection(180);
    float rightDist = lookDirection(0);
    sweepServo.write(90);

    if (rightDist > leftDist) {
      turnRight(180);
    } else {
      turnLeft(180);
    }
    delay(500);
    stopMotors();
  }
}
\`\`\``,
        quiz: [
          { question: "Why does the robot use a servo with the ultrasonic sensor?", options: ["To power the sensor", "To sweep and look left/right for obstacles", "To mount the battery", "To control motor speed"], correctIndex: 1 },
          { question: "What threshold distance triggers obstacle avoidance?", options: ["50 cm", "25 cm", "10 cm", "100 cm"], correctIndex: 1 },
        ],
      },
      {
        id: "ar-07", title: "IR Remote & Bluetooth Control", duration: "25 min",
        content: `# IR Remote & Bluetooth Control

## IR Remote Control

\`\`\`cpp
#include <IRremote.h>

void loop() {
  if (IrReceiver.decode()) {
    unsigned long code = IrReceiver.decodedIRData.decodedRawData;
    switch (code) {
      case 0xE718FF00: forward(200); break;
      case 0xAD52FF00: backward(200); break;
      case 0xF708FF00: turnLeft(150); break;
      case 0xA55AFF00: turnRight(150); break;
      case 0xE31CFF00: stopMotors(); break;
    }
    IrReceiver.resume();
  }
}
\`\`\`

## Bluetooth with HC-05

\`\`\`cpp
#include <SoftwareSerial.h>
SoftwareSerial BT(2, 3);

void loop() {
  if (BT.available()) {
    char cmd = BT.read();
    switch (cmd) {
      case 'F': forward(200); break;
      case 'B': backward(200); break;
      case 'L': turnLeft(150); break;
      case 'R': turnRight(150); break;
      case 'S': stopMotors(); break;
    }
  }
}
\`\`\``,
        quiz: [
          { question: "What module is used for Bluetooth serial communication on Arduino?", options: ["ESP32", "HC-05", "NRF24L01", "ADS1115"], correctIndex: 1 },
          { question: "What does IrReceiver.resume() do?", options: ["Stops the receiver", "Prepares to receive the next IR signal", "Sends an IR signal", "Resets the Arduino"], correctIndex: 1 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // OPENCV COMPUTER VISION 2025
  // ═══════════════════════════════════════════════════════
  {
    id: "opencv-2025",
    title: "OpenCV Computer Vision 2025",
    path: "AI",
    level: "Intermediate",
    description: "Master computer vision with OpenCV & Python — image processing, face detection, object tracking & more.",
    prerequisites: [],
    lessons: [
      {
        id: "cv-01", title: "OpenCV Setup & Image Basics", duration: "20 min",
        content: `# OpenCV Setup & Image Basics

## Installation

\`\`\`bash
pip install opencv-python numpy
\`\`\`

## Loading & Displaying Images

\`\`\`python
import cv2

img = cv2.imread("photo.jpg")
print(f"Shape: {img.shape}")  # (height, width, channels)

cv2.imshow("Image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()
\`\`\`

## Color Spaces

\`\`\`python
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
\`\`\`

## Drawing on Images

\`\`\`python
cv2.rectangle(img, (50,50), (200,200), (0,255,0), 2)
cv2.circle(img, (300,300), 50, (0,0,255), -1)
cv2.putText(img, "Hello", (100,100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2)
\`\`\``,
        quiz: [
          { question: "What color format does OpenCV use by default?", options: ["RGB", "BGR", "HSV", "CMYK"], correctIndex: 1 },
          { question: "What does img.shape return?", options: ["(width, height)", "(height, width, channels)", "(channels, height, width)", "(width, height, depth)"], correctIndex: 1 },
        ],
      },
      {
        id: "cv-02", title: "Image Filtering & Transformations", duration: "25 min",
        content: `# Image Filtering & Transformations

## Blur & Smoothing

\`\`\`python
blurred = cv2.GaussianBlur(img, (5, 5), 0)
median = cv2.medianBlur(img, 5)
\`\`\`

## Edge Detection

\`\`\`python
edges = cv2.Canny(gray, 100, 200)
\`\`\`

## Thresholding

\`\`\`python
_, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
adaptive = cv2.adaptiveThreshold(gray, 255,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
\`\`\`

## Resizing & Rotation

\`\`\`python
resized = cv2.resize(img, (400, 300))

(h, w) = img.shape[:2]
M = cv2.getRotationMatrix2D((w//2, h//2), 45, 1.0)
rotated = cv2.warpAffine(img, M, (w, h))
\`\`\``,
        quiz: [
          { question: "What algorithm does cv2.Canny() implement?", options: ["Blur filter", "Edge detection", "Face detection", "Color conversion"], correctIndex: 1 },
          { question: "What does thresholding do?", options: ["Blurs the image", "Converts image to binary (black/white)", "Detects edges", "Resizes the image"], correctIndex: 1 },
        ],
      },
      {
        id: "cv-03", title: "Face Detection with Haar Cascades", duration: "25 min",
        content: `# Face Detection

## Using Haar Cascades

\`\`\`python
import cv2

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x,y), (x+w, y+h), (0,255,0), 2)

    cv2.imshow("Face Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
\`\`\``,
        quiz: [
          { question: "What are Haar Cascades?", options: ["Neural networks", "Pre-trained classifiers for object detection", "Image filters", "Color palettes"], correctIndex: 1 },
          { question: "What does cv2.VideoCapture(0) do?", options: ["Opens a file", "Opens the default webcam", "Takes a screenshot", "Records audio"], correctIndex: 1 },
        ],
      },
      {
        id: "cv-04", title: "Color Detection & Object Tracking", duration: "30 min",
        content: `# Color Detection & Object Tracking

## HSV Color Filtering

\`\`\`python
import cv2
import numpy as np

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # Track blue objects
    lower_blue = np.array([100, 150, 50])
    upper_blue = np.array([130, 255, 255])

    mask = cv2.inRange(hsv, lower_blue, upper_blue)
    result = cv2.bitwise_and(frame, frame, mask=mask)

    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > 500:
            x, y, w, h = cv2.boundingRect(cnt)
            cv2.rectangle(frame, (x,y), (x+w,y+h), (0,255,0), 2)

    cv2.imshow("Tracking", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
\`\`\``,
        quiz: [
          { question: "Why convert to HSV for color detection?", options: ["It's faster", "HSV separates color (hue) from brightness, making detection more robust", "It uses less memory", "It's required by OpenCV"], correctIndex: 1 },
          { question: "What does cv2.inRange() return?", options: ["A blurred image", "A binary mask of pixels within the specified range", "An edge map", "A histogram"], correctIndex: 1 },
        ],
      },
      {
        id: "cv-05", title: "Contours & Shape Detection", duration: "25 min",
        content: `# Contours & Shape Detection

## Finding and Drawing Contours

\`\`\`python
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

cv2.drawContours(img, contours, -1, (0, 255, 0), 2)
\`\`\`

## Shape Recognition

\`\`\`python
for cnt in contours:
    approx = cv2.approxPolyDP(cnt, 0.04 * cv2.arcLength(cnt, True), True)
    x, y, w, h = cv2.boundingRect(approx)

    if len(approx) == 3:
        shape = "Triangle"
    elif len(approx) == 4:
        shape = "Rectangle"
    else:
        shape = "Circle"

    cv2.putText(img, shape, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,0,0), 2)
\`\`\``,
        quiz: [
          { question: "How does approxPolyDP determine a shape?", options: ["By color", "By approximating the contour to a polygon and counting vertices", "By area calculation", "By edge detection"], correctIndex: 1 },
          { question: "A contour with 3 vertices is classified as:", options: ["Circle", "Rectangle", "Triangle", "Pentagon"], correctIndex: 2 },
        ],
      },
      {
        id: "cv-06", title: "Motion Detection & Background Subtraction", duration: "25 min",
        content: `# Motion Detection

## Background Subtraction

\`\`\`python
import cv2

cap = cv2.VideoCapture(0)
fgbg = cv2.createBackgroundSubtractorMOG2()

while True:
    ret, frame = cap.read()
    mask = fgbg.apply(frame)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for cnt in contours:
        if cv2.contourArea(cnt) > 1000:
            x, y, w, h = cv2.boundingRect(cnt)
            cv2.rectangle(frame, (x,y), (x+w,y+h), (0,0,255), 2)
            cv2.putText(frame, "Motion!", (x,y-10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,255), 2)

    cv2.imshow("Motion Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
\`\`\`

## Applications
- Security camera systems
- People counting
- Traffic monitoring
- Gesture recognition`,
        quiz: [
          { question: "What does a background subtractor do?", options: ["Removes the background color", "Learns the static background and highlights moving objects", "Blurs the background", "Converts to grayscale"], correctIndex: 1 },
          { question: "Why filter contours by area (>1000)?", options: ["To detect only large objects", "To ignore noise and small artifacts", "To speed up processing", "To detect colors"], correctIndex: 1 },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // PYGAME GAME DEVELOPMENT 2025
  // ═══════════════════════════════════════════════════════
  {
    id: "pygame-2025",
    title: "PyGame Game Development 2025",
    path: "Programming",
    level: "Beginner",
    description: "Learn game development with Python & PyGame — sprites, physics, sound, and complete game projects.",
    prerequisites: [],
    lessons: [
      {
        id: "pg-01", title: "PyGame Setup & Game Loop", duration: "20 min",
        content: `# PyGame Setup & Game Loop

## Installation

\`\`\`bash
pip install pygame
\`\`\`

## Basic Game Window

\`\`\`python
import pygame
import sys

pygame.init()

WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("My First Game")
clock = pygame.time.Clock()

# Game loop
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill((30, 30, 30))  # Dark background

    pygame.display.flip()
    clock.tick(60)  # 60 FPS

pygame.quit()
sys.exit()
\`\`\`

## Key Concepts
- **pygame.init()** — Initialize all modules
- **Event loop** — Handle user input (keyboard, mouse, quit)
- **screen.fill()** — Clear the screen each frame
- **pygame.display.flip()** — Update the display
- **clock.tick(60)** — Cap at 60 frames per second`,
        quiz: [
          { question: "What does clock.tick(60) do?", options: ["Waits 60 seconds", "Limits the game to 60 frames per second", "Creates 60 sprites", "Sets window size to 60px"], correctIndex: 1 },
          { question: "What is the purpose of the event loop?", options: ["Drawing graphics", "Playing sound", "Handling user input and system events", "Loading images"], correctIndex: 2 },
        ],
      },
      {
        id: "pg-02", title: "Drawing Shapes & Moving Objects", duration: "25 min",
        content: `# Drawing Shapes & Moving Objects

## Drawing Primitives

\`\`\`python
# Rectangle
pygame.draw.rect(screen, (255, 0, 0), (100, 100, 50, 50))

# Circle
pygame.draw.circle(screen, (0, 255, 0), (400, 300), 30)

# Line
pygame.draw.line(screen, (0, 0, 255), (0, 0), (800, 600), 3)
\`\`\`

## Moving a Player

\`\`\`python
player_x, player_y = 400, 300
speed = 5

while running:
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        player_x -= speed
    if keys[pygame.K_RIGHT]:
        player_x += speed
    if keys[pygame.K_UP]:
        player_y -= speed
    if keys[pygame.K_DOWN]:
        player_y += speed

    screen.fill((30, 30, 30))
    pygame.draw.rect(screen, (0, 200, 255), (player_x, player_y, 40, 40))
    pygame.display.flip()
    clock.tick(60)
\`\`\``,
        quiz: [
          { question: "How do you detect if a key is currently held down?", options: ["pygame.event.get()", "pygame.key.get_pressed()", "pygame.mouse.get_pos()", "pygame.K_DOWN"], correctIndex: 1 },
          { question: "What coordinate system does PyGame use?", options: ["(0,0) at center", "(0,0) at top-left", "(0,0) at bottom-left", "(0,0) at bottom-right"], correctIndex: 1 },
        ],
      },
      {
        id: "pg-03", title: "Sprites & Images", duration: "25 min",
        content: `# Sprites & Images

## Loading and Displaying Images

\`\`\`python
player_img = pygame.image.load("player.png").convert_alpha()
player_img = pygame.transform.scale(player_img, (50, 50))

screen.blit(player_img, (player_x, player_y))
\`\`\`

## Sprite Classes

\`\`\`python
class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((40, 40))
        self.image.fill((0, 200, 255))
        self.rect = self.image.get_rect(center=(400, 300))
        self.speed = 5

    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]: self.rect.x -= self.speed
        if keys[pygame.K_RIGHT]: self.rect.x += self.speed
        if keys[pygame.K_UP]: self.rect.y -= self.speed
        if keys[pygame.K_DOWN]: self.rect.y += self.speed

all_sprites = pygame.sprite.Group()
player = Player()
all_sprites.add(player)

# In game loop:
all_sprites.update()
all_sprites.draw(screen)
\`\`\``,
        quiz: [
          { question: "What does convert_alpha() do when loading images?", options: ["Converts to grayscale", "Optimizes the image format and preserves transparency", "Resizes the image", "Adds a border"], correctIndex: 1 },
          { question: "What is a Sprite Group used for?", options: ["Drawing backgrounds", "Managing and updating multiple sprites together", "Playing sounds", "Handling input"], correctIndex: 1 },
        ],
      },
      {
        id: "pg-04", title: "Collision Detection", duration: "25 min",
        content: `# Collision Detection

## Rect-Based Collision

\`\`\`python
if player.rect.colliderect(enemy.rect):
    print("Collision!")
\`\`\`

## Sprite Group Collision

\`\`\`python
hits = pygame.sprite.spritecollide(player, enemies, True)
for hit in hits:
    score += 10
\`\`\`

## Pixel-Perfect Collision

\`\`\`python
if pygame.sprite.collide_mask(player, enemy):
    print("Pixel-perfect collision!")
\`\`\`

## Keeping Player In Bounds

\`\`\`python
def update(self):
    # ... movement code ...
    self.rect.clamp_ip(screen.get_rect())
\`\`\``,
        quiz: [
          { question: "What does spritecollide(player, enemies, True) do when True?", options: ["Detects collision only", "Detects collision and removes the colliding sprites from the group", "Ignores collision", "Creates new sprites"], correctIndex: 1 },
          { question: "What is pixel-perfect collision?", options: ["Checking if rectangles overlap", "Checking actual pixel overlap using masks", "Checking distance between centers", "Using physics simulation"], correctIndex: 1 },
        ],
      },
      {
        id: "pg-05", title: "Sound, Text & Scoring", duration: "20 min",
        content: `# Sound, Text & Scoring

## Playing Sounds

\`\`\`python
pygame.mixer.init()
shoot_sound = pygame.mixer.Sound("shoot.wav")
shoot_sound.play()

# Background music
pygame.mixer.music.load("bgm.mp3")
pygame.mixer.music.play(-1)  # Loop forever
\`\`\`

## Displaying Text

\`\`\`python
font = pygame.font.Font(None, 36)

def draw_text(text, x, y, color=(255, 255, 255)):
    surface = font.render(text, True, color)
    screen.blit(surface, (x, y))

# In game loop:
draw_text(f"Score: {score}", 10, 10)
draw_text(f"Lives: {lives}", 10, 50, (255, 100, 100))
\`\`\``,
        quiz: [
          { question: "What does pygame.mixer.music.play(-1) do?", options: ["Plays once", "Loops the music forever", "Stops the music", "Plays backwards"], correctIndex: 1 },
          { question: "What does font.render() return?", options: ["A string", "A Surface with the rendered text", "A Rect", "An integer"], correctIndex: 1 },
        ],
      },
      {
        id: "pg-06", title: "Building a Complete Game", duration: "35 min",
        content: `# Building a Complete Game — Space Shooter

## Game Structure

\`\`\`python
import pygame
import random

# Initialize
pygame.init()
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((50, 40))
        self.image.fill((0, 200, 255))
        self.rect = self.image.get_rect(midbottom=(WIDTH//2, HEIGHT-20))
        self.speed = 6

    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]: self.rect.x -= self.speed
        if keys[pygame.K_RIGHT]: self.rect.x += self.speed
        self.rect.clamp_ip(screen.get_rect())

class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((4, 10))
        self.image.fill((255, 255, 0))
        self.rect = self.image.get_rect(center=(x, y))

    def update(self):
        self.rect.y -= 8
        if self.rect.bottom < 0:
            self.kill()

class Enemy(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((40, 30))
        self.image.fill((255, 50, 50))
        self.rect = self.image.get_rect(
            center=(random.randint(20, WIDTH-20), -20)
        )
        self.speed = random.randint(2, 5)

    def update(self):
        self.rect.y += self.speed
        if self.rect.top > HEIGHT:
            self.kill()

# Game loop with scoring, shooting, and collision
score = 0
player = Player()
all_sprites = pygame.sprite.Group(player)
bullets = pygame.sprite.Group()
enemies = pygame.sprite.Group()

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                b = Bullet(player.rect.centerx, player.rect.top)
                all_sprites.add(b)
                bullets.add(b)

    # Spawn enemies
    if random.random() < 0.02:
        e = Enemy()
        all_sprites.add(e)
        enemies.add(e)

    all_sprites.update()

    # Check collisions
    hits = pygame.sprite.groupcollide(bullets, enemies, True, True)
    score += len(hits) * 10

    screen.fill((10, 10, 30))
    all_sprites.draw(screen)
    pygame.display.flip()
    clock.tick(60)
\`\`\``,
        quiz: [
          { question: "What does self.kill() do in a Sprite?", options: ["Exits the game", "Removes the sprite from all groups", "Destroys the window", "Stops the game loop"], correctIndex: 1 },
          { question: "How are enemies spawned randomly each frame?", options: ["Using a timer", "Using random.random() < probability threshold", "Using keyboard input", "Using a fixed counter"], correctIndex: 1 },
        ],
      },
    ],
  },
];

export interface SkillPath {
  id: string;
  name: string;
  color: string;
  courses: string[];
}

export const skillPaths: SkillPath[] = [
  { id: "robotics", name: "Robotics Path", color: "hsl(180, 70%, 50%)", courses: ["rpi-robotics-2025", "arduino-robotics"] },
  { id: "vision", name: "AI & Vision Path", color: "hsl(265, 83%, 57%)", courses: ["opencv-2025"] },
  { id: "programming", name: "Programming Path", color: "hsl(45, 90%, 55%)", courses: ["pygame-2025"] },
];
