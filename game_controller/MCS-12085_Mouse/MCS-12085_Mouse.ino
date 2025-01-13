#include <Mouse.h>

// Pins for the MCS12085 sensor
#define CLK_PIN 1
#define DAT_PIN 2

// Variables to hold the accumulated X and Y positions
int x = 0, y = 0;

void setup() {
  // Initialize Serial and Mouse
  // Serial.begin(115200);
  Mouse.begin();
  
  // Initialize the MCS12085 sensor
  mcs12085_init();
  
  // Serial.println("Mouse is ready. Sensor inputs control movement.");
}

void loop() {
  // Read deltas from the sensor
  int8_t dx = mcs12085_dx();
  int8_t dy = mcs12085_dy();

  // Invert dy to correct the direction
  dy = -dy;
  dx = -dx;

  // Invert dy to correct the direction
  dx = dx/8;
  dy = dy/8;

  // Update the X and Y positions
  x += dx;
  y += dy;

  // Map the sensor deltas to mouse movement
  Mouse.move(dx, dy, 0); // dx and dy directly control the mouse

  // Debug output to monitor X and Y values
  // Serial.print("X: ");
  // Serial.print(x);
  // Serial.print(", Y: ");
  // Serial.println(y);

  delay(5); // Small delay to prevent excessive polling
}

// Initialize the MCS12085 sensor
void mcs12085_init() {
  pinMode(CLK_PIN, OUTPUT);
  pinMode(DAT_PIN, OUTPUT);
  digitalWrite(CLK_PIN, HIGH);
  digitalWrite(DAT_PIN, LOW);
  delay(100); // Power supply rise time
}

// Read dx (delta X) from the sensor
int8_t mcs12085_dx() {
  return mcs12085_read_register(0x03);
}

// Read dy (delta Y) from the sensor
int8_t mcs12085_dy() {
  return mcs12085_read_register(0x02);
}

// Read a specific register from the sensor
uint8_t mcs12085_read_register(uint8_t reg) {
  mcs12085_write_byte(reg);
  delayMicroseconds(100);
  return mcs12085_read_byte();
}

// Read a byte from the sensor
uint8_t mcs12085_read_byte() {
  pinMode(DAT_PIN, INPUT);
  uint8_t result = 0;
  for (int i = 0; i < 8; i++) {
    digitalWrite(CLK_PIN, LOW);
    digitalWrite(CLK_PIN, HIGH);
    result = result << 1 | digitalRead(DAT_PIN);
  }
  pinMode(DAT_PIN, OUTPUT);
  return result;
}

// Write a byte to the sensor
void mcs12085_write_byte(uint8_t val) {
  for (int i = 0; i < 8; i++) {
    digitalWrite(CLK_PIN, LOW);
    digitalWrite(DAT_PIN, val & 1 << 7); // Get MSB
    val = val << 1;
    digitalWrite(CLK_PIN, HIGH);
  }
}
