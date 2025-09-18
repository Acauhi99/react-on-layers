import { Link } from "@tanstack/react-router";

export default function Header() {
	const links = [
		{ to: "/dashboard", label: "Dashboard" },
		{ to: "/transactions", label: "Transações" }
	] as const;

	return (
		<div>
			<div className="flex flex-row items-center justify-between px-2 py-1">
				<Link to="/dashboard" className="text-xl font-bold">
					Controle Financeiro
				</Link>
				<nav className="flex gap-4 text-lg">
					{links.map(({ to, label }) => {
						return (
							<Link key={to} to={to} className="[&.active]:font-bold hover:underline">
								{label}
							</Link>
						);
					})}
				</nav>
			</div>
			<hr />
		</div>
	);
}
