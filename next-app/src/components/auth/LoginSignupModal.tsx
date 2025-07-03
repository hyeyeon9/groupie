"use client";
import { useModalStore } from "@/store/modalStore";
import { Dialog, DialogPanel } from "@headlessui/react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";


export default function LoginSignupModal() {
  const { openModal, close } = useModalStore();

  return (
    <Dialog open={!!openModal} onClose={close} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6">
          {openModal === "login" ? <LoginForm /> : <SignupForm />}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
