import SessionProviderComp from "@/components/own/sessionProviderComp";
import LoginComponent from "@/components/own/user/loginForm";

export default function Home() {
  return (
    <main>
      <SessionProviderComp>
        <LoginComponent />
      </SessionProviderComp>
    </main>
  );
}
