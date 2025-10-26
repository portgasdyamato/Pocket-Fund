import QuickActionButton from '../QuickActionButton';
import { PlusCircle } from 'lucide-react';

export default function QuickActionButtonExample() {
  return <QuickActionButton icon={PlusCircle} label="Log Expense" onClick={() => console.log('Log expense clicked')} />;
}
