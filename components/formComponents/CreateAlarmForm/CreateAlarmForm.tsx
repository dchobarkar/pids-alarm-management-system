"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { createAlarm } from "./actions";

const ALARM_TYPE_OPTIONS = [
  { value: "VIBRATION", label: "Vibration" },
  { value: "DIGGING", label: "Digging" },
  { value: "INTRUSION", label: "Intrusion" },
  { value: "TAMPERING", label: "Tampering" },
  { value: "UNKNOWN", label: "Unknown" },
];

const CRITICALITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

const CreateAlarmForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const result = await createAlarm(formData);
    setLoading(false);
    if (result.success) {
      router.push("/operator/alarms");
      router.refresh();
      return;
    }
    setError(result.error);
  }

  const now = new Date();
  const maxDate = now.toISOString().slice(0, 16);

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Latitude"
          name="latitude"
          type="number"
          step="any"
          required
          placeholder="-90 to 90"
        />
        <Input
          label="Longitude"
          name="longitude"
          type="number"
          step="any"
          required
          placeholder="-180 to 180"
        />
      </div>

      <Input
        label="Chainage value (km)"
        name="chainageValue"
        type="number"
        step="0.001"
        min="0"
        required
        helperText="Must fall within an existing chainage range. Max 3 decimal places."
      />

      <Select
        label="Alarm type"
        name="alarmType"
        options={ALARM_TYPE_OPTIONS}
        required
      />

      <Select
        label="Criticality"
        name="criticality"
        options={CRITICALITY_OPTIONS}
        required
      />

      <Input
        label="Incident time"
        name="incidentTime"
        type="datetime-local"
        required
        max={maxDate}
        helperText="Cannot be in the future"
      />

      <div className="flex gap-2 pt-2">
        <Button type="submit" loading={loading}>
          Create alarm
        </Button>

        <Link href="/operator/alarms">
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
};

export default CreateAlarmForm;
