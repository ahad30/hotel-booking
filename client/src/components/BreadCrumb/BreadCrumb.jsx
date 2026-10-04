import { Link, useLocation } from "react-router-dom";
import { LuChevronRight } from "react-icons/lu";

// "add-hotel" -> "Add hotel"; ids and other long tokens are shortened.
const prettify = (segment) => {
  if (/^[a-f0-9]{24}$/i.test(segment)) return `#${segment.slice(-6)}`;
  const text = segment.replace(/[-_]/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Page heading for dashboard screens: breadcrumb trail plus the current page title.
const BreadCrumb = () => {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  let href = "";

  const crumbs = parts.map((part, i) => {
    href += `/${part}`;
    return { label: part === "admin" ? "Dashboard" : part === "user" ? "Account" : prettify(part), to: part === "admin" ? "/admin/home" : href, last: i === parts.length - 1 };
  });

  return (
    <div className="mb-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
          {crumbs.map((c) => (
            <li key={c.to} className="flex items-center gap-1.5">
              {c.last ? (
                <span className="font-medium text-ink-900" aria-current="page">
                  {c.label}
                </span>
              ) : (
                <>
                  <Link to={c.to} className="hover:text-ink-900">
                    {c.label}
                  </Link>
                  <LuChevronRight className="h-3.5 w-3.5" />
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-950">{crumbs[crumbs.length - 1]?.label}</h1>
    </div>
  );
};

export default BreadCrumb;
