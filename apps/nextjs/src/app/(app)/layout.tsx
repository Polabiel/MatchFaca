import { NavBar } from "../_components/nav-bar";

export default function AppLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative mx-auto max-w-lg pb-20">
        {props.children}
      </div>
      <NavBar />
    </>
  );
}
