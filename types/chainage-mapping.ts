export type ChainageMapping = {
  id: string;
  user: { id: string; name: string; email: string };
  chainage: { id: string; label: string; startKm: number; endKm: number };
};

export type ChainageWithUsers = {
  id: string;
  label: string;
  startKm: number;
  endKm: number;
  users: {
    id: string;
    user: { id: string; name: string; email: string };
  }[];
};
