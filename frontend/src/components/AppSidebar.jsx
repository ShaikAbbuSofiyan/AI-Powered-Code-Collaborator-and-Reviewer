import { Link, useLocation } from "react-router-dom";
import {
  Code2,
  LayoutGrid,
  FolderGit2,
  Users,
  MessageSquare,
  Settings,
  LifeBuoy,
  FilePenLine
} from "lucide-react";
import { useSelector } from "react-redux";

const main = [
  { to: "/dashboard", icon: LayoutGrid, label: "Overview" },
  { to: "/workspace", icon: FolderGit2, label: "Projects" },
  { to: "/workspace", icon: FilePenLine, label: "Tasks" },
  { to: "#", icon: Users, label: "Team" },
  { to: "#", icon: MessageSquare, label: "Conversations" },
];

const footer = [
  { to: "#", icon: LifeBuoy, label: "Support" },
  { to: "#", icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const user = useSelector(state => state.auth.user);
  const plan = "Pro"
  return (
    <aside
      className="
        hidden md:flex
        flex-col
        w-[280px]
        h-screen
        sticky
        top-0
        bg-[#020817]
        border-r
        border-white/10
        text-white
      "
    >
      {/* LOGO */}
      <div className="h-20 border-b border-white/10 flex items-center px-6">
        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg">
          <Code2 className="w-5 h-5 text-white" />
        </div>

        <span className="ml-3 text-xl font-semibold tracking-tight">
          CodeCollabAI
        </span>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        <div className="px-4 py-6">
          <p className="text-[12px] uppercase tracking-[0.15em] text-gray-400 mb-4 px-3">
            Workspace
          </p>

          <nav className="space-y-2">
            {main.map((item) => {
              const active = pathname === item.to;

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`
                    flex items-center gap-3
                    px-4 py-3
                    rounded-2xl
                    transition-all duration-200
                    text-[15px]
                    font-medium

                    ${
                      active
                        ? "bg-violet-500/15 border border-violet-500/20 text-white"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      active ? "text-violet-400" : "text-gray-400"
                    }`}
                  />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* FOOTER */}
        <div className="border-t border-white/10 p-4">
          <div className="space-y-1">
            {footer.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  text-gray-300
                  hover:bg-white/5
                  hover:text-white
                  transition-all
                "
              >
                <item.icon className="w-5 h-5 text-gray-400" />

                <span className="text-[15px]">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* USER CARD */}
          <div
            className="
              mt-5
              bg-white/5
              rounded-2xl
              px-4 py-3
              flex items-center gap-3
            "
          >
            <div
              className="
                w-11 h-11
                rounded-full
                bg-linear-to-br
                from-violet-500
                to-indigo-500
                flex items-center justify-center
                text-sm font-semibold
              "
            >
              {user?.name[0]}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.name.toUpperCase()}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {plan}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}