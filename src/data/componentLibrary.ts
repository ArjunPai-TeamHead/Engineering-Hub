export type ComponentCategory =
  | "Microcontrollers"
  | "Passive"
  | "Active"
  | "Sensors"
  | "Displays"
  | "Motors & Actuators"
  | "Communication"
  | "ICs"
  | "Power"
  | "Connectors"
  | "Prototyping"
  | "IoT";

export interface ComponentItem {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  specs: Record<string, string>;
  pins: string[];
  datasheet?: string;
  image?: string;
}

export const components: ComponentItem[] = [
  // Microcontrollers
  { id: "arduino-uno", name: "Arduino Uno R3", category: "Microcontrollers", description: "ATmega328P-based dev board. 14 digital I/O, 6 analog inputs, 16 MHz clock.", specs: { "MCU": "ATmega328P", "Clock": "16 MHz", "Flash": "32 KB", "SRAM": "2 KB", "Digital I/O": "14", "Analog In": "6", "Voltage": "5V" }, pins: ["D0-D13", "A0-A5", "5V", "3.3V", "GND", "VIN", "RESET", "AREF"] },
  { id: "arduino-mega", name: "Arduino Mega 2560", category: "Microcontrollers", description: "ATmega2560 board with 54 digital I/O pins for complex projects.", specs: { "MCU": "ATmega2560", "Clock": "16 MHz", "Flash": "256 KB", "SRAM": "8 KB", "Digital I/O": "54", "Analog In": "16", "Voltage": "5V" }, pins: ["D0-D53", "A0-A15", "5V", "3.3V", "GND", "VIN"] },
  { id: "arduino-nano", name: "Arduino Nano", category: "Microcontrollers", description: "Compact ATmega328P board for breadboard-friendly projects.", specs: { "MCU": "ATmega328P", "Clock": "16 MHz", "Flash": "32 KB", "SRAM": "2 KB", "Digital I/O": "14", "Analog In": "8", "Voltage": "5V" }, pins: ["D0-D13", "A0-A7", "5V", "3.3V", "GND", "VIN"] },
  { id: "rpi-4", name: "Raspberry Pi 4 Model B", category: "Microcontrollers", description: "Quad-core ARM Cortex-A72 SBC with 40-pin GPIO header.", specs: { "CPU": "BCM2711 Quad A72", "Clock": "1.5 GHz", "RAM": "2/4/8 GB", "GPIO": "40 pins", "USB": "2x USB3 + 2x USB2", "Voltage": "5V/3A" }, pins: ["GPIO0-GPIO27", "3.3V", "5V", "GND", "I2C", "SPI", "UART"] },
  { id: "rpi-pico", name: "Raspberry Pi Pico", category: "Microcontrollers", description: "RP2040 dual-core ARM Cortex-M0+ microcontroller board.", specs: { "MCU": "RP2040", "Clock": "133 MHz", "Flash": "2 MB", "SRAM": "264 KB", "GPIO": "26", "ADC": "3x 12-bit", "Voltage": "3.3V" }, pins: ["GP0-GP28", "3.3V", "GND", "ADC0-ADC2", "VSYS"] },
  { id: "esp32", name: "ESP32 DevKit V1", category: "Microcontrollers", description: "Dual-core WiFi + Bluetooth SoC for IoT applications.", specs: { "CPU": "Xtensa LX6 Dual", "Clock": "240 MHz", "Flash": "4 MB", "SRAM": "520 KB", "WiFi": "802.11 b/g/n", "BT": "4.2", "GPIO": "34" }, pins: ["GPIO0-GPIO39", "3.3V", "GND", "EN", "VIN"] },
  { id: "esp8266", name: "ESP8266 NodeMCU", category: "Microcontrollers", description: "WiFi-enabled microcontroller for IoT projects.", specs: { "CPU": "Tensilica L106", "Clock": "80/160 MHz", "Flash": "4 MB", "WiFi": "802.11 b/g/n", "GPIO": "17", "ADC": "1x 10-bit", "Voltage": "3.3V" }, pins: ["D0-D8", "A0", "3.3V", "GND", "VIN"] },
  { id: "stm32-blue", name: "STM32 Blue Pill", category: "Microcontrollers", description: "STM32F103C8T6 ARM Cortex-M3 development board.", specs: { "MCU": "STM32F103C8T6", "Clock": "72 MHz", "Flash": "64 KB", "SRAM": "20 KB", "GPIO": "37", "Voltage": "3.3V" }, pins: ["PA0-PA15", "PB0-PB15", "PC13-PC15", "3.3V", "GND"] },
  { id: "microbit", name: "Micro:bit", category: "Microcontrollers", description: "Educational microcontroller with LED matrix, buttons, and sensors.", specs: { "MCU": "nRF52833", "Clock": "64 MHz", "Flash": "512 KB", "RAM": "128 KB", "LED Matrix": "5x5", "BT": "5.0", "Sensors": "Accel, Compass" }, pins: ["P0-P20", "3V", "GND"] },
  { id: "attiny85", name: "ATtiny85", category: "Microcontrollers", description: "8-pin AVR microcontroller for small embedded projects.", specs: { "MCU": "ATtiny85", "Clock": "8/16 MHz", "Flash": "8 KB", "SRAM": "512 B", "EEPROM": "512 B", "I/O": "6", "Voltage": "2.7-5.5V" }, pins: ["PB0-PB5", "VCC", "GND"] },

  // Passive Components
  { id: "resistor", name: "Resistors", category: "Passive", description: "Fixed carbon film or metal film resistors in 1/4W and 1/2W ratings.", specs: { "Power": "1/4W, 1/2W", "Tolerance": "±1%, ±5%", "Range": "1Ω - 10MΩ", "Type": "Through-hole" }, pins: ["Lead 1", "Lead 2"] },
  { id: "pot-rotary", name: "Potentiometer (Rotary)", category: "Passive", description: "Variable resistor with rotary knob for analog input.", specs: { "Range": "1KΩ - 1MΩ", "Rotation": "270°", "Type": "Linear/Log", "Power": "0.5W" }, pins: ["Pin 1", "Wiper", "Pin 3"] },
  { id: "pot-slide", name: "Potentiometer (Slide)", category: "Passive", description: "Linear slide potentiometer for fader-style input.", specs: { "Range": "1KΩ - 100KΩ", "Travel": "30-60mm", "Type": "Linear", "Power": "0.25W" }, pins: ["Pin 1", "Wiper", "Pin 3"] },
  { id: "ldr", name: "Photoresistor (LDR)", category: "Passive", description: "Light-dependent resistor — resistance drops with light intensity.", specs: { "Dark Resistance": "1MΩ", "Light Resistance": "1-10KΩ", "Response Time": "~20ms", "Voltage": "150V max" }, pins: ["Lead 1", "Lead 2"] },
  { id: "thermistor", name: "Thermistor (NTC/PTC)", category: "Passive", description: "Temperature-sensitive resistor for thermal measurement.", specs: { "Type": "NTC/PTC", "Range": "-40°C to 125°C", "Resistance": "10KΩ @25°C", "Tolerance": "±1%" }, pins: ["Lead 1", "Lead 2"] },
  { id: "cap-ceramic", name: "Capacitor (Ceramic)", category: "Passive", description: "Non-polarized ceramic disc capacitors for decoupling and filtering.", specs: { "Range": "1pF - 1µF", "Voltage": "25-50V", "Type": "Non-polarized", "Tolerance": "±10-20%" }, pins: ["Lead 1", "Lead 2"] },
  { id: "cap-electrolytic", name: "Capacitor (Electrolytic)", category: "Passive", description: "Polarized aluminum electrolytic capacitors for bulk storage.", specs: { "Range": "1µF - 10,000µF", "Voltage": "6.3-450V", "Type": "Polarized", "ESR": "Low" }, pins: ["Positive (+)", "Negative (-)"] },
  { id: "inductor", name: "Inductor", category: "Passive", description: "Inductive coils for filtering, energy storage, and RF circuits.", specs: { "Range": "1µH - 100mH", "Current": "0.1-5A", "Type": "Axial/Radial", "Tolerance": "±10%" }, pins: ["Lead 1", "Lead 2"] },

  // Active Components
  { id: "diode-1n4007", name: "Diode (1N4007)", category: "Active", description: "General-purpose rectifier diode rated for 1A, 1000V.", specs: { "Forward Current": "1A", "Reverse Voltage": "1000V", "Forward Drop": "0.7V", "Package": "DO-41" }, pins: ["Anode", "Cathode"] },
  { id: "diode-1n4148", name: "Diode (1N4148)", category: "Active", description: "Fast-switching signal diode for logic circuits.", specs: { "Forward Current": "200mA", "Reverse Voltage": "100V", "Forward Drop": "0.7V", "Switch Time": "4ns" }, pins: ["Anode", "Cathode"] },
  { id: "zener", name: "Zener Diode", category: "Active", description: "Voltage regulation diode for reference and clamping.", specs: { "Voltages": "3.3V - 33V", "Power": "0.5W - 1W", "Tolerance": "±5%", "Package": "DO-35" }, pins: ["Anode", "Cathode"] },
  { id: "led-single", name: "LED (Single Color)", category: "Active", description: "Standard 3mm/5mm LEDs in Red, Green, Blue, Yellow, White.", specs: { "Colors": "R/G/B/Y/W", "Forward Voltage": "1.8-3.3V", "Current": "20mA", "Size": "3mm/5mm" }, pins: ["Anode (+)", "Cathode (-)"] },
  { id: "led-rgb", name: "RGB LED", category: "Active", description: "Common anode or cathode RGB LED for full color mixing.", specs: { "Type": "Common Anode/Cathode", "Forward Voltage": "R:2V G:3.2V B:3.2V", "Current": "20mA/channel", "Size": "5mm" }, pins: ["Red", "Common", "Green", "Blue"] },
  { id: "neopixel-ring", name: "NeoPixel Ring", category: "Active", description: "Addressable WS2812B RGB LED rings (12/16/24 LEDs).", specs: { "LEDs": "12/16/24", "Protocol": "WS2812B", "Voltage": "5V", "Current": "~60mA/LED max" }, pins: ["DIN", "DOUT", "5V", "GND"] },
  { id: "neopixel-strip", name: "NeoPixel Strip", category: "Active", description: "Addressable WS2812B RGB LED strip, 30/60/144 LEDs per meter.", specs: { "Density": "30/60/144 LED/m", "Protocol": "WS2812B", "Voltage": "5V", "Flexible": "Yes" }, pins: ["DIN", "DOUT", "5V", "GND"] },
  { id: "npn-2n2222", name: "NPN Transistor (2N2222)", category: "Active", description: "General-purpose NPN switching transistor.", specs: { "Type": "NPN", "Ic max": "800mA", "Vce max": "40V", "hFE": "100-300", "Package": "TO-92" }, pins: ["Emitter", "Base", "Collector"] },
  { id: "npn-bc547", name: "NPN Transistor (BC547)", category: "Active", description: "Low-power NPN transistor for signal amplification.", specs: { "Type": "NPN", "Ic max": "100mA", "Vce max": "45V", "hFE": "110-800", "Package": "TO-92" }, pins: ["Emitter", "Base", "Collector"] },
  { id: "pnp-2n3906", name: "PNP Transistor (2N3906)", category: "Active", description: "General-purpose PNP switching transistor.", specs: { "Type": "PNP", "Ic max": "200mA", "Vce max": "40V", "hFE": "100-300", "Package": "TO-92" }, pins: ["Emitter", "Base", "Collector"] },
  { id: "mosfet-irlz44n", name: "MOSFET (IRLZ44N)", category: "Active", description: "N-channel logic-level MOSFET for high-current switching.", specs: { "Type": "N-Channel", "Id max": "47A", "Vds max": "55V", "Rds(on)": "22mΩ", "Vgs(th)": "1-2V" }, pins: ["Gate", "Drain", "Source"] },
  { id: "darlington-tip120", name: "Darlington Pair (TIP120)", category: "Active", description: "NPN Darlington transistor for high-gain motor driving.", specs: { "Type": "NPN Darlington", "Ic max": "5A", "Vce max": "60V", "hFE": "1000", "Package": "TO-220" }, pins: ["Base", "Collector", "Emitter"] },
  { id: "relay", name: "Relay (5V/12V)", category: "Active", description: "Electromechanical relay for switching high-power loads.", specs: { "Coil": "5V/12V", "Contact": "10A 250VAC", "Type": "SPDT", "Trigger": "~70mA" }, pins: ["Coil+", "Coil-", "COM", "NO", "NC"] },

  // Displays
  { id: "7seg", name: "7-Segment Display", category: "Displays", description: "Single or 4-digit LED numeric display.", specs: { "Digits": "1/4", "Type": "Common Cathode/Anode", "Color": "Red/Green/Blue", "Size": "0.56\"" }, pins: ["a-g", "dp", "COM", "D1-D4"] },
  { id: "lcd-16x2-parallel", name: "16x2 LCD (Parallel)", category: "Displays", description: "Character LCD with HD44780 controller, parallel interface.", specs: { "Characters": "16x2", "Controller": "HD44780", "Backlight": "LED", "Interface": "4/8-bit parallel" }, pins: ["VSS", "VDD", "V0", "RS", "RW", "E", "D0-D7", "LED+", "LED-"] },
  { id: "lcd-16x2-i2c", name: "16x2 LCD (I2C)", category: "Displays", description: "Character LCD with PCF8574 I2C backpack — only 2 wires.", specs: { "Characters": "16x2", "Interface": "I2C (PCF8574)", "Address": "0x27/0x3F", "Voltage": "5V" }, pins: ["SDA", "SCL", "VCC", "GND"] },
  { id: "lcd-20x4", name: "20x4 LCD", category: "Displays", description: "Large character LCD with 4 lines of 20 characters.", specs: { "Characters": "20x4", "Controller": "HD44780", "Interface": "I2C/Parallel", "Voltage": "5V" }, pins: ["SDA", "SCL", "VCC", "GND"] },
  { id: "oled-ssd1306", name: "OLED (SSD1306)", category: "Displays", description: "0.96\" 128x64 monochrome OLED with I2C interface.", specs: { "Resolution": "128x64", "Size": "0.96\"", "Interface": "I2C/SPI", "Driver": "SSD1306", "Voltage": "3.3-5V" }, pins: ["SDA", "SCL", "VCC", "GND"] },
  { id: "tft-ili9341", name: "TFT Touchscreen (ILI9341)", category: "Displays", description: "2.4\" 320x240 color TFT with resistive touch.", specs: { "Resolution": "320x240", "Size": "2.4\"", "Interface": "SPI", "Touch": "Resistive", "Colors": "65K" }, pins: ["MOSI", "MISO", "SCK", "CS", "DC", "RST", "T_CS"] },
  { id: "epaper", name: "E-Paper Display", category: "Displays", description: "Low-power bistable display, visible in sunlight.", specs: { "Resolution": "200x200", "Colors": "B/W", "Interface": "SPI", "Refresh": "~2s", "Power": "Ultra-low" }, pins: ["DIN", "CLK", "CS", "DC", "RST", "BUSY"] },
  { id: "led-matrix", name: "8x8 LED Matrix (MAX7219)", category: "Displays", description: "Cascadable 8x8 LED matrix with MAX7219 driver.", specs: { "LEDs": "64 (8x8)", "Driver": "MAX7219", "Interface": "SPI", "Cascade": "Up to 8", "Voltage": "5V" }, pins: ["DIN", "CS", "CLK", "VCC", "GND"] },

  // Sensors
  { id: "hcsr04", name: "Ultrasonic (HC-SR04)", category: "Sensors", description: "Distance sensor using ultrasonic pulses, range 2-400cm.", specs: { "Range": "2-400 cm", "Accuracy": "3mm", "Angle": "15°", "Trigger": "10µs pulse", "Voltage": "5V" }, pins: ["VCC", "TRIG", "ECHO", "GND"] },
  { id: "dht11", name: "DHT11 (Temp/Humidity)", category: "Sensors", description: "Basic digital temperature & humidity sensor.", specs: { "Temp Range": "0-50°C ±2°C", "Humidity": "20-80% ±5%", "Sampling": "1 Hz", "Voltage": "3-5V" }, pins: ["VCC", "DATA", "NC", "GND"] },
  { id: "dht22", name: "DHT22 (Temp/Humidity)", category: "Sensors", description: "Higher-accuracy digital temperature & humidity sensor.", specs: { "Temp Range": "-40-80°C ±0.5°C", "Humidity": "0-100% ±2%", "Sampling": "0.5 Hz", "Voltage": "3-5V" }, pins: ["VCC", "DATA", "NC", "GND"] },
  { id: "bmp280", name: "BMP280 (Pressure/Temp)", category: "Sensors", description: "Barometric pressure and temperature sensor (I2C/SPI).", specs: { "Pressure": "300-1100 hPa", "Temp": "-40-85°C", "Accuracy": "±1 hPa", "Interface": "I2C/SPI" }, pins: ["SDA", "SCL", "VCC", "GND", "CSB", "SDO"] },
  { id: "mpu6050", name: "MPU6050 (Accel/Gyro)", category: "Sensors", description: "6-axis IMU with 3-axis accelerometer and 3-axis gyroscope.", specs: { "Accel Range": "±2/4/8/16g", "Gyro Range": "±250-2000°/s", "Interface": "I2C", "ADC": "16-bit", "Voltage": "3-5V" }, pins: ["SDA", "SCL", "VCC", "GND", "INT", "AD0"] },
  { id: "pir", name: "PIR Motion Sensor", category: "Sensors", description: "Passive infrared motion detector (HC-SR501).", specs: { "Range": "3-7m", "Angle": "120°", "Delay": "5-200s adjustable", "Voltage": "5-20V" }, pins: ["VCC", "OUT", "GND"] },
  { id: "mq2", name: "Gas Sensor (MQ-2)", category: "Sensors", description: "Smoke, LPG, butane, propane, methane, alcohol, and hydrogen detector.", specs: { "Gases": "Smoke/LPG/CO", "Range": "300-10000ppm", "Heater": "5V", "Output": "Analog + Digital" }, pins: ["VCC", "GND", "AOUT", "DOUT"] },
  { id: "mq135", name: "Gas Sensor (MQ-135)", category: "Sensors", description: "Air quality sensor detecting NH3, NOx, alcohol, benzene, smoke, CO2.", specs: { "Gases": "NH3/NOx/CO2", "Range": "10-1000ppm", "Heater": "5V", "Output": "Analog + Digital" }, pins: ["VCC", "GND", "AOUT", "DOUT"] },
  { id: "soil-moisture", name: "Soil Moisture Sensor", category: "Sensors", description: "Resistive probe for measuring soil water content.", specs: { "Output": "Analog + Digital", "Voltage": "3.3-5V", "Probe": "2-prong", "Type": "Resistive" }, pins: ["VCC", "GND", "AOUT", "DOUT"] },
  { id: "sound-sensor", name: "Sound Sensor", category: "Sensors", description: "Microphone module with analog and digital output.", specs: { "Sensitivity": "Adjustable", "Output": "Analog + Digital", "Voltage": "3.3-5V", "Type": "Electret" }, pins: ["VCC", "GND", "AOUT", "DOUT"] },
  { id: "flex-sensor", name: "Flex Sensor", category: "Sensors", description: "Bending sensor — resistance increases with flex angle.", specs: { "Flat Resistance": "25KΩ", "Bent Resistance": "~100KΩ", "Length": "2.2\"", "Life": "1M cycles" }, pins: ["Lead 1", "Lead 2"] },
  { id: "fsr", name: "Force Sensitive Resistor", category: "Sensors", description: "Pressure pad — resistance decreases with applied force.", specs: { "Range": "100g - 10kg", "Resistance": "∞ (no press) to <1KΩ", "Size": "0.5\" round", "Voltage": "3.3-5V" }, pins: ["Lead 1", "Lead 2"] },
  { id: "hall-effect", name: "Hall Effect Sensor", category: "Sensors", description: "Magnetic field detector for RPM/position sensing.", specs: { "Output": "Digital/Analog", "Field": "Detects N/S poles", "Voltage": "3.3-5V", "Type": "Latching/Linear" }, pins: ["VCC", "GND", "OUT"] },
  { id: "ir-receiver", name: "IR Receiver (TSOP)", category: "Sensors", description: "38kHz infrared receiver for remote control signals.", specs: { "Frequency": "38 kHz", "Range": "~10m", "Voltage": "2.7-5.5V", "Protocol": "NEC/RC5" }, pins: ["OUT", "GND", "VCC"] },
  { id: "ir-remote", name: "IR Remote Control", category: "Sensors", description: "Infrared remote transmitter with 21 buttons.", specs: { "Buttons": "21", "Protocol": "NEC", "Battery": "CR2025", "Range": "~8m" }, pins: ["IR LED output"] },

  // Input Devices
  { id: "pushbutton", name: "Pushbutton (Tactile)", category: "Active", description: "Momentary tactile pushbutton switch for breadboards.", specs: { "Type": "Momentary", "Rating": "50mA 12V", "Bounce": "~5ms", "Mount": "Breadboard" }, pins: ["Pin 1", "Pin 2", "Pin 3", "Pin 4"] },
  { id: "slide-switch", name: "Slide Switch (SPDT)", category: "Active", description: "Single pole double throw slide switch.", specs: { "Type": "SPDT", "Rating": "0.5A 50V", "Positions": "2", "Mount": "PCB/Panel" }, pins: ["COM", "NO", "NC"] },
  { id: "toggle-switch", name: "Toggle Switch (SPST)", category: "Active", description: "Single pole single throw toggle switch.", specs: { "Type": "SPST", "Rating": "3A 250VAC", "Positions": "2", "Mount": "Panel" }, pins: ["Lead 1", "Lead 2"] },
  { id: "dip-switch", name: "DIP Switch (4/8 pos)", category: "Active", description: "Multi-position DIP switch for configuration.", specs: { "Positions": "4/8", "Rating": "25mA 24V", "Type": "SPST per switch", "Mount": "DIP" }, pins: ["1-4/1-8", "COM"] },
  { id: "keypad-4x4", name: "Keypad (4x4 Matrix)", category: "Active", description: "16-key membrane matrix keypad (0-9, A-D, *, #).", specs: { "Keys": "16", "Interface": "8-pin matrix", "Type": "Membrane", "Debounce": "Required" }, pins: ["R1-R4", "C1-C4"] },
  { id: "keypad-3x4", name: "Keypad (3x4 Matrix)", category: "Active", description: "12-key telephone-style matrix keypad.", specs: { "Keys": "12", "Interface": "7-pin matrix", "Type": "Membrane", "Debounce": "Required" }, pins: ["R1-R4", "C1-C3"] },
  { id: "rotary-encoder", name: "Rotary Encoder", category: "Active", description: "Incremental rotary encoder with push button.", specs: { "Steps": "20/revolution", "Output": "Quadrature A/B", "Button": "Integrated", "Voltage": "3.3-5V" }, pins: ["CLK", "DT", "SW", "VCC", "GND"] },

  // Motors & Actuators
  { id: "servo-sg90", name: "Servo (SG90 Micro)", category: "Motors & Actuators", description: "9g micro servo for lightweight applications.", specs: { "Torque": "1.8 kg·cm", "Speed": "0.1s/60°", "Angle": "0-180°", "Voltage": "4.8-6V", "Weight": "9g" }, pins: ["Signal (Orange)", "VCC (Red)", "GND (Brown)"] },
  { id: "servo-mg996r", name: "Servo (MG996R)", category: "Motors & Actuators", description: "High-torque metal gear servo for robotics.", specs: { "Torque": "11 kg·cm", "Speed": "0.17s/60°", "Angle": "0-180°", "Voltage": "4.8-7.2V", "Weight": "55g" }, pins: ["Signal", "VCC", "GND"] },
  { id: "dc-motor", name: "DC Motor (3-6V)", category: "Motors & Actuators", description: "Small brushed DC motor for basic movement.", specs: { "Voltage": "3-6V", "No-load Speed": "~15000 RPM", "Current": "70-250mA", "Shaft": "2mm" }, pins: ["Motor+", "Motor-"] },
  { id: "stepper-28byj", name: "Stepper Motor (28BYJ-48)", category: "Motors & Actuators", description: "5V unipolar stepper with ULN2003 driver board.", specs: { "Steps": "2048/rev (half)", "Voltage": "5V", "Gear Ratio": "1:64", "Current": "~240mA" }, pins: ["IN1", "IN2", "IN3", "IN4", "VCC"] },
  { id: "uln2003", name: "Stepper Driver (ULN2003)", category: "Motors & Actuators", description: "Darlington transistor array driver board for stepper motors.", specs: { "Channels": "7", "Max Current": "500mA/ch", "Voltage": "5-12V", "LED": "Status indicators" }, pins: ["IN1-IN7", "OUT1-OUT7", "COM", "GND"] },
  { id: "l298n", name: "H-Bridge (L298N)", category: "Motors & Actuators", description: "Dual full-bridge DC motor driver, up to 2A per channel.", specs: { "Channels": "2", "Current": "2A/ch", "Voltage": "5-35V", "Logic": "5V" }, pins: ["IN1-IN4", "ENA", "ENB", "OUT1-OUT4", "12V", "5V", "GND"] },
  { id: "l293d", name: "H-Bridge (L293D)", category: "Motors & Actuators", description: "Quadruple half-H driver IC for bi-directional motor control.", specs: { "Channels": "4 half-H", "Current": "600mA/ch", "Voltage": "4.5-36V", "Package": "DIP-16" }, pins: ["1A-4A", "1Y-4Y", "EN1", "EN2", "VS", "VSS", "GND"] },
  { id: "vibration-motor", name: "Vibration Motor", category: "Motors & Actuators", description: "Coin-type vibration motor for haptic feedback.", specs: { "Voltage": "2-5V", "Current": "75mA", "RPM": "~12000", "Size": "10mm coin" }, pins: ["Motor+", "Motor-"] },
  { id: "buzzer-active", name: "Buzzer (Active)", category: "Motors & Actuators", description: "Continuous tone buzzer — just apply DC voltage.", specs: { "Voltage": "3-5V", "Frequency": "~2.3 kHz", "Current": "30mA", "Type": "Active (built-in oscillator)" }, pins: ["Positive (+)", "Negative (-)"] },
  { id: "buzzer-passive", name: "Buzzer (Passive/Piezo)", category: "Motors & Actuators", description: "PWM-driven piezo buzzer — play tones via frequency.", specs: { "Voltage": "3-5V", "Frequency": "1-5 kHz", "Current": "25mA", "Type": "Passive (needs PWM)" }, pins: ["Signal (+)", "GND (-)"] },

  // Communication Modules
  { id: "bluetooth-hc05", name: "Bluetooth HC-05", category: "Communication", description: "Serial Bluetooth module for wireless UART communication.", specs: { "Bluetooth": "2.0+EDR", "Range": "~10m", "Baud": "9600-1382400", "Mode": "Master/Slave", "Voltage": "3.3V (5V tolerant)" }, pins: ["VCC", "GND", "TX", "RX", "EN", "STATE"] },
  { id: "nrf24l01", name: "RF Transceiver (NRF24L01)", category: "Communication", description: "2.4GHz wireless transceiver for point-to-point or mesh communication.", specs: { "Frequency": "2.4 GHz", "Range": "~100m (PA+LNA)", "Data Rate": "250kbps-2Mbps", "Interface": "SPI", "Voltage": "3.3V" }, pins: ["VCC", "GND", "CE", "CSN", "SCK", "MOSI", "MISO", "IRQ"] },

  // ICs
  { id: "logic-gates", name: "Logic Gates (74HC)", category: "ICs", description: "Standard CMOS logic gate ICs — AND, OR, NOT, XOR, NAND, NOR.", specs: { "Family": "74HC", "Voltage": "2-6V", "Package": "DIP-14", "Speed": "~25ns", "Types": "AND/OR/NOT/XOR" }, pins: ["VCC", "GND", "Input A/B", "Output Y"] },
  { id: "shift-register", name: "Shift Register (74HC595)", category: "ICs", description: "8-bit serial-in, parallel-out shift register for expanding GPIO.", specs: { "Bits": "8", "Interface": "SPI-like", "Cascade": "Yes", "Voltage": "2-6V", "Package": "DIP-16" }, pins: ["SER", "SRCLK", "RCLK", "OE", "SRCLR", "QA-QH", "QH'", "VCC", "GND"] },
  { id: "555-timer", name: "555 Timer IC", category: "ICs", description: "Versatile timer for monostable, astable, and PWM circuits.", specs: { "Voltage": "4.5-16V", "Output Current": "200mA", "Frequency": "Up to 500kHz", "Package": "DIP-8" }, pins: ["GND", "TRIG", "OUT", "RESET", "CTRL", "THR", "DIS", "VCC"] },
  { id: "opamp-lm358", name: "Op-Amp (LM358)", category: "ICs", description: "Dual op-amp for signal conditioning and amplification.", specs: { "Channels": "2", "Supply": "3-32V", "Gain-BW": "1 MHz", "Slew Rate": "0.3V/µs", "Package": "DIP-8" }, pins: ["OUT1", "IN1-", "IN1+", "GND", "IN2+", "IN2-", "OUT2", "VCC"] },
  { id: "rtc-ds3231", name: "RTC (DS3231)", category: "ICs", description: "High-precision real-time clock with I2C and battery backup.", specs: { "Accuracy": "±2ppm", "Interface": "I2C", "Battery": "CR2032", "Alarm": "2 alarms", "Voltage": "3.3-5V" }, pins: ["SDA", "SCL", "VCC", "GND", "SQW", "32K"] },
  { id: "sd-card", name: "MicroSD Card Module", category: "ICs", description: "SPI-based microSD card reader for data logging.", specs: { "Interface": "SPI", "Card": "MicroSD (FAT16/32)", "Voltage": "3.3/5V", "Max Size": "32GB" }, pins: ["MOSI", "MISO", "SCK", "CS", "VCC", "GND"] },

  // Power
  { id: "vreg-7805", name: "Voltage Regulator (7805)", category: "Power", description: "Fixed 5V linear voltage regulator, 1A output.", specs: { "Output": "5V", "Current": "1A", "Input": "7-35V", "Dropout": "2V", "Package": "TO-220" }, pins: ["Input", "GND", "Output"] },
  { id: "vreg-lm317", name: "Voltage Regulator (LM317)", category: "Power", description: "Adjustable linear voltage regulator (1.25V-37V).", specs: { "Output": "1.25-37V", "Current": "1.5A", "Input": "3-40V", "Dropout": "3V", "Package": "TO-220" }, pins: ["Adjust", "Output", "Input"] },
  { id: "battery-9v", name: "Battery (9V)", category: "Power", description: "Standard 9V alkaline battery with snap connector.", specs: { "Voltage": "9V", "Capacity": "~550mAh", "Type": "Alkaline", "Connector": "Snap" }, pins: ["Positive (+)", "Negative (-)"] },
  { id: "battery-aa", name: "Battery (AA/AAA)", category: "Power", description: "1.5V alkaline AA or AAA cell battery.", specs: { "Voltage": "1.5V", "Capacity": "AA:2500mAh / AAA:1000mAh", "Type": "Alkaline", "Size": "AA/AAA" }, pins: ["Positive (+)", "Negative (-)"] },
  { id: "battery-lipo", name: "Battery (Li-Po 3.7V)", category: "Power", description: "Rechargeable lithium polymer battery.", specs: { "Voltage": "3.7V nominal", "Capacity": "500-2000mAh", "Discharge": "1-2C", "Connector": "JST-PH" }, pins: ["Positive (+)", "Negative (-)"] },
  { id: "coin-cell", name: "Coin Cell (CR2032)", category: "Power", description: "3V lithium coin cell battery for RTC and low-power.", specs: { "Voltage": "3V", "Capacity": "220mAh", "Size": "20mm x 3.2mm", "Type": "Lithium" }, pins: ["Positive (+)", "Negative (-)"] },
  { id: "solar-panel", name: "Solar Panel", category: "Power", description: "Small photovoltaic panel for outdoor/solar projects.", specs: { "Voltage": "5-6V", "Current": "100-200mA", "Size": "~65x65mm", "Type": "Polycrystalline" }, pins: ["Positive (+)", "Negative (-)"] },

  // Connectors & Prototyping
  { id: "usb-connector", name: "USB Connector", category: "Connectors", description: "Type-C or Micro-USB breakout board.", specs: { "Types": "Type-C / Micro-B", "Voltage": "5V", "Current": "500mA-3A", "Data": "USB 2.0" }, pins: ["VBUS", "D+", "D-", "GND", "CC1", "CC2"] },
  { id: "barrel-jack", name: "Barrel Jack", category: "Connectors", description: "DC barrel jack connector (5.5x2.1mm).", specs: { "Size": "5.5x2.1mm", "Rating": "12V 2A", "Type": "Center positive", "Mount": "Panel/PCB" }, pins: ["Center (+)", "Sleeve (-)"] },
  { id: "screw-terminal", name: "Screw Terminal Block", category: "Connectors", description: "2/3-position screw terminal for secure wire connections.", specs: { "Positions": "2/3", "Pitch": "5.08mm", "Rating": "300V 10A", "Wire": "22-14 AWG" }, pins: ["Terminal 1", "Terminal 2"] },
  { id: "pin-headers", name: "Pin Headers", category: "Connectors", description: "Male/female header strips for prototyping connections.", specs: { "Pitch": "2.54mm", "Type": "Male/Female", "Length": "1x40", "Rating": "3A" }, pins: ["Pin 1-40"] },
  { id: "jumper-wires", name: "Jumper Wires", category: "Prototyping", description: "Male-to-male, male-to-female, female-to-female wires.", specs: { "Types": "M-M / M-F / F-F", "Length": "10-30cm", "Gauge": "22-26 AWG", "Colors": "Assorted" }, pins: ["End 1", "End 2"] },
  { id: "breadboard-full", name: "Breadboard (Full)", category: "Prototyping", description: "830-point solderless breadboard with power rails.", specs: { "Points": "830", "Rows": "63", "Power Rails": "4", "Size": "165x55mm" }, pins: ["Power (+/-)", "Rows a-e / f-j"] },
  { id: "breadboard-half", name: "Breadboard (Half)", category: "Prototyping", description: "400-point half-size solderless breadboard.", specs: { "Points": "400", "Rows": "30", "Power Rails": "2", "Size": "85x55mm" }, pins: ["Power (+/-)", "Rows a-e / f-j"] },
  { id: "breadboard-mini", name: "Breadboard (Mini)", category: "Prototyping", description: "170-point mini breadboard for small circuits.", specs: { "Points": "170", "Rows": "17", "Power Rails": "0", "Size": "47x35mm" }, pins: ["Rows a-e / f-j"] },
];

export const categories: ComponentCategory[] = [
  "Microcontrollers", "Passive", "Active", "Sensors", "Displays",
  "Motors & Actuators", "Communication", "ICs", "Power", "Connectors", "Prototyping", "IoT",
];
