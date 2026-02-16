export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  path: "IoT" | "Robotics" | "AI";
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
];

export const skillPaths = [
  { id: "iot", name: "IoT Path", color: "hsl(var(--primary))", courses: ["iot-101", "iot-201"] },
  { id: "robotics", name: "Robotics Path", color: "hsl(var(--accent))", courses: ["robot-101", "robot-201"] },
  { id: "ai", name: "AI Path", color: "hsl(var(--violet))", courses: ["ai-101"] },
];
