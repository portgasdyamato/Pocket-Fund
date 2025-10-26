import ExpenseItem from '../ExpenseItem';

export default function ExpenseItemExample() {
  return (
    <ExpenseItem
      id="1"
      category="Food"
      description="Starbucks Latte"
      amount={6.50}
      date="Today"
    />
  );
}
