import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const OptionButton = ({ label, selected, onClick }: OptionButtonProps) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        type="button"
        variant={selected ? "default" : "outline"}
        className={`w-full justify-start text-left h-auto py-4 px-6 ${
          selected 
            ? "bg-primary text-white hover:bg-primary/90" 
            : "bg-card hover:bg-secondary/50 border-border"
        }`}
        onClick={onClick}
      >
        <span className="flex-1">{label}</span>
        {selected && <Check className="h-5 w-5 ml-2" />}
      </Button>
    </motion.div>
  );
};

export default OptionButton;
