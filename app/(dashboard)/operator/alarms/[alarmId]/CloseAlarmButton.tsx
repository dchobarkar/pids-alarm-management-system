"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { closeAlarm } from "@/api/alarm/operator-alarm-actions";
import Button from "@/components/ui/Button";

const CloseAlarmButton = ({ alarmId }: { alarmId: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClose = async () => {
    setLoading(true);
    const result = await closeAlarm(alarmId);
    setLoading(false);
    if (result.success) router.refresh();
    else alert(result.error);
  };

  return (
    <Button type="button" onClick={handleClose} loading={loading}>
      Close alarm
    </Button>
  );
};

export default CloseAlarmButton;
