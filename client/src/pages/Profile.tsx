import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Upload, User, Camera, Save, X } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [profileImageUrl, setProfileImageUrl] = useState(user?.profileImageUrl || "");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setProfileImageUrl(user.profileImageUrl || "");
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName?: string; lastName?: string; profileImageUrl?: string }) => {
      try {
        const response = await apiRequest("/api/user/profile", "PATCH", data);
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          return await response.json();
        } else {
          // If not JSON, get text to see what we got
          const text = await response.text();
          console.error("Non-JSON response:", text.substring(0, 200));
          throw new Error("Server returned invalid response format");
        }
      } catch (error: any) {
        console.error("API request error:", error);
        // If error message contains HTML, extract a better message
        if (error.message && error.message.includes("<!DOCTYPE")) {
          throw new Error("Server error: Please check server logs");
        }
        throw error;
      }
    },
    onSuccess: (updatedUser) => {
      // Update query cache and invalidate to force refetch
      queryClient.setQueryData(["/api/auth/user"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Update local state
      setFirstName(updatedUser.firstName || "");
      setLastName(updatedUser.lastName || "");
      setProfileImageUrl(updatedUser.profileImageUrl || "");
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
      setPreviewImage(null);
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const compressImage = (file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          // Create canvas and compress
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Compress and resize image
      const compressedBase64 = await compressImage(file, 800, 800, 0.8);
      
      // Check compressed size (should be much smaller)
      const sizeInMB = (compressedBase64.length * 3) / 4 / 1024 / 1024;
      console.log(`Compressed image size: ${sizeInMB.toFixed(2)}MB`);
      
      setPreviewImage(compressedBase64);
      setProfileImageUrl(compressedBase64);
      
      toast({
        title: "Image ready",
        description: `Image compressed to ${sizeInMB.toFixed(2)}MB`,
      });
    } catch (error) {
      console.error("Error compressing image:", error);
      toast({
        title: "Error",
        description: "Failed to process image. Please try another file.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    
    const updateData = {
      firstName: trimmedFirstName || null,
      lastName: trimmedLastName || null,
      profileImageUrl: profileImageUrl || null,
    };
    
    console.log("Saving profile:", {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      hasImage: !!updateData.profileImageUrl,
      imageLength: updateData.profileImageUrl?.length || 0,
    });
    
    // Send null for empty fields to clear them, or the actual value
    updateProfileMutation.mutate(updateData);
  };

  const handleCancel = () => {
    // Reset to original user values
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setProfileImageUrl(user?.profileImageUrl || "");
    setPreviewImage(null);
    setIsEditing(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const initials = (firstName && lastName)
    ? `${firstName[0]}${lastName[0]}`
    : firstName
    ? firstName[0]
    : user?.email?.[0]?.toUpperCase() || "U";

  const displayName = firstName || user?.email || "User";
  const displayImage = previewImage || user?.profileImageUrl;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <Card data-testid="card-user-info">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarImage src={displayImage || undefined} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-primary hover:bg-primary/90 shadow-lg"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload profile picture"
                  >
                    <Camera className="w-5 h-5" />
                  </Button>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold" data-testid="text-user-name">
                  {displayName}
                </h2>
                <p className="text-muted-foreground" data-testid="text-user-email">
                  {user?.email}
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
              {isEditing && previewImage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPreviewImage(null);
                    setProfileImageUrl(user?.profileImageUrl || "");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove Photo
                </Button>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your first name"
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your last name"
                    className={!isEditing ? "bg-muted/50" : ""}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. It's linked to your Google account.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <>
                  <Button onClick={() => setIsEditing(true)} className="flex-1">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updateProfileMutation.isPending}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Onboarding Status</h3>
                <p className="text-sm text-muted-foreground">
                  {user?.onboardingStatus === 'completed' ? 'Completed' : `Step ${user?.onboardingStatus?.replace('step_', '') || '1'}`}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">KYC Status</h3>
                <p className="text-sm text-muted-foreground">
                  {user?.kycCompleted ? 'Verified' : 'Pending'}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Account Aggregator</h3>
                <p className="text-sm text-muted-foreground">
                  {user?.aaToken ? 'Connected' : 'Not Connected'}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">UPI Mandate</h3>
                <p className="text-sm text-muted-foreground">
                  {user?.mandateId ? 'Approved' : 'Not Set Up'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
