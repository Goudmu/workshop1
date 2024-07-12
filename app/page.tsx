import SessionProviderComp from "@/components/own/sessionProviderComp";
import LoginComponent from "@/components/own/user/loginForm";

export default function Home() {
  return (
    <main className=" flex justify-center items-center h-screen">
      <SessionProviderComp>
        <LoginComponent />
      </SessionProviderComp>
    </main>
  );
}
