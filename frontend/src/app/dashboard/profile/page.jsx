"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LogoutButton from "@/components/profile/logout-buttom";
import ProfileForm from "@/components/profile/profile-from";
import TrainerSection from "@/components/profile/trainer-section";
import UserTrainerLink from "@/components/profile/user-trainer-link";

export default function PerfilPage() {
  const router = useRouter();

  const [profile, setProfile] = useState({});
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchStudents()
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/user/me", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error al obtener perfil");

      const userData = await res.json();

      setProfile(userData);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    }
  };

  const updateProfile = async (profileData) => {

    try {
      const res = await fetch("/api/auth/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al actualizar el perfil");
      }

      const updatedUser = await res.json();
      fetchProfile()
      return updatedUser;
    } catch (error) {
      console.error("Error en updateProfile:", error);
      throw error;
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/auth/trainer/students", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al actualizar el perfil");
      }

      const dataStudents = await res.json();
      setStudents(dataStudents)
    } catch (error) {
      console.error("Error en Students:", error);
      throw error;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 p-3 pb-16">
      <div className="container max-w-md">
        <div className="flex items-center justify-between mb-1">
          <Button
            variant="ghost"
            className="group"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Volver
          </Button>
          <LogoutButton />
        </div>
        <ProfileForm
          profile={profile}
          setProfile={setProfile}
          onSubmit={async (updatedData) => {
            const updated = await updateProfile(updatedData);
            setProfile(updated);
          }}
        >

          {profile.role === "trainer" ? (
            <TrainerSection
            students={students}
            profile={profile}
          ></TrainerSection>
          ) : (
            <UserTrainerLink profile={profile} onChange={fetchProfile}/>
          )}
        </ProfileForm>
      </div>
    </div>
  );
}
