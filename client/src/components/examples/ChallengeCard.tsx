import ChallengeCard from '../ChallengeCard';

export default function ChallengeCardExample() {
  return (
    <ChallengeCard
      id="1"
      title="No Coffee Shop Week"
      difficulty="Medium"
      points={500}
      progress={42}
      timeRemaining="3 days left"
      isActive={true}
      onAction={() => console.log('Challenge action clicked')}
    />
  );
}
