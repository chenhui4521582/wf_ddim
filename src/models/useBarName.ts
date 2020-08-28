import { useState } from 'react';

export default function useBarNameModel() {
  const [barName, setBarName] = useState('发起流程');
  return { barName, setBarName };
}