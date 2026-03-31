// Utility functions for generating consistent avatars across the app

// Generate a consistent color based on a string (name or ID)
export const generateAvatarColor = (input: string | number): string => {
  // Always return orange color for avatar background
  return "bg-[#FF9530]"
}

// Generate initials from a full name
export const generateInitials = (fullName: string): string => {
  if (!fullName || fullName.trim() === "") return "U"
  
  const names = fullName.trim().split(" ").filter(name => name.length > 0)
  
  if (names.length === 0) return "U"
  if (names.length === 1) return names[0].charAt(0).toUpperCase()
  
  // Take first letter of first name and first letter of last name
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

// Generate a text avatar for any user (for reviews, comments, etc.)
export const generateTextAvatar = (name: string, identifier?: string | number) => {
  const initials = generateInitials(name)
  const colorClass = generateAvatarColor(identifier || name)
  
  return {
    initials,
    colorClass
  }
}