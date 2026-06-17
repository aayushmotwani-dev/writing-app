"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAppStore, type ModuleType } from "@/store/useAppStore";

import Sandbox from "@/components/modules/Sandbox";
import NeuralNet from "@/components/modules/NeuralNet";
import Blueprint from "@/components/modules/Blueprint";
import Typewriter from "@/components/modules/Typewriter";
import EditorsDesk from "@/components/modules/EditorsDesk";
import Lookbook from "@/components/modules/Lookbook";
import Timeline from "@/components/modules/Timeline";

const modules: Record<ModuleType, React.ComponentType> = {
  sandbox: Sandbox,
  "neural-net": NeuralNet,
  blueprint: Blueprint,
  typewriter: Typewriter,
  "editors-desk": EditorsDesk,
  lookbook: Lookbook,
  timeline: Timeline,
};

export default function ModuleRenderer() {
  const activeModule = useAppStore((s) => s.activeModule);
  const ActiveComponent = modules[activeModule];

  return (
    <div className="flex-1 h-full overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full"
        >
          {ActiveComponent ? <ActiveComponent /> : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
