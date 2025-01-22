/*
  # Create Intrusion Detection System Schema

  1. New Tables
    - `intrusion_alerts`
      - `id` (uuid, primary key)
      - `timestamp` (timestamptz, when the intrusion was detected)
      - `source_ip` (text, source of the intrusion attempt)
      - `target_system` (text, system being targeted)
      - `description` (text, details about the intrusion)
      - `level` (text, severity level)
      - `quantum_probability` (float, confidence score from quantum algorithm)
      - `mitigated` (boolean, whether the threat was addressed)
      - `created_at` (timestamptz, record creation time)

  2. Security
    - Enable RLS on `intrusion_alerts` table
    - Add policies for authenticated users to read alerts
    - Add policies for admin users to create/update alerts
*/

CREATE TYPE alert_level AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE intrusion_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  source_ip text NOT NULL,
  target_system text NOT NULL,
  description text NOT NULL,
  level alert_level NOT NULL,
  quantum_probability float NOT NULL CHECK (quantum_probability >= 0 AND quantum_probability <= 1),
  mitigated boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE intrusion_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to view alerts"
  ON intrusion_alerts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admins to insert alerts"
  ON intrusion_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Allow admins to update alerts"
  ON intrusion_alerts
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Create indexes for better query performance
CREATE INDEX idx_intrusion_alerts_timestamp ON intrusion_alerts (timestamp DESC);
CREATE INDEX idx_intrusion_alerts_level ON intrusion_alerts (level);
CREATE INDEX idx_intrusion_alerts_source_ip ON intrusion_alerts (source_ip);