import AchievementBadge from '../AchievementBadge';

export default function AchievementBadgeExample() {
  return (
    <AchievementBadge
      id="1"
      type="trophy"
      title="First Week Complete!"
      description="You logged expenses for 7 days straight"
      points={100}
    />
  );
}
