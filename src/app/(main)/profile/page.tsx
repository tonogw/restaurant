// Isi File: src/app/(main)/profile/page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/services/authService";
import {
  UpdateProfileSchema,
  type UpdateUserInput,
} from "@/lib/validations/auth";
import { AxiosError } from "axios";
import Navbar from "@/components/shared/Navbar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Camera } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
// import { Span } from "next/dist/trace";
// import { file } from "zod";
// import delAddress from "icons/"

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // HANDLE IMAGE STATE
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  //   FETCH PROFILE DATA
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: authService.profile,
  });

  const endUser = profileData?.data;

  const currentAvatar = endUser?.avatar || "/images/avatar-placeholder.png";
  //   INIT REACT HOOK FORM SCHEMA WITH OMIT
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateProfileSchema),
  });

  const logout = useAuthStore((state) => state.logout);

  // SYNC DATA DEFAULT PRIOR UPDATE
  useEffect(() => {
    if (endUser) {
      setValue("name", endUser.name);
      setValue("email", endUser.email);
      setValue("phone", endUser.phone);
    }
  }, [endUser, setValue]);

  //   BROWSE FILE EXPLORER
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // MAXIMUM IMAGE FILE 2MB WITH FORMAT JPG/ PNG
    if (!file.type.startsWith("image/")) {
      setAvatarError("File must be an image (.png/.jpg).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Image size must be less than 2MB.");
      return;
    }

    setAvatarError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // MUTATION PIPELINE TEXT + AVATAR
  const updateMutation = useMutation({
    mutationFn: async (formData: UpdateUserInput) => {
      // IMAGE FILE INCLUDED
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);

      if (selectedFile) {
        payload.append("avatar", selectedFile);
      }

      // PUSH API PUT
      //   const response = await authService.update(payload as any);
      //   return response;
      return await authService.update(payload);
    },

    onSuccess: () => {
      setSuccessMessage("Profile or Photo updated successfully!");
      setErrorMessage(null);
      setIsOpen(false);
      setSelectedFile(null);

      // FORCE SYNC DATA
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      // CLEAR SUCCESS MESSAGE AFTER 3 SECS
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setErrorMessage(
        error.response?.data?.message || "Failed to update profile.",
      );
      setSuccessMessage(null);
    },
  });

  const onSubmit = (data: UpdateUserInput) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-20 text-center font-bold animate-pulse">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-nunito pt-28 pb-20 px-6 md:px-16">
      <Navbar isLightPage={true} />
      <div className="max-w-300 mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* LEFT SIDE:  NAVIGATION SIDEBAR */}
        <aside className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              <Image
                // src={endUser?.avatar || "/images/avatar-placeholder.png"}
                src={currentAvatar}
                alt="avatar"
                width={48}
                height={48}
                // fill
                className="object-cover"
              />
            </div>
            <span className="font-bold text-gray-900 text-base">
              {endUser?.name}
            </span>
          </div>
          <nav className="flex flex-col gap-2 font-semibold text-sm text-gray-600">
            <button className="flex items-center gap-3 px-3 py-2.5 text-[#B81E1E] bg-red-50/50 rounded-xl w-full text-left">
              <Image
                src="/icons/icon-delivery-address.svg"
                alt="Icon location"
                width={24}
                height={24}
              />
              Delivery Address
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl w-full text-left">
              <Image
                src="/icons/icon-my-order.svg"
                alt="Icon my Orders"
                width={24}
                height={24}
              />
              My Orders
            </button>
            <button
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-red-600 rounded-xl w-full text-left mt-4 border-t border-gray-50 pt-4"
            >
              <Image
                src="/icons/icon-logout.svg"
                alt="icon logout"
                width={24}
                height={24}
              />
              Logout
            </button>
          </nav>
        </aside>

        {/* RIGHT SIDE: FORM DETAIL OF USER PROFILE DATA*/}
        <main className="md:col-span-3 bg-white p-8 rounded-3xl border border-gray-100 shadow-xs flex flex-col gap-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Profile
          </h1>

          {/* NOTIFICATION STATUS BANNER */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-100 transition-all">
              ✅ {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 transition-all">
              ⚠ {errorMessage}
            </div>
          )}

          {/* AVATAR ZONE */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500 shadow-sm">
              <Image
                // src={endUser?.avatar || "/images/avatar-placeholder.png"}
                src={currentAvatar}
                alt="Profile Pic"
                width={120}
                height={120}
                className="object-cover"
              />
            </div>
          </div>

          {/* FORM INPUT INTERACTIVE */}

          <div className="grid grid-cols-1 gap-6 text-sm max-w-xl mt-4">
            <div className="flex justify-between py-3 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Name</span>
              <span className="text-gray-900 font-bold">{endUser?.name}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Email</span>
              <span className="text-gray-900 font-bold">{endUser?.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Nomor Handphone</span>
              <span className="text-gray-900 font-bold">{endUser?.phone}</span>
            </div>
          </div>

          {/* SHEET BOTTOM SIDE */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="w-131 max-w-xl bg-[#C12116] hover:bg-[#961818] text-white font-bold py-3.5 rounded-full transition-all mt-6 shadow-sm cursor-pointer">
                Update Profile
              </button>
            </SheetTrigger>

            {/* DRAW SHEET FROM BUTTON  */}
            <SheetContent
              side="bottom"
              className="h-[75vh] bg-white rounded-t-[32px] p-8 border-t border-gray-100 shadow-2xl flex flex-col items-center max-w-90.25 sm:max-w-131 mx-auto left-0 right-0"
            >
              <div className="w-131 px-4 max-w-xl">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="text-2xl font-extrabold text-gray-900 ">
                    Edit Profile Information
                  </SheetTitle>
                  <SheetDescription className="text-gray-400 text-sm">
                    Update Profile of Name and Phone number
                  </SheetDescription>
                </SheetHeader>

                {/* PICTURE PROFILE UPDATE */}
                <div className="w-full flex flex-col items-center gap-2 my-4">
                  <div className="relative w-24 h-24 rouded-full overflow-hidden border-2 border-dashed border-gray-300 bg-grayy-50 group">
                    <Image
                      src={previewUrl || currentAvatar}
                      alt="Preview Avatar"
                      fill
                      className="object-cover"
                    />
                    {/* HOVER BUTTON */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera size={20} className="text-white fill-gray-800" />
                    </div>
                  </div>

                  {/* BUTTON TO BROWSE */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-[#C12116] hover:underline cursor-pointer"
                  >
                    {selectedFile ? "Change Selected Photo" : "Edit Photo"}
                  </button>
                  {/* FILE EXPLORER */}
                  <input
                    id="image-file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                  />
                  {/* ALLERT IF DIFF FILE FORMAT */}
                  {avatarError && (
                    <span className="text-red-600 text-xs font-bold mt-1">
                      ⚠ {avatarError}
                    </span>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5 mt-2"
                >
                  {/* FULL NAME */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register("name")}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm font-semibold focus:ring-1 focus:ring-[#C12116] bg-gray-50/20"
                    />
                    {errors.name && (
                      <span className="text-red-600 text-xs font-bold pl-1">
                        {errors.name.message}{" "}
                      </span>
                    )}
                  </div>
                  {/* EMAIL ADDRESS */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm font-semibold focus:ring-1 focus:ring-[#C12116] bg-gray-50/20"
                    />
                    {errors.email && (
                      <span className="text-red-600 text-xs font-bold pl-1">
                        {errors.email.message}{" "}
                      </span>
                    )}
                  </div>
                  {/* PHONE NUMBER */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">
                      Handphone Number
                    </label>
                    <input
                      id="phone"
                      type="text"
                      {...register("phone")}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-black text-sm font-semibold focus:ring-1 focus:ring-[#C12116] bg-gray-50/20"
                    />
                    {errors.phone && (
                      <span className="text-red-600 text-xs font-bold pl-1">
                        {errors.phone.message}{" "}
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#C12116] hover:bg-[#961818] text-white font-bold py-4 rounded-full transition-all mt-4 shadow-md cursor-pointer text-sm disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    {updateMutation.isPending
                      ? "Saving New Data..."
                      : "Save Changes"}
                  </button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </main>
      </div>
    </div>
  );
}
