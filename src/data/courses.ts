export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
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
  {
    id: "iot-101", title: "IoT Fundamentals", path: "IoT", level: "Beginner",
    description: "Learn the basics of Internet of Things — connecting sensors to the cloud.",
    prerequisites: [],
    lessons: [
      { id: "iot-101-1", title: "What is IoT?", duration: "15 min", content: "# What is IoT?\n\nThe Internet of Things (IoT) refers to the network of physical devices embedded with sensors, software, and connectivity to exchange data.\n\n## Key Concepts\n- **Sensors** collect data from the physical world\n- **Microcontrollers** process the data locally\n- **Connectivity** sends data to the cloud (WiFi, BLE, LoRa)\n- **Cloud platforms** store and analyze data\n\n## Example\n```cpp\n// Read temperature from DHT11\n#include <DHT.h>\nDHT dht(2, DHT11);\n\nvoid setup() {\n  Serial.begin(9600);\n  dht.begin();\n}\n\nvoid loop() {\n  float temp = dht.readTemperature();\n  Serial.println(temp);\n  delay(2000);\n}\n```" },
      { id: "iot-101-2", title: "Your First Arduino Circuit", duration: "20 min", content: "# Your First Arduino Circuit\n\nLet's blink an LED — the \"Hello World\" of hardware.\n\n## What You Need\n- Arduino Uno\n- 1x LED\n- 1x 220Ω Resistor\n- Breadboard + jumper wires\n\n## Wiring\n1. Connect LED **anode (+)** to pin 13 via the resistor\n2. Connect LED **cathode (-)** to GND\n\n## Code\n```cpp\nvoid setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n  digitalWrite(13, LOW);\n  delay(1000);\n}\n```" },
      { id: "iot-101-3", title: "Reading Sensor Data", duration: "25 min", content: "# Reading Sensor Data\n\nLearn to read analog and digital sensors.\n\n## Analog vs Digital\n- **Digital**: HIGH (1) or LOW (0) — e.g., pushbutton\n- **Analog**: 0-1023 range — e.g., potentiometer, LDR\n\n```cpp\nint sensorValue = analogRead(A0);\nfloat voltage = sensorValue * (5.0 / 1023.0);\nSerial.println(voltage);\n```" },
    ],
  },
  {
    id: "iot-201", title: "WiFi & Cloud Integration", path: "IoT", level: "Intermediate",
    description: "Connect your ESP32 to WiFi and send data to cloud dashboards.",
    prerequisites: ["iot-101"],
    lessons: [
      { id: "iot-201-1", title: "ESP32 WiFi Setup", duration: "20 min", content: "# ESP32 WiFi Setup\n\n```cpp\n#include <WiFi.h>\n\nconst char* ssid = \"YourNetwork\";\nconst char* password = \"YourPassword\";\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.begin(ssid, password);\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(500);\n    Serial.print(\".\");\n  }\n  Serial.println(\"Connected!\");\n  Serial.println(WiFi.localIP());\n}\n```" },
      { id: "iot-201-2", title: "HTTP Requests", duration: "25 min", content: "# Making HTTP Requests\n\nSend sensor data to a REST API.\n\n```cpp\n#include <HTTPClient.h>\n\nvoid sendData(float temp) {\n  HTTPClient http;\n  http.begin(\"https://api.example.com/data\");\n  http.addHeader(\"Content-Type\", \"application/json\");\n  String payload = \"{\\\"temperature\\\":\" + String(temp) + \"}\";\n  int code = http.POST(payload);\n  http.end();\n}\n```" },
    ],
  },
  {
    id: "robot-101", title: "Robotics Basics", path: "Robotics", level: "Beginner",
    description: "Build your first robot — motor control, sensors, and basic navigation.",
    prerequisites: [],
    lessons: [
      { id: "robot-101-1", title: "DC Motor Control", duration: "20 min", content: "# DC Motor Control with L298N\n\n## Wiring\n- **IN1/IN2**: Direction control\n- **ENA**: Speed control (PWM)\n\n```cpp\n#define IN1 8\n#define IN2 9\n#define ENA 10\n\nvoid setup() {\n  pinMode(IN1, OUTPUT);\n  pinMode(IN2, OUTPUT);\n  pinMode(ENA, OUTPUT);\n}\n\nvoid forward(int speed) {\n  digitalWrite(IN1, HIGH);\n  digitalWrite(IN2, LOW);\n  analogWrite(ENA, speed);\n}\n```" },
      { id: "robot-101-2", title: "Servo Control", duration: "15 min", content: "# Servo Motor Control\n\n```cpp\n#include <Servo.h>\nServo myServo;\n\nvoid setup() {\n  myServo.attach(9);\n}\n\nvoid loop() {\n  for (int angle = 0; angle <= 180; angle++) {\n    myServo.write(angle);\n    delay(15);\n  }\n}\n```" },
      { id: "robot-101-3", title: "Obstacle Avoidance", duration: "30 min", content: "# Obstacle Avoidance with HC-SR04\n\n```cpp\n#define TRIG 7\n#define ECHO 6\n\nlong readDistance() {\n  digitalWrite(TRIG, LOW);\n  delayMicroseconds(2);\n  digitalWrite(TRIG, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(TRIG, LOW);\n  long duration = pulseIn(ECHO, HIGH);\n  return duration * 0.034 / 2; // cm\n}\n\nvoid loop() {\n  long dist = readDistance();\n  if (dist < 20) {\n    // Turn or stop\n  } else {\n    // Go forward\n  }\n}\n```" },
    ],
  },
  {
    id: "ai-101", title: "AI for Embedded Systems", path: "AI", level: "Beginner",
    description: "Introduction to machine learning on microcontrollers (TinyML).",
    prerequisites: [],
    lessons: [
      { id: "ai-101-1", title: "What is TinyML?", duration: "15 min", content: "# What is TinyML?\n\nTinyML brings machine learning to microcontrollers.\n\n## Why TinyML?\n- **Low power**: Runs on batteries\n- **Low latency**: No cloud round-trip\n- **Privacy**: Data stays on device\n\n## Frameworks\n- TensorFlow Lite for Microcontrollers\n- Edge Impulse\n- Arduino ML" },
      { id: "ai-101-2", title: "Gesture Recognition", duration: "30 min", content: "# Gesture Recognition with MPU6050\n\nUse accelerometer data to classify hand gestures.\n\n## Steps\n1. Collect training data (wave, punch, idle)\n2. Train a model with Edge Impulse\n3. Deploy to Arduino Nano 33 BLE\n\n```cpp\n// Pseudocode\nfloat features[FEATURE_SIZE];\ncollect_imu_data(features);\nint gesture = classify(features);\nif (gesture == WAVE) {\n  Serial.println(\"Wave detected!\");\n}\n```" },
    ],
  },
  {
    id: "robot-201", title: "Line-Following Robot", path: "Robotics", level: "Intermediate",
    description: "Build a robot that follows a black line using IR sensors and PID control.",
    prerequisites: ["robot-101"],
    lessons: [
      { id: "robot-201-1", title: "IR Sensor Array", duration: "20 min", content: "# IR Sensor Array\n\nUse 3-5 IR reflectance sensors to detect a black line on white surface.\n\n```cpp\nint sensors[5] = {A0, A1, A2, A3, A4};\n\nint readLine() {\n  int position = 0;\n  for (int i = 0; i < 5; i++) {\n    position += analogRead(sensors[i]) * i;\n  }\n  return position;\n}\n```" },
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
Every Arduino program has two functions:

\`\`\`cpp
void setup() {
  // Runs once when the board powers on
  Serial.begin(9600);
  Serial.println("Hello Arduino!");
}

void loop() {
  // Runs repeatedly forever
}
\`\`\`

## Uploading Code
1. Connect Arduino via USB
2. Click the **Upload** button (→ arrow)
3. Open **Serial Monitor** (magnifying glass icon) to see output

## Understanding the Board
- **Digital Pins (0-13)**: HIGH/LOW signals
- **Analog Pins (A0-A5)**: Read 0-1023 values
- **PWM Pins (~3,5,6,9,10,11)**: Simulate analog output
- **5V / 3.3V / GND**: Power pins`
      },
      {
        id: "ar-02", title: "LEDs, Buttons & Digital I/O", duration: "20 min",
        content: `# LEDs, Buttons & Digital I/O

## Blinking an LED

\`\`\`cpp
#define LED_PIN 13

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

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
  int state = digitalRead(BUTTON_PIN);
  // INPUT_PULLUP: LOW when pressed
  if (state == LOW) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}
\`\`\`

## Traffic Light Project
Wire 3 LEDs (red, yellow, green) and cycle through them:

\`\`\`cpp
int pins[] = {4, 3, 2}; // red, yellow, green
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
\`\`\``
      },
      {
        id: "ar-03", title: "Analog Sensors & PWM", duration: "25 min",
        content: `# Analog Sensors & PWM

## Reading a Potentiometer

\`\`\`cpp
#define POT_PIN A0
#define LED_PIN 9  // PWM pin

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int val = analogRead(POT_PIN);  // 0-1023
  int brightness = map(val, 0, 1023, 0, 255);
  analogWrite(LED_PIN, brightness);

  Serial.print("Pot: "); Serial.print(val);
  Serial.print(" → Brightness: "); Serial.println(brightness);
  delay(50);
}
\`\`\`

## Light Sensor (LDR)

\`\`\`cpp
#define LDR_PIN A0

void setup() { Serial.begin(9600); }

void loop() {
  int light = analogRead(LDR_PIN);
  Serial.print("Light level: ");
  Serial.println(light);
  // Dark: < 300, Bright: > 700
  delay(200);
}
\`\`\`

## Temperature Sensor (TMP36)

\`\`\`cpp
#define TEMP_PIN A1

void loop() {
  int raw = analogRead(TEMP_PIN);
  float voltage = raw * (5.0 / 1023.0);
  float tempC = (voltage - 0.5) * 100.0;
  Serial.print("Temperature: ");
  Serial.print(tempC);
  Serial.println(" °C");
  delay(1000);
}
\`\`\``
      },
      {
        id: "ar-04", title: "Servo Motors & Sweeping", duration: "20 min",
        content: `# Servo Motors & Sweeping

## What is a Servo?
A servo motor rotates to a precise angle (0–180°). It uses PWM signals for positioning.

## Basic Servo Control

\`\`\`cpp
#include <Servo.h>

Servo myServo;

void setup() {
  myServo.attach(9);  // Signal pin
}

void loop() {
  // Sweep from 0 to 180
  for (int angle = 0; angle <= 180; angle += 1) {
    myServo.write(angle);
    delay(15);
  }
  // Sweep back
  for (int angle = 180; angle >= 0; angle -= 1) {
    myServo.write(angle);
    delay(15);
  }
}
\`\`\`

## Potentiometer-Controlled Servo

\`\`\`cpp
#include <Servo.h>

Servo myServo;

void setup() {
  myServo.attach(9);
}

void loop() {
  int val = analogRead(A0);
  int angle = map(val, 0, 1023, 0, 180);
  myServo.write(angle);
  delay(15);
}
\`\`\`

## Multi-Servo Robot Arm
You can control multiple servos for a robotic arm:

\`\`\`cpp
Servo base, shoulder, elbow, gripper;

void setup() {
  base.attach(3);
  shoulder.attach(5);
  elbow.attach(6);
  gripper.attach(9);
}
\`\`\``
      },
      {
        id: "ar-05", title: "DC Motors & the L298N Driver", duration: "25 min",
        content: `# DC Motors & the L298N Driver

## L298N Motor Driver
The L298N controls 2 DC motors with direction and speed.

## Wiring
- **ENA** → PWM pin (speed for Motor A)
- **IN1, IN2** → Digital pins (direction for Motor A)
- **ENB** → PWM pin (speed for Motor B)
- **IN3, IN4** → Digital pins (direction for Motor B)

## Code

\`\`\`cpp
#define ENA 10
#define IN1 8
#define IN2 9
#define ENB 5
#define IN3 7
#define IN4 6

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
}

void forward(int speed) {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
  analogWrite(ENA, speed);
  analogWrite(ENB, speed);
}

void backward(int speed) {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
  analogWrite(ENA, speed);
  analogWrite(ENB, speed);
}

void turnLeft(int speed) {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
  analogWrite(ENA, speed);
  analogWrite(ENB, speed);
}

void stopMotors() {
  analogWrite(ENA, 0);
  analogWrite(ENB, 0);
}

void loop() {
  forward(200);
  delay(2000);
  turnLeft(150);
  delay(500);
  stopMotors();
  delay(1000);
}
\`\`\``
      },
      {
        id: "ar-06", title: "Ultrasonic Sensor & Distance", duration: "20 min",
        content: `# Ultrasonic Sensor (HC-SR04)

## How It Works
1. Send a 10μs pulse on TRIG
2. Measure the echo duration on ECHO
3. Convert to distance: distance = duration × 0.034 / 2

## Code

\`\`\`cpp
#define TRIG 7
#define ECHO 6

void setup() {
  Serial.begin(9600);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
}

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

  if (dist < 15) {
    Serial.println("⚠️ OBSTACLE DETECTED!");
  }
  delay(200);
}
\`\`\`

## Parking Sensor Project
Use a buzzer that beeps faster as objects get closer:

\`\`\`cpp
#define BUZZER 3

void loop() {
  float dist = getDistance();
  if (dist < 50) {
    int interval = map(dist, 5, 50, 50, 500);
    tone(BUZZER, 1000, 100);
    delay(interval);
  }
}
\`\`\``
      },
      {
        id: "ar-07", title: "Building an Obstacle-Avoiding Robot", duration: "35 min",
        content: `# Building an Obstacle-Avoiding Robot

## Components
- Arduino Uno
- L298N motor driver + 2 DC motors
- HC-SR04 ultrasonic sensor
- Servo motor (to sweep the sensor)
- Chassis, wheels, battery pack

## Full Code

\`\`\`cpp
#include <Servo.h>

// Motor pins
#define ENA 10
#define IN1 8
#define IN2 9
#define ENB 5
#define IN3 7
#define IN4 6

// Ultrasonic
#define TRIG 11
#define ECHO 12

Servo sweepServo;

float getDistance() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long dur = pulseIn(ECHO, HIGH, 20000);
  if (dur == 0) return 999;
  return dur * 0.034 / 2.0;
}

void forward(int spd) {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
  analogWrite(ENA, spd); analogWrite(ENB, spd);
}

void turnRight(int spd) {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
  analogWrite(ENA, spd); analogWrite(ENB, spd);
}

void turnLeft(int spd) {
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
  analogWrite(ENA, spd); analogWrite(ENB, spd);
}

void stopMotors() {
  analogWrite(ENA, 0); analogWrite(ENB, 0);
}

float lookDirection(int angle) {
  sweepServo.write(angle);
  delay(400);
  return getDistance();
}

void setup() {
  Serial.begin(9600);
  sweepServo.attach(3);
  sweepServo.write(90); // Center
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(ENB, OUTPUT); pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  delay(1000);
}

void loop() {
  float dist = getDistance();
  Serial.print("Front: "); Serial.println(dist);

  if (dist > 25) {
    forward(180);
  } else {
    stopMotors();
    delay(200);

    float leftDist = lookDirection(180);
    float rightDist = lookDirection(0);
    sweepServo.write(90);
    delay(200);

    Serial.print("L: "); Serial.print(leftDist);
    Serial.print(" R: "); Serial.println(rightDist);

    if (rightDist > leftDist) {
      turnRight(180);
    } else {
      turnLeft(180);
    }
    delay(500);
    stopMotors();
  }
}
\`\`\`

## How It Works
1. Drive forward while no obstacle within 25 cm
2. When blocked, stop and look left (180°) and right (0°)
3. Turn toward the direction with more clearance
4. Resume driving`
      },
      {
        id: "ar-08", title: "IR Remote & Bluetooth Control", duration: "25 min",
        content: `# IR Remote & Bluetooth Control

## IR Remote Control

\`\`\`cpp
#include <IRremote.h>

#define IR_PIN 4

void setup() {
  Serial.begin(9600);
  IrReceiver.begin(IR_PIN);
}

void loop() {
  if (IrReceiver.decode()) {
    unsigned long code = IrReceiver.decodedIRData.decodedRawData;
    Serial.println(code, HEX);

    switch (code) {
      case 0xE718FF00: forward(200); break;   // UP
      case 0xAD52FF00: backward(200); break;  // DOWN
      case 0xF708FF00: turnLeft(150); break;  // LEFT
      case 0xA55AFF00: turnRight(150); break; // RIGHT
      case 0xE31CFF00: stopMotors(); break;   // OK
    }
    IrReceiver.resume();
  }
}
\`\`\`

## Bluetooth Control with HC-05

\`\`\`cpp
#include <SoftwareSerial.h>

SoftwareSerial BT(2, 3); // RX, TX

void setup() {
  Serial.begin(9600);
  BT.begin(9600);
}

void loop() {
  if (BT.available()) {
    char cmd = BT.read();
    Serial.print("Received: "); Serial.println(cmd);

    switch (cmd) {
      case 'F': forward(200); break;
      case 'B': backward(200); break;
      case 'L': turnLeft(150); break;
      case 'R': turnRight(150); break;
      case 'S': stopMotors(); break;
    }
  }
}
\`\`\`

## Mobile App Control
Use a Bluetooth terminal app on your phone and send single characters (F, B, L, R, S) to control your robot wirelessly!`
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // RASPBERRY PI ROBOTICS 2025
  // ═══════════════════════════════════════════════════════
  {
    id: "rpi-robotics",
    title: "Raspberry Pi Robotics 2025",
    path: "Robotics",
    level: "Intermediate",
    description: "Build intelligent robots with Raspberry Pi — GPIO, camera, motor control, and computer vision.",
    prerequisites: ["robot-101"],
    lessons: [
      {
        id: "rpi-01", title: "Raspberry Pi Setup & GPIO Basics", duration: "20 min",
        content: `# Raspberry Pi Setup & GPIO Basics

## Setting Up Your Pi
1. Flash Raspberry Pi OS onto a microSD card using Raspberry Pi Imager
2. Insert card, connect keyboard, mouse, monitor
3. Boot and complete initial setup
4. Open a terminal and update:

\`\`\`bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3-gpiozero python3-pip -y
\`\`\`

## GPIO Pin Layout
The Raspberry Pi has 40 GPIO pins. Key pins:
- **3.3V / 5V** power pins
- **GND** ground pins
- **GPIO 2-27** programmable pins
- Some support **PWM, I2C, SPI, UART**

## Blink an LED with Python

\`\`\`python
from gpiozero import LED
from time import sleep

led = LED(17)  # GPIO 17

while True:
    led.on()
    sleep(1)
    led.off()
    sleep(1)
\`\`\`

## Reading a Button

\`\`\`python
from gpiozero import Button, LED

button = Button(2)
led = LED(17)

button.when_pressed = led.on
button.when_released = led.off

from signal import pause
pause()
\`\`\``
      },
      {
        id: "rpi-02", title: "Motor Control with Python", duration: "25 min",
        content: `# Motor Control with Python

## Using L298N with Raspberry Pi

\`\`\`python
from gpiozero import Motor
from time import sleep

# Motor(forward_pin, backward_pin)
motor_left = Motor(forward=17, backward=18)
motor_right = Motor(forward=22, backward=23)

def forward(speed=1):
    motor_left.forward(speed)
    motor_right.forward(speed)

def backward(speed=1):
    motor_left.backward(speed)
    motor_right.backward(speed)

def turn_left(speed=0.7):
    motor_left.backward(speed)
    motor_right.forward(speed)

def turn_right(speed=0.7):
    motor_left.forward(speed)
    motor_right.backward(speed)

def stop():
    motor_left.stop()
    motor_right.stop()

# Test drive
forward()
sleep(2)
turn_left()
sleep(0.5)
stop()
\`\`\`

## PWM Speed Control
The Motor class from gpiozero supports speed values 0.0–1.0:

\`\`\`python
motor_left.forward(0.5)  # 50% speed
motor_left.forward(1.0)  # Full speed
\`\`\``
      },
      {
        id: "rpi-03", title: "Ultrasonic & IR Sensors", duration: "20 min",
        content: `# Sensors on Raspberry Pi

## HC-SR04 Ultrasonic Sensor

\`\`\`python
from gpiozero import DistanceSensor
from time import sleep

sensor = DistanceSensor(echo=24, trigger=25)

while True:
    distance = sensor.distance * 100  # Convert to cm
    print(f"Distance: {distance:.1f} cm")
    if distance < 15:
        print("⚠️ Obstacle!")
    sleep(0.2)
\`\`\`

## IR Line Sensor

\`\`\`python
from gpiozero import LineSensor

left_sensor = LineSensor(5)
right_sensor = LineSensor(6)

def on_line():
    print("On line!")

def off_line():
    print("Off line!")

left_sensor.when_line = on_line
left_sensor.when_no_line = off_line

from signal import pause
pause()
\`\`\`

## Combining Sensors for Navigation

\`\`\`python
while True:
    dist = sensor.distance * 100
    if dist < 20:
        stop()
        sleep(0.3)
        turn_right(0.6)
        sleep(0.5)
    else:
        forward(0.7)
    sleep(0.1)
\`\`\``
      },
      {
        id: "rpi-04", title: "Camera Module & Image Capture", duration: "25 min",
        content: `# Camera Module & Image Capture

## Enable the Camera
\`\`\`bash
sudo raspi-config
# Interface Options → Camera → Enable
# Reboot
\`\`\`

## Capture Images with Python

\`\`\`python
from picamera2 import Picamera2
import time

camera = Picamera2()
config = camera.create_still_configuration()
camera.configure(config)
camera.start()
time.sleep(2)  # Warm up

camera.capture_file("photo.jpg")
print("Photo saved!")
camera.stop()
\`\`\`

## Live Video Preview

\`\`\`python
from picamera2 import Picamera2
import time

camera = Picamera2()
config = camera.create_preview_configuration()
camera.configure(config)
camera.start_preview(True)
camera.start()

time.sleep(30)  # Preview for 30 seconds
camera.stop()
\`\`\`

## Time-Lapse Photography

\`\`\`python
for i in range(100):
    camera.capture_file(f"timelapse_{i:04d}.jpg")
    time.sleep(60)  # Every minute
\`\`\``
      },
      {
        id: "rpi-05", title: "Web-Controlled Robot", duration: "30 min",
        content: `# Web-Controlled Robot

## Flask Web Server for Robot Control

\`\`\`python
from flask import Flask, render_template_string
from gpiozero import Motor

app = Flask(__name__)
motor_l = Motor(17, 18)
motor_r = Motor(22, 23)

HTML = """
<!DOCTYPE html>
<html><body style="text-align:center; font-family:sans-serif;">
<h1>🤖 Robot Control</h1>
<a href="/forward"><button style="font-size:24px;padding:20px;">⬆️ Forward</button></a><br><br>
<a href="/left"><button style="font-size:24px;padding:20px;">⬅️ Left</button></a>
<a href="/stop"><button style="font-size:24px;padding:20px;">🛑 Stop</button></a>
<a href="/right"><button style="font-size:24px;padding:20px;">➡️ Right</button></a><br><br>
<a href="/backward"><button style="font-size:24px;padding:20px;">⬇️ Backward</button></a>
</body></html>
"""

@app.route("/")
def index():
    return render_template_string(HTML)

@app.route("/forward")
def forward():
    motor_l.forward(); motor_r.forward()
    return render_template_string(HTML)

@app.route("/backward")
def backward():
    motor_l.backward(); motor_r.backward()
    return render_template_string(HTML)

@app.route("/left")
def left():
    motor_l.backward(); motor_r.forward()
    return render_template_string(HTML)

@app.route("/right")
def right():
    motor_l.forward(); motor_r.backward()
    return render_template_string(HTML)

@app.route("/stop")
def stop():
    motor_l.stop(); motor_r.stop()
    return render_template_string(HTML)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
\`\`\`

Access from any device on the same network: \`http://<pi-ip>:5000\``
      },
      {
        id: "rpi-06", title: "Autonomous Navigation Project", duration: "35 min",
        content: `# Autonomous Navigation Project

## Combining Everything

\`\`\`python
from gpiozero import Motor, DistanceSensor, Servo
from time import sleep

motor_l = Motor(17, 18)
motor_r = Motor(22, 23)
sensor = DistanceSensor(echo=24, trigger=25)
sweep_servo = Servo(12)

def forward(spd=0.7):
    motor_l.forward(spd)
    motor_r.forward(spd)

def stop():
    motor_l.stop()
    motor_r.stop()

def turn_left(dur=0.5):
    motor_l.backward(0.6)
    motor_r.forward(0.6)
    sleep(dur)

def turn_right(dur=0.5):
    motor_l.forward(0.6)
    motor_r.backward(0.6)
    sleep(dur)

def look(direction):
    if direction == "left":
        sweep_servo.min()
    elif direction == "right":
        sweep_servo.max()
    else:
        sweep_servo.mid()
    sleep(0.5)
    return sensor.distance * 100

try:
    while True:
        dist = sensor.distance * 100
        print(f"Front: {dist:.0f} cm")

        if dist > 25:
            forward()
        else:
            stop()
            sleep(0.2)
            left_dist = look("left")
            right_dist = look("right")
            look("center")

            print(f"L: {left_dist:.0f}  R: {right_dist:.0f}")

            if right_dist > left_dist:
                turn_right()
            else:
                turn_left()

        sleep(0.1)
except KeyboardInterrupt:
    stop()
    print("Robot stopped.")
\`\`\`

## Challenges
1. Add a line-following mode using IR sensors
2. Implement wall-following algorithm
3. Add camera-based object detection
4. Log navigation path to a CSV file`
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // OPENCV 2025
  // ═══════════════════════════════════════════════════════
  {
    id: "opencv-2025",
    title: "OpenCV Computer Vision 2025",
    path: "AI",
    level: "Intermediate",
    description: "Master computer vision with OpenCV — image processing, face detection, object tracking, and more.",
    prerequisites: [],
    lessons: [
      {
        id: "cv-01", title: "OpenCV Installation & Basics", duration: "15 min",
        content: `# OpenCV Installation & Basics

## Installing OpenCV

\`\`\`bash
pip install opencv-python opencv-python-headless numpy
\`\`\`

## Loading & Displaying Images

\`\`\`python
import cv2
import numpy as np

# Load an image
img = cv2.imread("photo.jpg")
print(f"Shape: {img.shape}")  # (height, width, channels)

# Display
cv2.imshow("Image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()

# Save
cv2.imwrite("output.jpg", img)
\`\`\`

## Color Spaces

\`\`\`python
# BGR to Grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# BGR to HSV (useful for color detection)
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# BGR to RGB (for matplotlib)
rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
\`\`\`

## Drawing on Images

\`\`\`python
# Line
cv2.line(img, (0, 0), (200, 200), (0, 255, 0), 2)

# Rectangle
cv2.rectangle(img, (50, 50), (200, 200), (255, 0, 0), 3)

# Circle
cv2.circle(img, (150, 150), 50, (0, 0, 255), -1)

# Text
cv2.putText(img, "Hello!", (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
\`\`\``
      },
      {
        id: "cv-02", title: "Image Processing & Filters", duration: "25 min",
        content: `# Image Processing & Filters

## Blurring

\`\`\`python
# Gaussian Blur
blurred = cv2.GaussianBlur(img, (15, 15), 0)

# Median Blur (good for salt & pepper noise)
median = cv2.medianBlur(img, 5)

# Bilateral Filter (preserves edges)
bilateral = cv2.bilateralFilter(img, 9, 75, 75)
\`\`\`

## Edge Detection

\`\`\`python
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Canny edge detector
edges = cv2.Canny(gray, 50, 150)

# Sobel operator
sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=5)
sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=5)
\`\`\`

## Thresholding

\`\`\`python
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Simple threshold
_, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

# Adaptive threshold
adaptive = cv2.adaptiveThreshold(gray, 255,
    cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

# Otsu's threshold
_, otsu = cv2.threshold(gray, 0, 255,
    cv2.THRESH_BINARY + cv2.THRESH_OTSU)
\`\`\`

## Morphological Operations

\`\`\`python
kernel = np.ones((5, 5), np.uint8)

# Remove noise
opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)

# Fill holes
closing = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

# Dilate and Erode
dilated = cv2.dilate(thresh, kernel, iterations=1)
eroded = cv2.erode(thresh, kernel, iterations=1)
\`\`\``
      },
      {
        id: "cv-03", title: "Face Detection with Haar Cascades", duration: "25 min",
        content: `# Face Detection with Haar Cascades

## Loading the Cascade

\`\`\`python
import cv2

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
eye_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_eye.xml"
)
\`\`\`

## Detecting Faces in an Image

\`\`\`python
img = cv2.imread("people.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

faces = face_cascade.detectMultiScale(
    gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
)

for (x, y, w, h) in faces:
    cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)

    # Detect eyes within face region
    roi_gray = gray[y:y+h, x:x+w]
    roi_color = img[y:y+h, x:x+w]
    eyes = eye_cascade.detectMultiScale(roi_gray)
    for (ex, ey, ew, eh) in eyes:
        cv2.circle(roi_color, (ex+ew//2, ey+eh//2), ew//2, (255, 0, 0), 2)

print(f"Found {len(faces)} face(s)")
cv2.imshow("Faces", img)
cv2.waitKey(0)
\`\`\`

## Real-Time Face Detection

\`\`\`python
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 5)

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

    cv2.imshow("Face Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
\`\`\``
      },
      {
        id: "cv-04", title: "Color Detection & Object Tracking", duration: "30 min",
        content: `# Color Detection & Object Tracking

## HSV Color Detection

\`\`\`python
import cv2
import numpy as np

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # Define range for blue color
    lower_blue = np.array([100, 50, 50])
    upper_blue = np.array([130, 255, 255])

    # Create mask
    mask = cv2.inRange(hsv, lower_blue, upper_blue)

    # Apply mask
    result = cv2.bitwise_and(frame, frame, mask=mask)

    cv2.imshow("Original", frame)
    cv2.imshow("Mask", mask)
    cv2.imshow("Result", result)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
\`\`\`

## Contour-Based Object Tracking

\`\`\`python
while True:
    ret, frame = cap.read()
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    mask = cv2.inRange(hsv, lower_blue, upper_blue)
    mask = cv2.erode(mask, None, iterations=2)
    mask = cv2.dilate(mask, None, iterations=2)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL,
                                     cv2.CHAIN_APPROX_SIMPLE)

    if contours:
        largest = max(contours, key=cv2.contourArea)
        if cv2.contourArea(largest) > 500:
            (x, y), radius = cv2.minEnclosingCircle(largest)
            M = cv2.moments(largest)
            center = (int(M["m10"]/M["m00"]), int(M["m01"]/M["m00"]))

            cv2.circle(frame, center, int(radius), (0, 255, 0), 2)
            cv2.circle(frame, center, 5, (0, 0, 255), -1)
            cv2.putText(frame, f"({center[0]}, {center[1]})",
                       (center[0]+10, center[1]-10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 1)

    cv2.imshow("Tracking", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
\`\`\``
      },
      {
        id: "cv-05", title: "Motion Detection & Background Subtraction", duration: "25 min",
        content: `# Motion Detection & Background Subtraction

## Simple Frame Differencing

\`\`\`python
import cv2

cap = cv2.VideoCapture(0)
ret, prev_frame = cap.read()
prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
prev_gray = cv2.GaussianBlur(prev_gray, (21, 21), 0)

while True:
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (21, 21), 0)

    diff = cv2.absdiff(prev_gray, gray)
    _, thresh = cv2.threshold(diff, 25, 255, cv2.THRESH_BINARY)
    thresh = cv2.dilate(thresh, None, iterations=2)

    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL,
                                     cv2.CHAIN_APPROX_SIMPLE)

    motion_detected = False
    for c in contours:
        if cv2.contourArea(c) > 1000:
            motion_detected = True
            (x, y, w, h) = cv2.boundingRect(c)
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

    status = "MOTION" if motion_detected else "Still"
    cv2.putText(frame, status, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    cv2.imshow("Motion Detection", frame)
    prev_gray = gray

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
\`\`\`

## Background Subtractor (MOG2)

\`\`\`python
cap = cv2.VideoCapture(0)
bg_subtractor = cv2.createBackgroundSubtractorMOG2(
    history=500, varThreshold=50
)

while True:
    ret, frame = cap.read()
    mask = bg_subtractor.apply(frame)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL,
                                     cv2.CHAIN_APPROX_SIMPLE)
    for c in contours:
        if cv2.contourArea(c) > 2000:
            (x, y, w, h) = cv2.boundingRect(c)
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

    cv2.imshow("BG Subtraction", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
\`\`\``
      },
      {
        id: "cv-06", title: "Hand Gesture Recognition", duration: "30 min",
        content: `# Hand Gesture Recognition

## Skin Color Detection + Contour Analysis

\`\`\`python
import cv2
import numpy as np

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)  # Mirror

    # Region of Interest
    roi = frame[50:350, 50:350]
    cv2.rectangle(frame, (50, 50), (350, 350), (0, 255, 0), 2)

    # Convert to HSV and detect skin color
    hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
    lower_skin = np.array([0, 20, 70])
    upper_skin = np.array([20, 255, 255])
    mask = cv2.inRange(hsv, lower_skin, upper_skin)

    # Clean up
    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.dilate(mask, kernel, iterations=4)
    mask = cv2.GaussianBlur(mask, (5, 5), 100)

    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_TREE,
                                     cv2.CHAIN_APPROX_SIMPLE)

    if contours:
        largest = max(contours, key=cv2.contourArea)
        hull = cv2.convexHull(largest, returnPoints=False)
        defects = cv2.convexityDefects(largest, hull)

        finger_count = 0
        if defects is not None:
            for i in range(defects.shape[0]):
                s, e, f, d = defects[i, 0]
                start = tuple(largest[s][0])
                end = tuple(largest[e][0])
                far = tuple(largest[f][0])
                
                # Calculate triangle sides
                a = np.sqrt((end[0]-start[0])**2 + (end[1]-start[1])**2)
                b = np.sqrt((far[0]-start[0])**2 + (far[1]-start[1])**2)
                c = np.sqrt((end[0]-far[0])**2 + (end[1]-far[1])**2)
                angle = np.arccos((b**2+c**2-a**2) / (2*b*c)) * 180/np.pi

                if angle <= 90:
                    finger_count += 1
                    cv2.circle(roi, far, 5, (0, 0, 255), -1)

        finger_count += 1  # Add thumb
        cv2.putText(frame, f"Fingers: {finger_count}", (50, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("Gesture", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
\`\`\``
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // PYGAME 2025
  // ═══════════════════════════════════════════════════════
  {
    id: "pygame-2025",
    title: "PyGame Game Development 2025",
    path: "Programming",
    level: "Beginner",
    description: "Learn game development with Python and PyGame — from basics to building complete games.",
    prerequisites: [],
    lessons: [
      {
        id: "pg-01", title: "PyGame Setup & Game Loop", duration: "20 min",
        content: `# PyGame Setup & Game Loop

## Installing PyGame

\`\`\`bash
pip install pygame
\`\`\`

## The Basic Game Loop

\`\`\`python
import pygame
import sys

# Initialize
pygame.init()

# Create window
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("My First Game")

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

# Clock for frame rate
clock = pygame.time.Clock()
FPS = 60

# Game loop
running = True
while running:
    # 1. Handle events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # 2. Update game state
    # (nothing yet)

    # 3. Draw
    screen.fill(BLACK)
    pygame.draw.rect(screen, RED, (350, 250, 100, 100))
    pygame.draw.circle(screen, BLUE, (400, 300), 50)

    # 4. Flip display
    pygame.display.flip()
    clock.tick(FPS)

pygame.quit()
sys.exit()
\`\`\`

## Key Concepts
- **pygame.init()** — initialize all modules
- **Event loop** — handle input (keyboard, mouse, quit)
- **screen.fill()** — clear the screen each frame
- **pygame.display.flip()** — update the display
- **clock.tick(FPS)** — cap frame rate`
      },
      {
        id: "pg-02", title: "Movement & Keyboard Input", duration: "20 min",
        content: `# Movement & Keyboard Input

## Moving a Player Rectangle

\`\`\`python
import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

# Player
player_x, player_y = 375, 275
player_w, player_h = 50, 50
speed = 5

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Continuous key press
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT] or keys[pygame.K_a]:
        player_x -= speed
    if keys[pygame.K_RIGHT] or keys[pygame.K_d]:
        player_x += speed
    if keys[pygame.K_UP] or keys[pygame.K_w]:
        player_y -= speed
    if keys[pygame.K_DOWN] or keys[pygame.K_s]:
        player_y += speed

    # Keep player on screen
    player_x = max(0, min(800 - player_w, player_x))
    player_y = max(0, min(600 - player_h, player_y))

    # Draw
    screen.fill((20, 20, 30))
    pygame.draw.rect(screen, (0, 200, 255),
                     (player_x, player_y, player_w, player_h))

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
\`\`\`

## Using pygame.Rect for Collision

\`\`\`python
player = pygame.Rect(375, 275, 50, 50)

# Move with Rect
player.x += speed

# Clamp to screen
player.clamp_ip(screen.get_rect())

# Draw
pygame.draw.rect(screen, (0, 200, 255), player)
\`\`\``
      },
      {
        id: "pg-03", title: "Sprites & Images", duration: "25 min",
        content: `# Sprites & Images

## Loading Images

\`\`\`python
# Load image
player_img = pygame.image.load("player.png").convert_alpha()

# Scale image
player_img = pygame.transform.scale(player_img, (64, 64))

# Rotate image
rotated = pygame.transform.rotate(player_img, 45)

# Draw image (blit)
screen.blit(player_img, (player_x, player_y))
\`\`\`

## Using the Sprite Class

\`\`\`python
class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((50, 50))
        self.image.fill((0, 200, 255))
        self.rect = self.image.get_rect(center=(400, 300))
        self.speed = 5

    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]: self.rect.x -= self.speed
        if keys[pygame.K_RIGHT]: self.rect.x += self.speed
        if keys[pygame.K_UP]: self.rect.y -= self.speed
        if keys[pygame.K_DOWN]: self.rect.y += self.speed
        self.rect.clamp_ip(screen.get_rect())

class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((40, 40))
        self.image.fill((255, 50, 50))
        self.rect = self.image.get_rect(center=(x, y))

# Create groups
all_sprites = pygame.sprite.Group()
enemies = pygame.sprite.Group()

player = Player()
all_sprites.add(player)

for i in range(5):
    e = Enemy(100 + i * 120, 100)
    all_sprites.add(e)
    enemies.add(e)

# In game loop:
all_sprites.update()
all_sprites.draw(screen)

# Check collisions
hits = pygame.sprite.spritecollide(player, enemies, True)
for hit in hits:
    print("Enemy destroyed!")
\`\`\``
      },
      {
        id: "pg-04", title: "Collision Detection & Physics", duration: "25 min",
        content: `# Collision Detection & Physics

## Rectangle Collision

\`\`\`python
player = pygame.Rect(100, 100, 50, 50)
obstacle = pygame.Rect(300, 200, 100, 100)

if player.colliderect(obstacle):
    print("Collision!")
\`\`\`

## Simple Gravity & Jumping

\`\`\`python
import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((800, 600))
clock = pygame.time.Clock()

# Player with physics
player = pygame.Rect(100, 400, 40, 60)
vel_y = 0
gravity = 0.8
jump_power = -15
on_ground = False

# Platforms
platforms = [
    pygame.Rect(0, 500, 800, 100),
    pygame.Rect(200, 400, 150, 20),
    pygame.Rect(450, 320, 150, 20),
]

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE and on_ground:
                vel_y = jump_power
                on_ground = False

    # Horizontal movement
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]: player.x -= 5
    if keys[pygame.K_RIGHT]: player.x += 5

    # Apply gravity
    vel_y += gravity
    player.y += vel_y

    # Platform collision
    on_ground = False
    for plat in platforms:
        if player.colliderect(plat) and vel_y > 0:
            player.bottom = plat.top
            vel_y = 0
            on_ground = True

    # Draw
    screen.fill((30, 30, 50))
    pygame.draw.rect(screen, (0, 200, 255), player)
    for plat in platforms:
        pygame.draw.rect(screen, (100, 100, 100), plat)

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
\`\`\``
      },
      {
        id: "pg-05", title: "Sound, Text & UI", duration: "20 min",
        content: `# Sound, Text & UI

## Playing Sounds

\`\`\`python
pygame.mixer.init()

# Background music
pygame.mixer.music.load("bgm.mp3")
pygame.mixer.music.set_volume(0.5)
pygame.mixer.music.play(-1)  # Loop forever

# Sound effects
jump_sound = pygame.mixer.Sound("jump.wav")
coin_sound = pygame.mixer.Sound("coin.wav")

# Play a sound effect
jump_sound.play()
\`\`\`

## Rendering Text

\`\`\`python
font = pygame.font.Font(None, 48)  # Default font, size 48
small_font = pygame.font.Font(None, 24)

# Render text (text, antialias, color)
score = 0
score_text = font.render(f"Score: {score}", True, (255, 255, 255))
screen.blit(score_text, (10, 10))
\`\`\`

## Game Over Screen

\`\`\`python
def show_game_over(screen, score):
    overlay = pygame.Surface((800, 600))
    overlay.set_alpha(180)
    overlay.fill((0, 0, 0))
    screen.blit(overlay, (0, 0))

    big_font = pygame.font.Font(None, 72)
    title = big_font.render("GAME OVER", True, (255, 50, 50))
    screen.blit(title, (800//2 - title.get_width()//2, 200))

    score_text = font.render(f"Final Score: {score}", True, (255, 255, 255))
    screen.blit(score_text, (800//2 - score_text.get_width()//2, 300))

    hint = small_font.render("Press R to restart", True, (180, 180, 180))
    screen.blit(hint, (800//2 - hint.get_width()//2, 400))

    pygame.display.flip()
\`\`\`

## Health Bar

\`\`\`python
def draw_health_bar(screen, x, y, health, max_health):
    bar_width = 200
    bar_height = 20
    fill = (health / max_health) * bar_width

    # Background
    pygame.draw.rect(screen, (60, 60, 60), (x, y, bar_width, bar_height))
    # Fill
    color = (0, 200, 0) if health > 50 else (255, 200, 0) if health > 25 else (255, 0, 0)
    pygame.draw.rect(screen, color, (x, y, fill, bar_height))
    # Border
    pygame.draw.rect(screen, (255, 255, 255), (x, y, bar_width, bar_height), 2)
\`\`\``
      },
      {
        id: "pg-06", title: "Building a Complete Shooter Game", duration: "40 min",
        content: `# Building a Complete Shooter Game

## Top-Down Space Shooter

\`\`\`python
import pygame
import random
import sys

pygame.init()
WIDTH, HEIGHT = 600, 800
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Space Shooter")
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((40, 50))
        self.image.fill((0, 200, 255))
        self.rect = self.image.get_rect(midbottom=(WIDTH//2, HEIGHT-20))
        self.speed = 6
        self.health = 100

    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]: self.rect.x -= self.speed
        if keys[pygame.K_RIGHT]: self.rect.x += self.speed
        self.rect.clamp_ip(screen.get_rect())

    def shoot(self):
        return Bullet(self.rect.centerx, self.rect.top)

class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((4, 12))
        self.image.fill((255, 255, 0))
        self.rect = self.image.get_rect(center=(x, y))

    def update(self):
        self.rect.y -= 10
        if self.rect.bottom < 0:
            self.kill()

class Enemy(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((35, 35))
        self.image.fill((255, 50, 50))
        self.rect = self.image.get_rect(
            center=(random.randint(30, WIDTH-30), -30)
        )
        self.speed = random.uniform(2, 5)

    def update(self):
        self.rect.y += self.speed
        if self.rect.top > HEIGHT:
            self.kill()

# Groups
all_sprites = pygame.sprite.Group()
bullets = pygame.sprite.Group()
enemies = pygame.sprite.Group()

player = Player()
all_sprites.add(player)

# Spawn timer
SPAWN_EVENT = pygame.USEREVENT + 1
pygame.time.set_timer(SPAWN_EVENT, 800)

score = 0
running = True

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                b = player.shoot()
                all_sprites.add(b)
                bullets.add(b)
        if event.type == SPAWN_EVENT:
            e = Enemy()
            all_sprites.add(e)
            enemies.add(e)

    all_sprites.update()

    # Bullet-enemy collisions
    hits = pygame.sprite.groupcollide(bullets, enemies, True, True)
    score += len(hits) * 10

    # Enemy-player collisions
    if pygame.sprite.spritecollide(player, enemies, True):
        player.health -= 20
        if player.health <= 0:
            running = False

    # Draw
    screen.fill((10, 10, 30))
    all_sprites.draw(screen)

    # UI
    score_text = font.render(f"Score: {score}", True, (255, 255, 255))
    screen.blit(score_text, (10, 10))

    # Health bar
    bar_w = 150
    fill = (player.health / 100) * bar_w
    pygame.draw.rect(screen, (60, 60, 60), (WIDTH-bar_w-10, 10, bar_w, 15))
    color = (0,200,0) if player.health > 50 else (255,0,0)
    pygame.draw.rect(screen, color, (WIDTH-bar_w-10, 10, fill, 15))

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
\`\`\`

## Challenges
1. Add power-ups (shield, rapid fire)
2. Add different enemy types
3. Add boss fights every 500 points
4. Add explosion animations
5. Save high scores to a file`
      },
      {
        id: "pg-07", title: "Building a Platformer Game", duration: "40 min",
        content: `# Building a Platformer Game

## Complete Platformer with Levels

\`\`\`python
import pygame
import sys

pygame.init()
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
font = pygame.font.Font(None, 36)

class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((32, 48))
        self.image.fill((0, 200, 255))
        self.rect = self.image.get_rect(topleft=(x, y))
        self.vel_x = 0
        self.vel_y = 0
        self.speed = 5
        self.gravity = 0.8
        self.jump_power = -14
        self.on_ground = False
        self.coins = 0
        self.lives = 3

    def update(self, platforms):
        keys = pygame.key.get_pressed()
        self.vel_x = 0
        if keys[pygame.K_LEFT]: self.vel_x = -self.speed
        if keys[pygame.K_RIGHT]: self.vel_x = self.speed

        # Gravity
        self.vel_y += self.gravity
        if self.vel_y > 15: self.vel_y = 15

        # Horizontal
        self.rect.x += self.vel_x
        for plat in platforms:
            if self.rect.colliderect(plat.rect):
                if self.vel_x > 0: self.rect.right = plat.rect.left
                if self.vel_x < 0: self.rect.left = plat.rect.right

        # Vertical
        self.rect.y += self.vel_y
        self.on_ground = False
        for plat in platforms:
            if self.rect.colliderect(plat.rect):
                if self.vel_y > 0:
                    self.rect.bottom = plat.rect.top
                    self.vel_y = 0
                    self.on_ground = True
                elif self.vel_y < 0:
                    self.rect.top = plat.rect.bottom
                    self.vel_y = 0

    def jump(self):
        if self.on_ground:
            self.vel_y = self.jump_power
            self.on_ground = False

class Platform(pygame.sprite.Sprite):
    def __init__(self, x, y, w, h, color=(100, 100, 100)):
        super().__init__()
        self.image = pygame.Surface((w, h))
        self.image.fill(color)
        self.rect = self.image.get_rect(topleft=(x, y))

class Coin(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((16, 16))
        self.image.fill((255, 215, 0))
        self.rect = self.image.get_rect(center=(x, y))

# Level
platforms = pygame.sprite.Group()
coins = pygame.sprite.Group()
all_sprites = pygame.sprite.Group()

level_data = [
    Platform(0, HEIGHT-40, WIDTH, 40, (80, 120, 80)),  # Ground
    Platform(150, 450, 120, 20),
    Platform(350, 370, 120, 20),
    Platform(550, 280, 120, 20),
    Platform(300, 190, 150, 20),
]

coin_positions = [(210, 430), (410, 350), (610, 260), (375, 170)]

for p in level_data:
    platforms.add(p)
    all_sprites.add(p)

for cx, cy in coin_positions:
    c = Coin(cx, cy)
    coins.add(c)
    all_sprites.add(c)

player = Player(50, HEIGHT - 100)

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                player.jump()

    player.update(platforms)

    # Collect coins
    collected = pygame.sprite.spritecollide(player, coins, True)
    player.coins += len(collected)

    # Draw
    screen.fill((25, 25, 50))
    all_sprites.draw(screen)
    screen.blit(player.image, player.rect)

    # HUD
    coin_text = font.render(f"Coins: {player.coins}", True, (255, 215, 0))
    screen.blit(coin_text, (10, 10))

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
\`\`\`

## Next Steps
1. Add multiple levels with a level loader
2. Add enemies that patrol platforms
3. Add a win condition and level transitions
4. Add animated sprites using sprite sheets
5. Add parallax scrolling backgrounds`
      },
    ],
  },
];

export const skillPaths = [
  { id: "iot", name: "IoT Path", color: "hsl(var(--primary))", courses: ["iot-101", "iot-201"] },
  { id: "robotics", name: "Robotics Path", color: "hsl(var(--accent))", courses: ["robot-101", "robot-201", "arduino-robotics", "rpi-robotics"] },
  { id: "ai", name: "AI & Vision Path", color: "hsl(var(--violet))", courses: ["ai-101", "opencv-2025"] },
  { id: "programming", name: "Programming Path", color: "hsl(var(--amber))", courses: ["pygame-2025"] },
];
