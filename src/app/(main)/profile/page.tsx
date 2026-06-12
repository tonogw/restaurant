// Isi File: src/app/(main)/profile/page.tsx
"use client";

import React, { useEffect, useState } from "react";
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
import Navbar from "@/app/home/parts/navbar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Span } from "next/dist/trace";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //   FETCH PROFILE DATA
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: authService.profile,
  });

  const endUser = profileData?.data;

  //   INIT REACT HOOK FORM SCHEMA WITH OMIT
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateProfileSchema),
  });

  // SYNC DATA DEFAULT PRIOR UPDATE
  useEffect(() => {
    if (endUser) {
      setValue("name", endUser.name);
      setValue("email", endUser.email);
      setValue("phone", endUser.phone);
    }
  }, [endUser, setValue]);

  // MUTATION PIPELINE
  const updateMutation = useMutation({
    mutationFn: authService.update,
    onSuccess: () => {
      setSuccessMessage("Profile update successfully!");
      setErrorMessage(null);
      setIsOpen(false);

      // FORCE SYNC DATA
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      // CLEAR SUCCESS MESSAGE AFTER 3 SECS
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setErrorMessage(
        error.response?.data?.message || "Failed to update prorfile.",
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
                src={endUser?.avatar || "/images/avatar-placeholder.png"}
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
              📍 Delivery Address
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl w-full text-left">
              📄 My Orders
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-red-600 rounded-xl w-full text-left mt-4 border-t border-gray-50 pt-4">
              🔒 Logout
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
                src={endUser?.avatar || "/images/avatar-placeholder.png"}
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
              className="h-[75vh] bg-white rounded-t-[32px] p-8 border-t border-gray-100 shadow-2xl flex flex-col items-center"
            >
              <div className="w-131 max-w-xl">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle className="text-2xl font-extrabold text-gray-900 ">
                    Edit Profile Information
                  </SheetTitle>
                  <SheetDescription className="text-gray-400 text-sm">
                    Update Profile of Name and Phone number
                  </SheetDescription>
                </SheetHeader>
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
                  <button type="submit">
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
