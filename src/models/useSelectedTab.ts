import { useState } from 'react';

export default function useSelectedTab() {
  const [selectedTab, setSelectedTab] = useState('initial');
  return { selectedTab, setSelectedTab };
}