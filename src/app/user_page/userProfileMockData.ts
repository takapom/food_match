// Mock data for user profile
export const mockRootProps = {
  user: {
    username: "jacob_w" as const,
    displayName: "Jacob West" as const,
    avatar: "/images/profile-avatar.png" as const,
    followingCount: 0,
    followersCount: 0,
    likesCount: 0,
    hasBio: false
  },
  currentTab: "profile" as const
};