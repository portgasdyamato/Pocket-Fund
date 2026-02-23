import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut, Camera, User, Shield, Zap, Globe, Cpu,
  Edit3, Check, XCircle, ChevronRight, Mail, Lock
} from "lucide-react";
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
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
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
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      profileImageUrl: profileImageUrl || undefined,
    });
  };

  const handleLogout = () => { window.location.href = "/api/logout"; };

  const initials = (firstName && lastName)
    ? `${firstName[0]}${lastName[0]}`
    : user?.email?.[0]?.toUpperCase() || "U";

  const displayImage = previewImage || user?.profileImageUrl;

  const statusItems = [
    { label: "KYC Verification", status: user?.kycCompleted ? "Secured" : "Pending", color: user?.kycCompleted ? "text-green-400" : "text-orange-400", dot: user?.kycCompleted ? "bg-green-400" : "bg-orange-400" },
    { label: "Account Aggregator", status: user?.aaToken ? "Connected" : "Inactive", color: user?.aaToken ? "text-[#6366f1]" : "text-white/40", dot: user?.aaToken ? "bg-[#6366f1]" : "bg-white/20" },
    { label: "Onboarding State", status: "Phase 4", color: "text-[#0ea5e9]", dot: "bg-[#0ea5e9]" },
    { label: "UPI Authorization", status: user?.mandateId ? "Active" : "Disabled", color: user?.mandateId ? "text-green-400" : "text-red-400", dot: user?.mandateId ? "bg-green-400" : "bg-red-400" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 -right-32 w-72 h-72 bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 relative z-10 max-w-5xl">

        {/* ─── Mobile: Hero Avatar Banner ─── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden mb-6"
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/10 p-6"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))",
              backdropFilter: "blur(12px)"
            }}
          >
            {/* Action Bar */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Subject Identity</p>
                <p className="text-[10px] font-bold text-primary mt-0.5">Authenticated Operator</p>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary text-xs font-black hover:bg-primary/30 transition-all active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-black hover:bg-green-600 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {updateProfileMutation.isPending ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-xs font-black hover:bg-white/20 transition-all active:scale-95"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Avatar + Name Row */}
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/30 relative">
                  <Avatar className="w-full h-full rounded-2xl">
                    <AvatarImage src={displayImage || undefined} className="object-cover" />
                    <AvatarFallback className="text-2xl font-black bg-primary/20 text-primary rounded-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40 hover:bg-primary/90 transition-all active:scale-90"
                  >
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-black tracking-tight truncate">
                  {firstName ? `${firstName} ${lastName}` : "Authenticated User"}
                </h2>
                <p className="text-xs text-white/40 font-bold truncate mt-0.5">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-wider">Session Active</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-4 gap-2 mt-5">
              {[
                { label: "Security", val: "T1", icon: <Shield className="w-3 h-3" /> },
                { label: "Power", val: "High", icon: <Zap className="w-3 h-3" /> },
                { label: "Region", val: "Global", icon: <Globe className="w-3 h-3" /> },
                { label: "Matrix", val: "Active", icon: <Cpu className="w-3 h-3" /> },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                  <div className="text-primary mb-1">{s.icon}</div>
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">{s.label}</p>
                  <p className="text-[10px] font-black text-white mt-0.5">{s.val}</p>
                </div>
              ))}
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
        </motion.div>

        {/* ─── Main Grid Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* ──────── Left Column (Desktop Only Avatar Card) ──────── */}
          <div className="hidden lg:block lg:col-span-5 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex flex-col items-center text-center p-10 rounded-[40px] border border-white/5 relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                
                {/* Avatar */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-primary/25 blur-3xl rounded-full scale-125 animate-pulse" />
                  <div className="relative w-44 h-44 rounded-[32%] border-4 border-white/10 p-2 transform rotate-3 hover:rotate-0 transition-all duration-500 overflow-hidden">
                    <Avatar className="w-full h-full rounded-[28%] border-2 border-primary/20">
                      <AvatarImage src={displayImage || undefined} className="object-cover" />
                      <AvatarFallback className="text-5xl font-black bg-white/5 text-primary rounded-[28%]">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-all"
                      >
                        <Camera className="w-8 h-8 text-white mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Update</span>
                      </button>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </div>

                <div className="relative z-10 w-full">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Subject Identity</h3>
                  <h2 className="text-3xl font-black tracking-tighter mb-1">
                    {firstName ? `${firstName} ${lastName}` : "Authenticated User"}
                  </h2>
                  <p className="text-white/40 font-bold text-sm lowercase">{user?.email}</p>
                  
                  <div className="flex flex-col gap-2 mt-8">
                    {!isEditing ? (
                      <>
                        <Button onClick={() => setIsEditing(true)} className="w-full bg-primary hover:bg-primary/90 text-white font-black h-12 rounded-2xl premium-shadow">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Modify Identity
                        </Button>
                        <Button variant="outline" onClick={handleLogout} className="w-full border-white/10 bg-white/5 font-black h-12 rounded-2xl hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 active:scale-95 transition-all">
                          <LogOut className="w-4 h-4 mr-2" />
                          Terminate Session
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={handleSave} disabled={updateProfileMutation.isPending} className="w-full bg-green-500 hover:bg-green-600 text-white font-black h-12 rounded-2xl shadow-lg shadow-green-500/20">
                          <Check className="w-4 h-4 mr-2" />
                          {updateProfileMutation.isPending ? "Syncing..." : "Commit Changes"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full border-white/10 bg-white/5 font-black h-12 rounded-2xl">
                          <XCircle className="w-4 h-4 mr-2" />
                          Abort
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { label: "Security", val: "Tier 1", icon: <Shield className="w-4 h-4" /> },
                { label: "Efficiency", val: "High", icon: <Zap className="w-4 h-4" /> },
                { label: "Region", val: "Global", icon: <Globe className="w-4 h-4" /> },
                { label: "Matrix", val: "Active", icon: <Cpu className="w-4 h-4" /> },
              ].map((s, i) => (
                <div key={i} className="p-4 rounded-[22px] border border-white/5 flex items-center gap-3"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">{s.label}</p>
                    <p className="text-sm font-black mt-0.5">{s.val}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ──────── Right Column ──────── */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Profile Details Form */}
              <div className="p-5 sm:p-8 lg:p-10 rounded-3xl sm:rounded-[40px] border border-white/5"
                style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}
              >
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h2 className="text-base sm:text-xl font-black uppercase tracking-widest">Protocol Attributes</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-6 sm:gap-y-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Given Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={!isEditing}
                        className="h-12 sm:h-14 bg-white/[0.04] border-white/10 rounded-2xl pl-10 pr-4 font-bold disabled:opacity-40 focus:border-primary focus:bg-white/[0.06] transition-all text-sm sm:text-base"
                        placeholder="First Name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Surname</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <Input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={!isEditing}
                        className="h-12 sm:h-14 bg-white/[0.04] border-white/10 rounded-2xl pl-10 pr-4 font-bold disabled:opacity-40 focus:border-primary focus:bg-white/[0.06] transition-all text-sm sm:text-base"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Communications Link</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="h-12 sm:h-14 bg-white/[0.01] border-white/5 rounded-2xl pl-10 pr-4 font-bold opacity-40 cursor-not-allowed text-sm sm:text-base"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                    </div>
                  </div>
                </div>

                {/* Mobile Save/Logout Buttons */}
                <div className="lg:hidden flex flex-col gap-2 mt-6">
                  {!isEditing ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-all active:scale-95"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-black text-red-400">Terminate Session</span>
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Security & System Status */}
              <div className="p-5 sm:p-8 lg:p-10 rounded-3xl sm:rounded-[40px] border border-white/5 relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}
              >
                <div className="absolute top-0 right-0 p-6 sm:p-8 pointer-events-none">
                  <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white/[0.02]" />
                </div>
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h2 className="text-base sm:text-xl font-black uppercase tracking-widest">System Clearances</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {statusItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-white/5 group hover:bg-white/[0.05] transition-all"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse ${item.dot}`} />
                        <span className="text-xs sm:text-sm font-bold text-white/60 truncate">{item.label}</span>
                      </div>
                      <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest flex-shrink-0 ml-2 ${item.color}`}>
                        {item.status}
                      </span>
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
