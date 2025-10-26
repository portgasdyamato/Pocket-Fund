import { useState } from 'react';
import AddExpenseModal from '../AddExpenseModal';
import { Button } from '@/components/ui/button';

export default function AddExpenseModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <AddExpenseModal 
        open={open} 
        onOpenChange={setOpen}
        onAdd={(expense) => console.log('Expense added:', expense)}
      />
    </div>
  );
}
