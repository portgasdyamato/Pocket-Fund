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
import { LogOut, Upload, User, Camera, Save, X, Shield, Zap, Globe, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setProfileImageUrl(user.profileImageUrl || "");
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName?: string; lastName?: string; profileImageUrl?: string }) => {
      const response = await apiRequest("/api/user/profile", "PATCH", data);
      return await response.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/auth/user"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setFirstName(updatedUser.firstName || "");
      setLastName(updatedUser.lastName || "");
      setProfileImageUrl(updatedUser.profileImageUrl || "");
      toast({
        title: "Database Synchronized",
        description: "Your digital identity has been updated.",
      });
      setIsEditing(false);
      setPreviewImage(null);
    },
    onError: (error: any) => {
      toast({
        title: "Sync Error",
        description: error?.message || "Failed to update profile protocols.",
        variant: "destructive",
      });
    },
  });

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setPreviewImage(compressed);
      setProfileImageUrl(compressed);
    } catch (error) {
      toast({ title: "Visual Array Error", description: "Failed to process image.", variant: "destructive" });
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate({
      firstName: firstName.trim() || null,
      lastName: lastName.trim() || null,
      profileImageUrl: profileImageUrl || null,
    });
  };

  const handleLogout = () => { window.location.href = "/api/logout"; };

  const initials = (firstName && lastName)
    ? `${firstName[0]}${lastName[0]}`
    : user?.email?.[0]?.toUpperCase() || "U";

  const displayImage = previewImage || user?.profileImageUrl;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none opacity-50" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center p-10 rounded-[40px] glass-morphism border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent group-hover:from-primary/10 transition-all duration-700" />
                
                {/* Avatar Matrix */}
                <div className="relative mb-8">
                   <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-125 animate-pulse" />
                   <div className="relative w-48 h-48 rounded-[38%] border-4 border-white/10 p-2 transform rotate-3 hover:rotate-0 transition-all duration-500 overflow-hidden">
                      <Avatar className="w-full h-full rounded-[30%] border-2 border-primary/20">
                        <AvatarImage src={displayImage || undefined} className="object-cover" />
                        <AvatarFallback className="text-5xl font-black bg-white/5 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-all"
                        >
                          <Camera className="w-8 h-8 text-white mb-2" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Update Array</span>
                        </button>
                      )}
                   </div>
                   <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </div>

                <div className="relative z-10 w-full">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Subject Identity</h3>
                  <h2 className="text-3xl font-black tracking-tighter mb-1">{firstName ? `${firstName} ${lastName}` : "Authenticated User"}</h2>
                  <p className="text-white/40 font-bold text-sm lowercase">{user?.email}</p>
                  
                  <div className="flex justify-center gap-4 mt-8">
                    {!isEditing ? (
                      <>
                        <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 rounded-2xl premium-shadow">
                          Modify Identity
                        </Button>
                        <Button variant="outline" onClick={handleLogout} className="border-white/10 bg-white/5 font-black px-6 h-12 rounded-2xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 active:scale-95 transition-all">
                          Terminate Session
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={handleSave} disabled={updateProfileMutation.isPending} className="bg-green-500 hover:bg-green-600 text-white font-black px-8 h-12 rounded-2xl shadow-lg shadow-green-500/20">
                          {updateProfileMutation.isPending ? "Syncing..." : "Commit Changes"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="border-white/10 bg-white/5 font-black px-6 h-12 rounded-2xl">
                          Abort
                        </Button>
                      </>
                    ) }
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats / Badges */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="grid grid-cols-2 gap-4"
            >
               {[
                 { label: "Security", val: "Tier 1", icon: <Shield className="w-4 h-4" /> },
                 { label: "Efficiency", val: "High", icon: <Zap className="w-4 h-4" /> },
                 { label: "Region", val: "Global", icon: <Globe className="w-4 h-4" /> },
                 { label: "Matrix", val: "Active", icon: <Cpu className="w-4 h-4" /> },
               ].map((s, i) => (
                 <div key={i} className="p-5 rounded-[24px] glass-morphism border-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                      {s.icon}
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">{s.label}</p>
                       <p className="text-sm font-black mt-0.5">{s.val}</p>
                    </div>
                 </div>
               ))}
            </motion.div>
          </div>

          {/* Right Column: Details & Settings */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Profile Details Form */}
              <div className="p-10 rounded-[40px] glass-morphism border-white/5">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                     <User className="w-5 h-5" />
                   </div>
                   <h2 className="text-xl font-black uppercase tracking-widest">Protocol Attributes</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Given Name</Label>
                    <Input
                      val={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditing}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-bold disabled:opacity-40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Surname</Label>
                    <Input
                      val={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditing}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-bold disabled:opacity-40"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Communications Link</Label>
                    <Input
                      val={user?.email}
                      disabled
                      className="h-14 bg-white/[0.02] border-white/5 rounded-2xl px-6 font-bold opacity-40 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Security & System Status */}
              <div className="p-10 rounded-[40px] glass-morphism border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                   <Shield className="w-12 h-12 text-white/[0.03]" />
                </div>
                <div className="flex items-center gap-3 mb-10">
                   <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                     <Shield className="w-5 h-5" />
                   </div>
                   <h2 className="text-xl font-black uppercase tracking-widest">System Clearances</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[
                     { label: "KYC Verification", status: user?.kycCompleted ? "Secured" : "Pending", color: user?.kycCompleted ? "text-green-400" : "text-orange-400" },
                     { label: "Account Aggregator", status: user?.aaToken ? "Connected" : "Inactive", color: user?.aaToken ? "text-primary" : "text-white/40" },
                     { label: "Onboarding State", status: "Phase 4", color: "text-blue-400" },
                     { label: "UPI Authorization", status: user?.mandateId ? "Active" : "Disabled", color: user?.mandateId ? "text-green-400" : "text-red-400" },
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-center p-6 bg-white/5 rounded-[24px] border border-white/5 group hover:bg-white/[0.08] transition-all">
                        <span className="text-xs font-bold text-white/60 tracking-tight">{item.label}</span>
                        <div className={`flex items-center gap-2 font-black text-xs uppercase tracking-widest ${item.color}`}>
                           <div className={`w-1.5 h-1.5 rounded-full bg-current ${item.color.includes('400') || item.color.includes('primary') ? 'animate-pulse' : ''}`} />
                           {item.status}
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
