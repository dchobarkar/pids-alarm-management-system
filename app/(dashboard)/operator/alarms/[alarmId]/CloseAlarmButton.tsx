"use client";

import { useRouter } from "next/navigation";

import { closeAlarm } from "@/api/alarm/operator-alarm-actions";

const CloseAlarmButton = ({ alarmId }: { alarmId: string }) => {
  const router = useRouter();

  const handleClose = async () => {
    const result = await closeAlarm(alarmId);
    if (result.success) router.refresh();
    else alert(result.error);
  };

  return (
    <button
      type="button"
      onClick={handleClose}
      className="rounded-md bg-(--brand-primary) px-3 py-1.5 text-sm text-white hover:opacity-90"
    >
      Close alarm
    </button>
  );
};

export default CloseAlarmButton;
