// Test imports for Task 01 - Test scenarios T-004, T-005, T-006, T-010
import { motion } from 'framer-motion';
import { Home, Settings, Play, Sparkles } from 'lucide-react';
import { create } from 'zustand';

// Test T-005: Framer Motion imports correctly
const TestMotion = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
    Framer Motion Test
  </motion.div>
);

// Test T-006: Lucide React icons render correctly
const TestIcons = () => (
  <div className="flex gap-4">
    <Home size={24} />
    <Settings size={24} />
    <Play size={24} />
    <Sparkles size={24} />
  </div>
);

// Test Zustand (state management)
interface StoreState {
  count: number;
  increment: () => void;
}

const useTestStore = create<StoreState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Test T-004: Tailwind classes apply correctly (already tested in App.tsx)
const TestTailwind = () => (
  <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">Tailwind CSS Test</div>
);

export { TestMotion, TestIcons, useTestStore, TestTailwind };
